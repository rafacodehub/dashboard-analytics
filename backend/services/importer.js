const XLSX = require('xlsx');
const fs = require('fs');
const { v4: uuid } = require('uuid');

const REQUIRED_ANY = [
  ['Área', 'Area'],
  ['Indicador'],
  ['Trimestre'],
  ['Valor'],
  ['Meta'],
  ['Status']
];

function hasAny(row, names) {
  return names.some(name => Object.prototype.hasOwnProperty.call(row, name));
}
function validateRows(rows) {
  const errors = [];
  if (!rows.length) errors.push('A planilha está vazia.');
  const sample = rows[0] || {};
  REQUIRED_ANY.forEach(group => {
    if (!hasAny(sample, group)) errors.push(`Coluna obrigatória ausente: ${group.join(' ou ')}`);
  });
  return errors;
}
function parseWorkbook(filePath, filename) {
  const workbook = XLSX.readFile(filePath, { cellDates: true });
  const sheets = workbook.SheetNames.map(name => ({
    name,
    rows: XLSX.utils.sheet_to_json(workbook.Sheets[name], { defval: '' })
  }));
  const allRows = sheets.flatMap(sheet => sheet.rows.map(row => ({ ...row, __sheet: sheet.name })));
  const errors = validateRows(allRows);
  const headers = Object.keys(allRows[0] || {}).filter(h => h !== '__sheet');
  return {
    importToken: uuid(),
    filename,
    valid: errors.length === 0,
    errors,
    sheets: sheets.map(s => ({ name: s.name, rows: s.rows.length })),
    totalRows: allRows.length,
    headers,
    preview: allRows.slice(0, 12),
    rows: allRows
  };
}
function cleanup(filePath) {
  fs.promises.unlink(filePath).catch(() => {});
}
module.exports = { parseWorkbook, cleanup };
