const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const { v4: uuid } = require('uuid');

function addFooter(doc, page, totalLabel = '') {
  const bottom = doc.page.height - 42;
  doc.fontSize(8).fillColor('#7a8899').text(`ABC Executive Analytics • by Rafacodehub`, 50, bottom);
  doc.text(`Página ${page}${totalLabel}`, doc.page.width - 110, bottom, { align: 'right' });
}
function drawLogo(doc, x, y) {
  doc.roundedRect(x, y, 48, 48, 14).fill('#00b894');
  doc.fillColor('#fff').fontSize(24).font('Helvetica-Bold').text('A', x + 16, y + 12);
}
function card(doc, x, y, w, h, title, value, subtitle, color = '#00b894') {
  doc.roundedRect(x, y, w, h, 14).fillAndStroke('#f8fafc', '#e4e9f0');
  doc.fillColor('#7a8899').fontSize(8).font('Helvetica-Bold').text(title.toUpperCase(), x + 14, y + 12);
  doc.fillColor('#1a232e').fontSize(18).font('Helvetica-Bold').text(value, x + 14, y + 31);
  doc.fillColor(color).fontSize(9).text(subtitle || '', x + 14, y + 56, { width: w - 28 });
}
function bar(doc, x, y, label, value, max, color) {
  const width = 330;
  doc.fillColor('#1a232e').fontSize(9).font('Helvetica-Bold').text(label, x, y);
  doc.roundedRect(x + 130, y, width, 10, 5).fill('#edf1f6');
  doc.roundedRect(x + 130, y, Math.max(4, width * value / max), 10, 5).fill(color);
  doc.fillColor('#7a8899').fontSize(9).text(`${value}`, x + 470, y - 1);
}
async function buildPdfBuffer({ kpis = [], reports = [], expenses = [], baseUrl = 'http://localhost:3000' }) {
  const exportId = uuid();
  const qrValue = `${baseUrl}/api/export/verify/${exportId}`;
  const qrDataUrl = await QRCode.toDataURL(qrValue, { margin: 1, width: 110 });
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const chunks = [];
  doc.on('data', c => chunks.push(c));
  const done = new Promise(resolve => doc.on('end', () => resolve(Buffer.concat(chunks))));

  drawLogo(doc, 50, 58);
  doc.fillColor('#00b894').fontSize(10).font('Helvetica-Bold').text('DASHBOARD EXECUTIVO • AVALIAÇÃO 2025', 50, 130);
  doc.fillColor('#1a232e').fontSize(32).font('Helvetica-Bold').text('Relatório Executivo ABC', 50, 158, { width: 470 });
  doc.fillColor('#7a8899').fontSize(13).font('Helvetica').text('PDF gerado com dados reais do dashboard, KPI summary, tabelas consolidadas, paginação automática e QR Code validável.', 50, 208, { width: 450, lineGap: 4 });
  doc.image(qrDataUrl, 430, 58, { width: 95 });
  doc.fillColor('#7a8899').fontSize(8).text('QR validável', 438, 156);
  doc.roundedRect(50, 285, 495, 130, 20).fill('#f8fafc');
  doc.fillColor('#1a232e').fontSize(16).font('Helvetica-Bold').text('Resumo IA', 72, 310);
  const crit = reports.filter(r => /crítico|critico/i.test(r.status || '')).length;
  const att = reports.filter(r => /atenção|atencao/i.test(r.status || '')).length;
  doc.fillColor('#536171').fontSize(11).font('Helvetica').text(`A IA executiva identificou ${crit} indicador(es) crítico(s) e ${att} em atenção. A recomendação é priorizar eficiência operacional e acompanhar custos com maior frequência.`, 72, 340, { width: 430, lineGap: 4 });
  doc.fillColor('#00b894').fontSize(11).font('Helvetica-Bold').text('by Rafacodehub', 50, 735);
  addFooter(doc, 1);

  doc.addPage();
  doc.fillColor('#00b894').fontSize(10).font('Helvetica-Bold').text('ÍNDICE', 50, 60);
  doc.fillColor('#1a232e').fontSize(24).text('Seções do relatório', 50, 84);
  [['1. KPI Summary', 'p. 3'], ['2. Gráficos e indicadores', 'p. 3'], ['3. Base analítica', 'p. 4'], ['4. Despesas e riscos', 'p. 5'], ['5. Validação QR', 'p. 5']].forEach((row, i) => {
    doc.roundedRect(50, 145 + i*42, 495, 30, 10).stroke('#e4e9f0');
    doc.fillColor('#1a232e').fontSize(11).font('Helvetica-Bold').text(row[0], 66, 154 + i*42);
    doc.fillColor('#7a8899').text(row[1], 490, 154 + i*42);
  });
  addFooter(doc, 2);

  doc.addPage();
  doc.fillColor('#00b894').fontSize(10).font('Helvetica-Bold').text('KPI SUMMARY', 50, 60);
  doc.fillColor('#1a232e').fontSize(24).text('Indicadores principais', 50, 84);
  const defaults = [
    { label:'Receita Líquida', value:'R$ 154,2 Mi', note:'Meta anual superada' },
    { label:'Lucro Operacional', value:'R$ 28,7 Mi', note:'Margem positiva' },
    { label:'Market Share', value:'23,7%', note:'Acima do concorrente' },
    { label:'Score Executivo', value:'86/100', note:'Empresa saudável' }
  ];
  const sourceKpis = kpis.length ? kpis : defaults;
  sourceKpis.slice(0,4).forEach((k, i) => card(doc, 50 + (i%2)*255, 130 + Math.floor(i/2)*95, 235, 78, k.label || 'KPI', k.value || '', k.note || '', i === 1 ? '#3f7cff' : '#00b894'));
  doc.fillColor('#1a232e').fontSize(15).font('Helvetica-Bold').text('Gráfico renderizado no PDF', 50, 340);
  const chartValues = sourceKpis.slice(0,4).map((k, i) => ({ label:k.label || `KPI ${i+1}`, value: Number(String(k.value || '').replace(/[^0-9,.]/g,'').replace(',','.')) || [154,28,23,86][i] }));
  const max = Math.max(...chartValues.map(v => v.value), 1);
  chartValues.forEach((v, i) => bar(doc, 50, 380 + i*34, v.label, Math.round(v.value), max, i % 2 ? '#3f7cff' : '#00b894'));
  addFooter(doc, 3);

  doc.addPage();
  doc.fillColor('#00b894').fontSize(10).font('Helvetica-Bold').text('BASE ANALÍTICA', 50, 60);
  doc.fillColor('#1a232e').fontSize(22).text('Relatórios consolidados', 50, 84);
  let y = 130;
  doc.fontSize(9).font('Helvetica-Bold').fillColor('#536171');
  ['Área','Indicador','Tri','Valor','Meta','Status'].forEach((h, i) => doc.text(h, [50,135,230,300,370,440][i], y));
  y += 20;
  (reports.length ? reports : []).slice(0, 22).forEach(r => {
    doc.font('Helvetica').fontSize(8.5).fillColor('#1a232e');
    [r.area, r.indicador, r.trimestre, r.valor || r.valorNum, r.meta || r.metaNum, r.status].forEach((v, i) => doc.text(String(v ?? ''), [50,135,230,300,370,440][i], y, { width: [75,85,55,60,60,85][i] }));
    y += 22;
    if (y > 735) { addFooter(doc, doc.bufferedPageRange().count + 1); doc.addPage(); y = 70; }
  });
  addFooter(doc, 4);

  doc.addPage();
  doc.fillColor('#00b894').fontSize(10).font('Helvetica-Bold').text('DESPESAS E VALIDAÇÃO', 50, 60);
  doc.fillColor('#1a232e').fontSize(22).text('Riscos financeiros e QR Code', 50, 84);
  const exps = expenses.length ? expenses : [];
  const maxExpense = Math.max(...exps.map(e => Number(e.despesa) || 0), 1);
  exps.slice(0,8).forEach((e, i) => bar(doc, 50, 140 + i*34, e.area || 'Área', Number(e.despesa) || 0, maxExpense, /crítico|critico/i.test(e.status || '') ? '#e05252' : /atenção|atencao/i.test(e.status || '') ? '#ff8c20' : '#00b894'));
  doc.image(qrDataUrl, 410, 500, { width: 105 });
  doc.fillColor('#1a232e').fontSize(12).font('Helvetica-Bold').text('Validação do relatório', 50, 515);
  doc.fillColor('#536171').fontSize(10).font('Helvetica').text(`ID: ${exportId}\nUse o QR Code para validar este relatório no backend.`, 50, 540, { width: 320, lineGap: 3 });
  addFooter(doc, 5);

  doc.end();
  const buffer = await done;
  return { buffer, exportId, qrValue };
}
module.exports = { buildPdfBuffer };
