function toNumber(value) {
  const n = Number(String(value ?? '').replace(/[^0-9,-.]/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

function generateInsights({ reports = [], kpis = [], expenses = [] }) {
  const critical = reports.filter(r => /crítico|critico/i.test(r.status || '')).length;
  const attention = reports.filter(r => /atenção|atencao/i.test(r.status || '')).length;
  const positive = reports.filter(r => /ok|acima|forte/i.test(r.status || '')).length;
  const highExpenses = expenses.filter(e => /crítico|critico/i.test(e.status || '') || toNumber(e.variacao) > 10).length;
  const revenueKpi = kpis.find(k => /receita/i.test(k.label || ''));
  const shareKpi = kpis.find(k => /share/i.test(k.label || ''));
  return [
    {
      type: 'success',
      title: 'ABC está crescendo acima da meta',
      text: revenueKpi ? `${revenueKpi.label}: ${revenueKpi.value}. ${revenueKpi.note || ''}` : 'Receita consolidada se mantém em cenário positivo.'
    },
    {
      type: highExpenses ? 'risk' : 'warning',
      title: highExpenses ? 'Risco financeiro moderado' : 'Risco financeiro controlado',
      text: highExpenses ? `${highExpenses} área(s) com pressão relevante de custos.` : 'Não há concentração crítica relevante nas despesas atuais.'
    },
    {
      type: attention || critical ? 'warning' : 'success',
      title: 'Operações exige acompanhamento',
      text: `${critical} registro(s) crítico(s), ${attention} em atenção e ${positive} favoráveis na base atual.`
    },
    {
      type: 'info',
      title: 'Benchmark competitivo',
      text: shareKpi ? `Market share atual: ${shareKpi.value}.` : 'ABC permanece competitivo frente ao mercado.'
    }
  ];
}

module.exports = { generateInsights };
