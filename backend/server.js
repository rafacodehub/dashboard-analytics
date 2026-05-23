require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const { v4: uuid } = require('uuid');
const { getDb } = require('./db');
const { parseWorkbook, cleanup } = require('./services/importer');
const { generateInsights } = require('./services/ai');
const { buildPdfBuffer } = require('./services/pdf');

const app = express();
const PORT = process.env.PORT || 3000;
const APP_BASE_URL = process.env.APP_BASE_URL || `http://localhost:${PORT}`;
const upload = multer({ dest: path.join(__dirname, 'uploads') });

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

function num(v) {
  const n = Number(String(v ?? '').replace(/[^0-9,-.]/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}
function pick(row, names) {
  for (const name of names) {
    if (row[name] !== undefined && row[name] !== '') return row[name];
  }
  return '';
}

app.get('/api/health', async (_req, res) => {
  const db = await getDb();
  const reportCount = await db.get('SELECT COUNT(*) as total FROM reports');
  res.json({ ok: true, database: true, reportCount: reportCount.total, time: new Date().toISOString() });
});

app.post('/api/sync', async (req, res) => {
  const db = await getDb();
  const { kpis = [], reports = [], expenses = [] } = req.body || {};
  await db.exec('BEGIN');
  try {
    await db.run('DELETE FROM kpis');
    await db.run('DELETE FROM reports WHERE source = ?', 'frontend-sync');
    await db.run('DELETE FROM expenses');
    for (const k of kpis) await db.run('INSERT INTO kpis(label,value,note) VALUES(?,?,?)', [k.label, k.value, k.note]);
    for (const r of reports) await db.run('INSERT INTO reports(area,indicador,trimestre,valor,meta,status,source) VALUES(?,?,?,?,?,?,?)', [r.area, r.indicador, r.trimestre, num(r.valorNum ?? r.valor), num(r.metaNum ?? r.meta), r.status, 'frontend-sync']);
    for (const e of expenses) await db.run('INSERT INTO expenses(area,despesa,orcamento,variacao,status,acao) VALUES(?,?,?,?,?,?)', [e.area, num(e.despesa), num(e.orcamento), num(e.variacao), e.status, e.acao]);
    await db.run('INSERT INTO audit_log(action,details) VALUES(?,?)', ['sync', `reports=${reports.length}; kpis=${kpis.length}; expenses=${expenses.length}`]);
    await db.exec('COMMIT');
    res.json({ ok: true, saved: { kpis: kpis.length, reports: reports.length, expenses: expenses.length } });
  } catch (err) {
    await db.exec('ROLLBACK');
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/import/preview', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, error: 'Arquivo não enviado.' });
  const db = await getDb();
  try {
    const parsed = parseWorkbook(req.file.path, req.file.originalname);
    await db.run('INSERT INTO imports(id,filename,total_rows,payload,status) VALUES(?,?,?,?,?)', [parsed.importToken, parsed.filename, parsed.totalRows, JSON.stringify(parsed.rows), 'preview']);
    await db.run('INSERT INTO audit_log(action,details) VALUES(?,?)', ['import-preview', parsed.filename]);
    cleanup(req.file.path);
    res.json({ ...parsed, rows: undefined });
  } catch (err) {
    cleanup(req.file.path);
    res.status(400).json({ ok: false, error: err.message });
  }
});

app.post('/api/import/commit', async (req, res) => {
  const { importToken } = req.body || {};
  const db = await getDb();
  const imported = await db.get('SELECT * FROM imports WHERE id = ?', importToken);
  if (!imported) return res.status(404).json({ ok: false, error: 'Importação não encontrada.' });
  const rows = JSON.parse(imported.payload || '[]');
  await db.exec('BEGIN');
  try {
    const batchId = `import:${importToken}`;
    await db.run('DELETE FROM reports WHERE source = ?', batchId); // rollback/reimport seguro
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      await db.run('INSERT INTO reports(area,indicador,trimestre,valor,meta,status,source) VALUES(?,?,?,?,?,?,?)', [
        pick(row, ['Área', 'Area']) || 'Geral',
        pick(row, ['Indicador']) || 'Indicador',
        pick(row, ['Trimestre']) || '',
        num(pick(row, ['Valor', 'Receita ABC', 'Despesa'])),
        num(pick(row, ['Meta', 'Orçamento', 'Orcamento'])),
        pick(row, ['Status', 'Situação', 'Situacao']) || 'OK',
        batchId
      ]);
    }
    await db.run('UPDATE imports SET status = ? WHERE id = ?', ['committed', importToken]);
    await db.run('INSERT INTO audit_log(action,details) VALUES(?,?)', ['import-commit', `${imported.filename}; rows=${rows.length}`]);
    await db.exec('COMMIT');
    res.json({ ok: true, rowsSaved: rows.length, rollbackToken: importToken });
  } catch (err) {
    await db.exec('ROLLBACK');
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/import/rollback', async (req, res) => {
  const { rollbackToken } = req.body || {};
  const db = await getDb();
  await db.run('DELETE FROM reports WHERE source = ?', `import:${rollbackToken}`);
  await db.run('UPDATE imports SET status = ? WHERE id = ?', ['rolled_back', rollbackToken]);
  await db.run('INSERT INTO audit_log(action,details) VALUES(?,?)', ['import-rollback', rollbackToken]);
  res.json({ ok: true, rolledBack: rollbackToken });
});

app.get('/api/reports', async (_req, res) => {
  const db = await getDb();
  const rows = await db.all('SELECT * FROM reports ORDER BY created_at DESC LIMIT 500');
  res.json({ rows });
});

app.get('/api/ai/insights', async (_req, res) => {
  const db = await getDb();
  const reports = await db.all('SELECT * FROM reports ORDER BY created_at DESC LIMIT 500');
  const kpis = await db.all('SELECT * FROM kpis ORDER BY created_at DESC LIMIT 20');
  const expenses = await db.all('SELECT * FROM expenses ORDER BY created_at DESC LIMIT 200');
  res.json({ insights: generateInsights({ reports, kpis, expenses }) });
});

app.post('/api/export/pdf', async (req, res) => {
  const db = await getDb();
  let state = req.body || {};
  if (!state.reports?.length) state.reports = await db.all('SELECT * FROM reports ORDER BY created_at DESC LIMIT 200');
  if (!state.kpis?.length) state.kpis = await db.all('SELECT label,value,note FROM kpis ORDER BY created_at DESC LIMIT 20');
  if (!state.expenses?.length) state.expenses = await db.all('SELECT area,despesa,orcamento,variacao,status,acao FROM expenses ORDER BY created_at DESC LIMIT 100');
  const { buffer, exportId, qrValue } = await buildPdfBuffer({ ...state, baseUrl: APP_BASE_URL });
  await db.run('INSERT INTO exports(id,type,qr_value) VALUES(?,?,?)', [exportId, 'pdf', qrValue]);
  await db.run('INSERT INTO audit_log(action,details) VALUES(?,?)', ['export-pdf', exportId]);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="relatorio_abc_${exportId}.pdf"`);
  res.send(buffer);
});

app.get('/api/export/verify/:id', async (req, res) => {
  const db = await getDb();
  const row = await db.get('SELECT * FROM exports WHERE id = ?', req.params.id);
  if (!row) return res.status(404).send('Relatório não encontrado ou não validado.');
  res.send(`<!doctype html><html lang="pt-br"><meta charset="utf-8"><title>Validação ABC</title><body style="font-family:Inter,Arial;padding:40px;background:#f2f4f8"><div style="max-width:680px;margin:auto;background:#fff;border-radius:24px;padding:32px;border:1px solid #e4e9f0"><h1 style="color:#00b894">Relatório ABC validado</h1><p><b>ID:</b> ${row.id}</p><p><b>Tipo:</b> ${row.type}</p><p><b>Gerado em:</b> ${row.created_at}</p><p>by Rafacodehub</p></div></body></html>`);
});

app.listen(PORT, () => console.log(`Dashboard ABC Enterprise rodando em ${APP_BASE_URL}`));
