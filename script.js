
const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: { usePointStyle: true, boxWidth: 9, padding: 18, color: '#536171', font: { family: 'Inter', weight: '800', size: 13 } }
    },
    tooltip: {
      backgroundColor: '#1a232e',
      padding: 12,
      cornerRadius: 10,
      titleColor: '#fff',
      bodyColor: 'rgba(255,255,255,.75)',
      titleFont: { family: 'Inter', weight: '800', size: 13 },
      bodyFont:  { family: 'Inter', size: 13 },
      displayColors: true,
      callbacks: {
        label: ctx => ` R$ ${ctx.parsed.y} Mi`
      }
    }
  }
};


const lineCtx = document.getElementById('lineChart');
if (lineCtx) {
  new Chart(lineCtx, {
    type: 'line',
    data: {
      labels: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
      datasets: [{
        label: 'ABC',
        data: [8, 15, 13, 18, 25, 22, 31, 40, 46, 43, 55, 66],
        borderColor: '#00b894',
        backgroundColor: ctx => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 280);
          gradient.addColorStop(0, 'rgba(0,184,148,.18)');
          gradient.addColorStop(1, 'rgba(0,184,148,0)');
          return gradient;
        },
        pointBackgroundColor: '#00b894',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.42,
        fill: true,
        borderWidth: 2.5
      },
      {
        label: 'CONCORRENTE A',
        data: [7, 12, 14, 16, 19, 20, 26, 31, 35, 37, 43, 49],
        borderColor: '#3f7cff',
        backgroundColor: 'rgba(63,124,255,.08)',
        pointBackgroundColor: '#3f7cff',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 7,
        tension: 0.42,
        fill: false,
        borderWidth: 2.5
      }]
    },
    options: {
      ...chartDefaults,
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: {
          ticks: {
            color: '#8a99aa',
            font: { family: 'Inter', size: 12, weight: '700' }
          },
          grid: { display: false },
          border: { display: false }
        },
        y: {
          ticks: {
            color: '#8a99aa',
            font: { family: 'Inter', size: 12, weight: '600' },
            callback: v => `R$ ${v}`
          },
          grid: { color: '#edf1f6', lineWidth: 1 },
          border: { display: false }
        }
      }
    }
  });
}


const scoreCtx = document.getElementById('scoreChart');
if (scoreCtx) {
  new Chart(scoreCtx, {
    type: 'doughnut',
    data: {
      labels: ['Score', 'Restante'],
      datasets: [{
        data: [86, 14],
        backgroundColor: ['#00b894', '#edf1f6'],
        borderWidth: 0,
        hoverOffset: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '80%',
      plugins: {
        legend:  { display: false },
        tooltip: { enabled: false }
      }
    }
  });
}


const hamburger      = document.getElementById('hamburgerBtn');
const sidebar        = document.getElementById('sidebar');
const overlay        = document.getElementById('sidebarOverlay');

function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('active');
  hamburger.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', () => {
  sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
});
overlay?.addEventListener('click', closeSidebar);


document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) closeSidebar();
  });
});


window.addEventListener('resize', () => {
  if (window.innerWidth > 768) closeSidebar();
});



const sidebarCollapse = document.getElementById('sidebarCollapse');
function setSidebarIcon(){
  if (!sidebarCollapse) return;
  sidebarCollapse.textContent = document.body.classList.contains('sidebar-collapsed') ? '›' : '‹';
  sidebarCollapse.setAttribute('aria-label', document.body.classList.contains('sidebar-collapsed') ? 'Expandir menu' : 'Recolher menu');
}
sidebarCollapse?.addEventListener('click', () => {
  document.body.classList.toggle('sidebar-collapsed');
  localStorage.setItem('abcSidebarCollapsed', document.body.classList.contains('sidebar-collapsed') ? 'true' : 'false');
  setSidebarIcon();
  setTimeout(() => window.dispatchEvent(new Event('resize')), 260);
});
if (localStorage.getItem('abcSidebarCollapsed') === 'true') document.body.classList.add('sidebar-collapsed');
setSidebarIcon();



const exportBtn = document.getElementById('exportBtn');
const exportToast = document.getElementById('exportToast');
let exportToastTimer;

exportBtn?.addEventListener('click', () => {
  if (!exportToast) return;
  exportToast.classList.add('show');
  clearTimeout(exportToastTimer);
  exportToastTimer = setTimeout(() => {
    exportToast.classList.remove('show');
  }, 1800);
});


const pageLinks = document.querySelectorAll('[data-page]');
const pages = document.querySelectorAll('.page');

function showPage(pageName) {
  pages.forEach(page => page.classList.remove('active'));
  document.getElementById(`page-${pageName}`)?.classList.add('active');
  pageLinks.forEach(link => link.classList.toggle('active', link.dataset.page === pageName));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (window.innerWidth <= 768) closeSidebar();
}

pageLinks.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    showPage(link.dataset.page);
  });
});


const quarterData = {
  q1: {
    label: '1º tri', revenue: 'R$ 34,6 Mi', revenueBadge: '↑ 12,4%', revenueText: 'Acima da meta projetada', revenueBar: '88%',
    margin: '18,9%', marginBadge: '↑ 4,1%', marginBar: '76%', efficiency: '74%', efficiencyBar: '74%', alert: 'Operações', alertValue: '14,2%', alertText: 'Margem abaixo do objetivo em Operações', alertBar: '48%',
    actual: [9, 16, 21], target: [10, 15, 20],
    heatmap: [
      ['Comercial', '22,4%', 'Alta lucratividade', 'good', 'R$ 13,1 Mi'], ['Marketing', '17,8%', 'Boa eficiência', 'mid', 'R$ 4,7 Mi'],
      ['Operações', '14,2%', 'Abaixo da meta', 'danger', 'R$ 6,0 Mi'], ['Expansão', '16,1%', 'Em evolução', 'warn', 'R$ 5,2 Mi']
    ]
  },
  q2: {
    label: '2º tri', revenue: 'R$ 42,9 Mi', revenueBadge: '↑ 16,8%', revenueText: 'Forte aceleração no trimestre', revenueBar: '94%',
    margin: '19,7%', marginBadge: '↑ 5,3%', marginBar: '82%', efficiency: '78%', efficiencyBar: '78%', alert: 'Expansão', alertValue: '15,0%', alertText: 'Expansão abaixo do ritmo planejado', alertBar: '55%',
    actual: [20, 28, 35], target: [18, 26, 33],
    heatmap: [
      ['Comercial', '24,1%', 'Excelente margem', 'good', 'R$ 15,4 Mi'], ['Marketing', '19,0%', 'Acima do ROI', 'good', 'R$ 5,8 Mi'],
      ['Operações', '16,8%', 'Estável', 'mid', 'R$ 7,2 Mi'], ['Expansão', '15,0%', 'Ponto de atenção', 'warn', 'R$ 4,5 Mi']
    ]
  },
  q3: {
    label: '3º tri', revenue: 'R$ 47,3 Mi', revenueBadge: '↑ 18,2%', revenueText: 'Melhor trimestre do ano', revenueBar: '98%',
    margin: '21,4%', marginBadge: '↑ 6,7%', marginBar: '90%', efficiency: '82%', efficiencyBar: '82%', alert: 'Marketing', alertValue: '13,9%', alertText: 'ROI de marketing abaixo da expectativa', alertBar: '46%',
    actual: [32, 44, 51], target: [30, 41, 48],
    heatmap: [
      ['Comercial', '26,8%', 'Muito forte', 'good', 'R$ 17,9 Mi'], ['Marketing', '13,9%', 'Atenção no ROI', 'danger', 'R$ 3,9 Mi'],
      ['Operações', '18,2%', 'Boa margem', 'mid', 'R$ 8,1 Mi'], ['Expansão', '20,5%', 'Alta performance', 'good', 'R$ 6,3 Mi']
    ]
  },
  q4: {
    label: '4º tri', revenue: 'R$ 52,1 Mi', revenueBadge: '↑ 20,5%', revenueText: 'Projeção acima do plano anual', revenueBar: '100%',
    margin: '22,1%', marginBadge: '↑ 7,0%', marginBar: '92%', efficiency: '85%', efficiencyBar: '85%', alert: 'Custos', alertValue: '12,8%', alertText: 'Custos pressionando margem final', alertBar: '42%',
    actual: [45, 56, 66], target: [43, 53, 62],
    heatmap: [
      ['Comercial', '27,2%', 'Alta lucratividade', 'good', 'R$ 19,2 Mi'], ['Marketing', '20,1%', 'Forte retorno', 'good', 'R$ 6,6 Mi'],
      ['Operações', '17,4%', 'Estável', 'mid', 'R$ 8,8 Mi'], ['Custos', '12,8%', 'Atenção crítica', 'danger', 'R$ 4,1 Mi']
    ]
  }
};

const trendCtx = document.getElementById('trendChart');
let trendChart;
if (trendCtx) {
  trendChart = new Chart(trendCtx, {
    type: 'line',
    data: {
      labels: ['Mês 1', 'Mês 2', 'Mês 3'],
      datasets: [
        {
          label: 'Crescimento real',
          data: quarterData.q1.actual,
          borderColor: '#00b894',
          backgroundColor: 'rgba(0,184,148,.12)',
          pointBackgroundColor: '#00b894',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
          tension: .42,
          fill: true,
          borderWidth: 3
        },
        {
          label: 'Meta projetada',
          data: quarterData.q1.target,
          borderColor: '#3f7cff',
          backgroundColor: 'rgba(63,124,255,.08)',
          pointBackgroundColor: '#3f7cff',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
          tension: .42,
          fill: false,
          borderDash: [6, 5],
          borderWidth: 3
        }
      ]
    },
    options: {
      ...chartDefaults,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        ...chartDefaults.plugins,
        tooltip: {
          ...chartDefaults.plugins.tooltip,
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: R$ ${ctx.parsed.y} Mi`
          }
        }
      },
      scales: {
        x: { ticks: { color: '#8a99aa', font: { family: 'Inter', size: 12, weight: '700' } }, grid: { display: false }, border: { display: false } },
        y: { ticks: { color: '#8a99aa', font: { family: 'Inter', size: 12, weight: '600' }, callback: v => `R$ ${v}` }, grid: { color: '#edf1f6' }, border: { display: false } }
      }
    }
  });
}

function renderHeatmap(items) {
  const heatmapGrid = document.getElementById('heatmapGrid');
  if (!heatmapGrid) return;
  heatmapGrid.innerHTML = items.map(([area, value, note, status, money]) => `
    <div class="heatmap-cell heatmap-${status}" data-money="${money}" data-label="${area}" data-percent="${value}" title="${area}: ${money} • ${note}">
      <span>${area}</span>
      <strong>${value}</strong>
      <small>${note}</small>
    </div>
  `).join('');
  bindMoneyTooltips();
}

function updateQuarter(q) {
  const data = quarterData[q];
  if (!data) return;
  document.getElementById('qRevenue').textContent = data.revenue;
  document.getElementById('qRevenueBadge').textContent = data.revenueBadge;
  document.getElementById('qRevenueText').textContent = data.revenueText;
  document.getElementById('qRevenueBar').style.width = data.revenueBar;
  document.getElementById('qMargin').textContent = data.margin;
  document.getElementById('qMarginBadge').textContent = data.marginBadge;
  document.getElementById('qMarginBar').style.width = data.marginBar;
  document.getElementById('qEfficiency').textContent = data.efficiency;
  document.getElementById('qEfficiencyBar').style.width = data.efficiencyBar;
  document.getElementById('qAlertBadge').textContent = `⚠ ${data.alert}`;
  document.getElementById('qAlertValue').textContent = data.alertValue;
  document.getElementById('qAlertText').textContent = data.alertText;
  document.getElementById('qAlertBar').style.width = data.alertBar;
  document.getElementById('heatmapQuarterLabel').textContent = data.label;

  renderHeatmap(data.heatmap);
  if (trendChart) {
    trendChart.data.datasets[0].data = data.actual;
    trendChart.data.datasets[1].data = data.target;
    trendChart.update();
  }
}


const quarterDropdown = document.getElementById('quarterDropdown');
const quarterTrigger = document.getElementById('quarterTrigger');
const quarterTriggerLabel = document.getElementById('quarterTriggerLabel');
const quarterMenu = document.getElementById('quarterMenu');

quarterTrigger?.addEventListener('click', () => {
  const isOpen = quarterDropdown.classList.toggle('open');
  quarterTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

quarterMenu?.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', () => {
    quarterMenu.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    quarterTriggerLabel.textContent = button.querySelector('strong').textContent;
    quarterDropdown.classList.remove('open');
    quarterTrigger.setAttribute('aria-expanded', 'false');
    updateQuarter(button.dataset.quarter);
  });
});

document.addEventListener('click', event => {
  if (quarterDropdown && !quarterDropdown.contains(event.target)) {
    quarterDropdown.classList.remove('open');
    quarterTrigger?.setAttribute('aria-expanded', 'false');
  }
});

function bindMoneyTooltips() {
  let tooltip = document.getElementById('moneyTooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'moneyTooltip';
    tooltip.className = 'money-tooltip';
    document.body.appendChild(tooltip);
  }

  document.querySelectorAll('[data-money]').forEach(item => {
    item.addEventListener('mousemove', event => {
      tooltip.innerHTML = `${item.dataset.label}: ${item.dataset.money}<small>${item.dataset.percent} de margem/performance</small>`;
      tooltip.style.left = `${event.clientX}px`;
      tooltip.style.top = `${event.clientY}px`;
      tooltip.classList.add('show');
    });
    item.addEventListener('mouseleave', () => tooltip.classList.remove('show'));
  });
}

updateQuarter('q1');



const themeButtons = [document.getElementById('themeToggle'), document.getElementById('mobileThemeToggle')].filter(Boolean);
function setThemeIcon() {
  const isDark = document.body.classList.contains('dark-mode');
  themeButtons.forEach(btn => btn.textContent = isDark ? '☀' : '☾');
}
themeButtons.forEach(btn => btn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('abcTheme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  setThemeIcon();
}));
if (localStorage.getItem('abcTheme') === 'dark') document.body.classList.add('dark-mode');
setThemeIcon();


const notificationPanel = document.getElementById('notificationPanel');
const notificationButtons = [document.getElementById('notificationToggle'), document.getElementById('mobileNotificationToggle')].filter(Boolean);
function toggleNotifications(event) {
  event?.stopPropagation();
  if (!notificationPanel) return;
  notificationPanel.classList.toggle('show');
  notificationPanel.setAttribute('aria-hidden', notificationPanel.classList.contains('show') ? 'false' : 'true');
}
function showExportNotification() {
  if (!notificationPanel) return;
  const first = notificationPanel.querySelector('.notification-item');
  if (first) {
    first.querySelector('b').textContent = 'Exportação concluída';
    first.querySelector('small').textContent = 'PDF executivo gerado com capa, índice, gráficos e QR Code.';
  }
}
notificationButtons.forEach(btn => btn.addEventListener('click', toggleNotifications));
document.addEventListener('click', event => {
  if (!notificationPanel?.classList.contains('show')) return;
  if (!notificationPanel.contains(event.target) && !notificationButtons.some(btn => btn.contains(event.target))) {
    notificationPanel.classList.remove('show');
    notificationPanel.setAttribute('aria-hidden', 'true');
  }
});



const expenses = [
  { area:'Operações', despesa:18.4, orcamento:16.4, variacao:12.2, status:'Crítico', acao:'Revisar fornecedores e horas extras' },
  { area:'Marketing', despesa:9.8, orcamento:9.1, variacao:7.7, status:'Atenção', acao:'Otimizar campanhas de baixo ROI' },
  { area:'Tecnologia', despesa:7.2, orcamento:7.0, variacao:2.9, status:'Atenção', acao:'Auditar licenças e cloud' },
  { area:'Comercial', despesa:6.9, orcamento:7.2, variacao:-4.2, status:'OK', acao:'Manter controle atual' },
  { area:'Logística', despesa:5.8, orcamento:5.1, variacao:13.7, status:'Crítico', acao:'Renegociar fretes e rotas' },
  { area:'Atendimento', despesa:3.6, orcamento:3.7, variacao:-2.7, status:'OK', acao:'Manter produtividade' }
];
function moneyMi(v){ return `R$ ${v.toFixed(1).replace('.', ',')} Mi`; }
function statusClass(status){ return status === 'Crítico' ? 'status-critical' : status === 'Atenção' ? 'status-warning' : 'status-ok'; }
function renderExpensesTable(){
  const body = document.getElementById('expensesTableBody');
  if(!body) return;
  body.innerHTML = expenses.map(e => `<tr><td><span class="area-name">${e.area}</span></td><td>${moneyMi(e.despesa)}</td><td>${moneyMi(e.orcamento)}</td><td>${e.variacao > 0 ? '+' : ''}${e.variacao.toFixed(1).replace('.', ',')}%</td><td><span class="status-pill ${statusClass(e.status)}">${e.status}</span></td><td>${e.acao}</td></tr>`).join('');
}
renderExpensesTable();
const expenseColors = expenses.map(e => e.status === 'Crítico' ? '#e05252' : e.status === 'Atenção' ? '#ff8c20' : '#00b894');
const expenseBarCtx = document.getElementById('expenseBarChart');
if(expenseBarCtx){
  new Chart(expenseBarCtx, { type:'bar', data:{ labels:expenses.map(e=>e.area), datasets:[{ label:'Despesa', data:expenses.map(e=>e.despesa), backgroundColor: expenseColors, borderRadius: 12 }]}, options:{ ...chartDefaults, plugins:{ ...chartDefaults.plugins, legend:{ display:false }, tooltip:{ ...chartDefaults.plugins.tooltip, callbacks:{ label: ctx => ` ${ctx.label}: ${moneyMi(ctx.parsed.y)}` }}}, scales:{ x:{ ticks:{ color:'#8a99aa', font:{ family:'Inter', weight:'800' }}, grid:{ display:false }, border:{ display:false }}, y:{ ticks:{ color:'#8a99aa', callback:v=>`R$ ${v}` }, grid:{ color:'#edf1f6' }, border:{ display:false }} } }});
}
const expenseDonutCtx = document.getElementById('expenseDonutChart');
if(expenseDonutCtx){
  const critical = expenses.filter(e=>e.status==='Crítico').length;
  const warning = expenses.filter(e=>e.status==='Atenção').length;
  const ok = expenses.filter(e=>e.status==='OK').length;
  new Chart(expenseDonutCtx, { type:'doughnut', data:{ labels:['Crítico','Atenção','OK'], datasets:[{ data:[critical, warning, ok], backgroundColor:['#e05252','#ff8c20','#00b894'], borderWidth:0, hoverOffset:8 }]}, options:{ responsive:true, maintainAspectRatio:false, cutout:'68%', plugins:{ legend:{ display:true, position:'bottom', labels:{ usePointStyle:true, color:'#536171', font:{ family:'Inter', weight:'800' }}}, tooltip:{ backgroundColor:'#1a232e', padding:12, cornerRadius:10, callbacks:{ label: ctx => ` ${ctx.label}: ${ctx.parsed} área(s)` }}} }});
}


const areasDB = ['Comercial','Marketing','Operações','Expansão','Custos','Financeiro','Atendimento','Produto'];
const indicatorsDB = ['Receita','Lucro','Margem','Despesa','Meta','ROI','Eficiência','Ticket Médio'];
const statusesDB = ['OK','Atenção','Crítico','Acima','Planejado'];
const reportDatabase = Array.from({ length: 128 }, (_, i) => {
  const area = areasDB[i % areasDB.length];
  const indicador = indicatorsDB[(i * 3) % indicatorsDB.length];
  const trimestre = `${(i % 4) + 1}º Tri`;
  const valorNum = +(8 + ((i * 7) % 72) / 2).toFixed(1);
  const metaNum = +(valorNum - 3 + (i % 9)).toFixed(1);
  const status = statusesDB[(i * 5 + i) % statusesDB.length];
  return { id: i + 1, area, indicador, trimestre, valorNum, metaNum, valor: moneyMi(valorNum), meta: moneyMi(metaNum), status };
});
let reportSort = { key:'id', dir:1 };
function badgeForStatus(status){
  if(status === 'Crítico') return 'status-critical';
  if(status === 'Atenção') return 'status-warning';
  if(status === 'OK' || status === 'Acima') return 'status-ok';
  return 'badge neutral';
}
function getFilteredReports(){
  const search = (document.getElementById('reportSearch')?.value || '').toLowerCase().trim();
  const area = document.getElementById('areaFilter')?.value || '';
  const status = document.getElementById('statusFilter')?.value || '';
  return reportDatabase.filter(row => {
    const text = `${row.id} ${row.area} ${row.indicador} ${row.trimestre} ${row.valor} ${row.meta} ${row.status}`.toLowerCase();
    return (!search || text.includes(search)) && (!area || row.area === area) && (!status || row.status === status);
  }).sort((a,b)=>{
    const av=a[reportSort.key], bv=b[reportSort.key];
    return (typeof av === 'number' ? av-bv : String(av).localeCompare(String(bv))) * reportSort.dir;
  });
}
function renderReportTable(){
  const body = document.getElementById('reportTableBody');
  const count = document.getElementById('reportCountLabel');
  if(!body) return;
  const rows = getFilteredReports();
  if(count) count.textContent = `${rows.length} de 128 registros`;
  body.innerHTML = rows.map(r => `<tr><td>${r.id}</td><td><span class="area-name">${r.area}</span></td><td>${r.indicador}</td><td>${r.trimestre}</td><td>${r.valor}</td><td>${r.meta}</td><td><span class="status-pill ${badgeForStatus(r.status)}">${r.status}</span></td></tr>`).join('');
}
['reportSearch','areaFilter','statusFilter'].forEach(id => document.getElementById(id)?.addEventListener('input', renderReportTable));
document.querySelectorAll('.sortable-table th[data-sort]').forEach(th => th.addEventListener('click', () => {
  const key = th.dataset.sort;
  reportSort = { key, dir: reportSort.key === key ? reportSort.dir * -1 : 1 };
  renderReportTable();
}));
renderReportTable();




function parseNumberFromText(value) {
  if (!value) return 0;
  const clean = String(value).replace(/R\$|Mi|%|\/100|x ROI|↑|↓|\+|p\.p\.|\s/g, '').replace(',', '.');
  const found = clean.match(/-?\d+(\.\d+)?/);
  return found ? Number(found[0]) : 0;
}
function formatLike(targetText, num) {
  const n = Number(num || 0);
  if (targetText.includes('R$')) return `R$ ${n.toFixed(1).replace('.', ',')} Mi`;
  if (targetText.includes('/100')) return `${Math.round(n)}/100`;
  if (targetText.includes('%')) return `${n.toFixed(1).replace('.', ',')}%`;
  return String(targetText);
}
function animateText(el, targetText, duration = 650) {
  if (!el) return;
  const start = parseNumberFromText(el.textContent);
  const end = parseNumberFromText(targetText);
  if (!Number.isFinite(end) || end === 0) { el.textContent = targetText; return; }
  const startTime = performance.now();
  function frame(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = formatLike(targetText, start + (end - start) * eased);
    if (progress < 1) requestAnimationFrame(frame);
    else el.textContent = targetText;
  }
  requestAnimationFrame(frame);
}
function growBar(el, targetWidth) {
  if (!el) return;
  el.style.width = '0%';
  requestAnimationFrame(() => requestAnimationFrame(() => { el.style.width = targetWidth; }));
}

const originalUpdateQuarter = updateQuarter;
updateQuarter = function(q) {
  document.querySelectorAll('#page-quarter .metric-card, #page-quarter .panel').forEach(card => card.classList.add('updating'));
  setTimeout(() => {
    const data = quarterData[q];
    if (!data) return;
    animateText(document.getElementById('qRevenue'), data.revenue);
    animateText(document.getElementById('qMargin'), data.margin);
    animateText(document.getElementById('qEfficiency'), data.efficiency);
    animateText(document.getElementById('qAlertValue'), data.alertValue);
    document.getElementById('qRevenueBadge').textContent = data.revenueBadge;
    document.getElementById('qRevenueText').textContent = data.revenueText;
    document.getElementById('qMarginBadge').textContent = data.marginBadge;
    document.getElementById('qAlertBadge').textContent = `⚠ ${data.alert}`;
    document.getElementById('qAlertText').textContent = data.alertText;
    document.getElementById('heatmapQuarterLabel').textContent = data.label;
    growBar(document.getElementById('qRevenueBar'), data.revenueBar);
    growBar(document.getElementById('qMarginBar'), data.marginBar);
    growBar(document.getElementById('qEfficiencyBar'), data.efficiencyBar);
    growBar(document.getElementById('qAlertBar'), data.alertBar);
    renderHeatmap(data.heatmap);
    if (trendChart) {
      trendChart.data.datasets[0].data = data.actual;
      trendChart.data.datasets[1].data = data.target;
      trendChart.update();
    }
    setTimeout(() => document.querySelectorAll('#page-quarter .metric-card, #page-quarter .panel').forEach(card => card.classList.remove('updating')), 160);
  }, 120);
};


quarterMenu?.querySelectorAll('button').forEach(button => {
  button.onclick = () => {
    quarterMenu.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    quarterTriggerLabel.textContent = button.querySelector('strong').textContent;
    quarterDropdown.classList.remove('open');
    quarterTrigger.setAttribute('aria-expanded', 'false');
    updateQuarter(button.dataset.quarter);
  };
});


const competitionData = [
  { name: 'ABC', value: 58, color: '#00b894' },
  { name: 'Concorrente A', value: 52, color: '#3f7cff' },
  { name: 'Concorrente B', value: 48, color: '#ff8c20' },
  { name: 'Concorrente C', value: 44, color: '#8b5cf6' },
  { name: 'Concorrente D', value: 39, color: '#e05252' },
  { name: 'Média do mercado', value: 47, color: '#94a3b8' }
];
const competitionCtx = document.getElementById('competitionBarChart');
let competitionBarChart;
if (competitionCtx) {
  competitionBarChart = new Chart(competitionCtx, {
    type: 'bar',
    data: {
      labels: competitionData.map(item => item.name),
      datasets: [{
        label: 'Índice competitivo',
        data: competitionData.map(item => item.value),
        backgroundColor: competitionData.map(item => item.color),
        borderRadius: 14
      }]
    },
    options: {
      ...chartDefaults,
      plugins: {
        ...chartDefaults.plugins,
        legend: { display: false },
        tooltip: {
          ...chartDefaults.plugins.tooltip,
          callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed.y}%` }
        }
      },
      scales: {
        x: { ticks: { color:'#8a99aa', font:{ family:'Inter', weight:'800' } }, grid:{ display:false }, border:{ display:false } },
        y: { ticks: { color:'#8a99aa', callback:v=>`${v}%` }, grid:{ color:'#edf1f6' }, border:{ display:false }, suggestedMax:70 }
      }
    }
  });
}



const radarCtx = document.getElementById('competitionRadarChart');
let competitionRadarChart;
if (radarCtx) {
  competitionRadarChart = new Chart(radarCtx, {
    type: 'radar',
    data: {
      labels: ['Receita', 'Lucro', 'Market Share', 'Eficiência', 'Inovação', 'Satisfação'],
      datasets: [
        {
          label: 'ABC',
          data: [66, 62, 58, 72, 64, 70],
          borderColor: '#00b894',
          backgroundColor: 'rgba(0,184,148,.16)',
          pointBackgroundColor: '#00b894',
          pointBorderColor: '#fff',
          pointRadius: 4
        },
        {
          label: 'Média do mercado',
          data: [52, 48, 47, 61, 53, 58],
          borderColor: '#3f7cff',
          backgroundColor: 'rgba(63,124,255,.10)',
          pointBackgroundColor: '#3f7cff',
          pointBorderColor: '#fff',
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'bottom', labels: { usePointStyle: true, color: '#536171', font: { family: 'Inter', weight: '800' } } },
        tooltip: { backgroundColor: '#1a232e', padding: 12, cornerRadius: 10, callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.r}%` } }
      },
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 80,
          ticks: { display: false },
          pointLabels: { color: '#7a8899', font: { family: 'Inter', weight: '800', size: 11 } },
          grid: { color: 'rgba(122,136,153,.22)' },
          angleLines: { color: 'rgba(122,136,153,.18)' }
        }
      }
    }
  });
}

const dominanceCtx = document.getElementById('marketDominanceChart');
let marketDominanceChart;
if (dominanceCtx) {
  marketDominanceChart = new Chart(dominanceCtx, {
    type: 'doughnut',
    data: {
      labels: ['ABC', 'Concorrente A', 'Concorrente B', 'Concorrente C', 'Concorrente D'],
      datasets: [{
        data: [28, 24, 20, 16, 12],
        backgroundColor: ['#00b894', '#3f7cff', '#ff8c20', '#8b5cf6', '#e05252'],
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '64%',
      plugins: {
        legend: { display: true, position: 'bottom', labels: { usePointStyle: true, color: '#536171', font: { family: 'Inter', weight: '800' } } },
        tooltip: { backgroundColor: '#1a232e', padding: 12, cornerRadius: 10, callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}% do domínio` } }
      }
    }
  });
}

const historyCtx = document.getElementById('competitionHistoryChart');
let competitionHistoryChart;
if (historyCtx) {
  competitionHistoryChart = new Chart(historyCtx, {
    type: 'line',
    data: {
      labels: ['2021', '2022', '2023', '2024', '2025'],
      datasets: [
        {
          label: 'ABC',
          data: [39, 44, 49, 54, 58],
          borderColor: '#00b894',
          backgroundColor: 'rgba(0,184,148,.14)',
          pointBackgroundColor: '#00b894',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 5,
          tension: .42,
          fill: true,
          borderWidth: 3
        },
        {
          label: 'Média do mercado',
          data: [36, 39, 42, 45, 47],
          borderColor: '#3f7cff',
          backgroundColor: 'rgba(63,124,255,.08)',
          pointBackgroundColor: '#3f7cff',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 5,
          tension: .42,
          fill: false,
          borderDash: [6, 5],
          borderWidth: 3
        }
      ]
    },
    options: {
      ...chartDefaults,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        ...chartDefaults.plugins,
        tooltip: { ...chartDefaults.plugins.tooltip, callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}%` } }
      },
      scales: {
        x: { ticks: { color:'#8a99aa', font:{ family:'Inter', weight:'800' } }, grid:{ display:false }, border:{ display:false } },
        y: { ticks: { color:'#8a99aa', callback:v=>`${v}%` }, grid:{ color:'#edf1f6' }, border:{ display:false }, suggestedMax:70 }
      }
    }
  });
}


const competitorProfiles = {
  'ABC': {
    color: '#00b894', radar: [66, 62, 58, 72, 64, 70], history: [39, 44, 49, 54, 58]
  },
  'Concorrente A': {
    color: '#3f7cff', radar: [58, 55, 52, 66, 59, 63], history: [36, 40, 45, 49, 52]
  },
  'Concorrente B': {
    color: '#ff8c20', radar: [53, 50, 48, 58, 55, 57], history: [34, 37, 41, 45, 48]
  },
  'Concorrente C': {
    color: '#8b5cf6', radar: [49, 47, 44, 55, 51, 54], history: [31, 35, 38, 41, 44]
  },
  'Concorrente D': {
    color: '#e05252', radar: [43, 41, 39, 49, 45, 48], history: [29, 32, 35, 37, 39]
  }
};
const fadedColor = 'rgba(148,163,184,.24)';
let selectedCompetitor = null;
const defaultRadar = {
  labels: ['ABC', 'Média do mercado'],
  data: [[66, 62, 58, 72, 64, 70], [52, 48, 47, 61, 53, 58]],
  colors: ['#00b894', '#3f7cff']
};
const defaultHistory = {
  labels: ['ABC', 'Média do mercado'],
  data: [[39, 44, 49, 54, 58], [36, 39, 42, 45, 47]],
  colors: ['#00b894', '#3f7cff']
};

function resetCompetitionHighlight() {
  selectedCompetitor = null;
  document.querySelectorAll('.rank-item').forEach(item => item.classList.remove('selected'));
  if (competitionBarChart) {
    competitionBarChart.data.datasets[0].backgroundColor = competitionData.map(item => item.color);
    competitionBarChart.data.datasets[0].borderColor = competitionData.map(() => 'transparent');
    competitionBarChart.data.datasets[0].borderWidth = competitionData.map(() => 0);
    competitionBarChart.update();
  }
  if (marketDominanceChart) {
    marketDominanceChart.data.datasets[0].offset = marketDominanceChart.data.labels.map(() => 0);
    marketDominanceChart.data.datasets[0].borderWidth = marketDominanceChart.data.labels.map(() => 0);
    marketDominanceChart.data.datasets[0].borderColor = marketDominanceChart.data.labels.map(() => 'transparent');
    marketDominanceChart.update();
  }
  if (competitionRadarChart) {
    competitionRadarChart.data.datasets = defaultRadar.labels.map((label, i) => ({
      label,
      data: defaultRadar.data[i],
      borderColor: defaultRadar.colors[i],
      backgroundColor: i === 0 ? 'rgba(0,184,148,.16)' : 'rgba(63,124,255,.10)',
      pointBackgroundColor: defaultRadar.colors[i],
      pointBorderColor: '#fff',
      pointRadius: 4
    }));
    competitionRadarChart.update();
  }
  if (competitionHistoryChart) {
    competitionHistoryChart.data.datasets = defaultHistory.labels.map((label, i) => ({
      label,
      data: defaultHistory.data[i],
      borderColor: defaultHistory.colors[i],
      backgroundColor: i === 0 ? 'rgba(0,184,148,.14)' : 'rgba(63,124,255,.08)',
      pointBackgroundColor: defaultHistory.colors[i],
      pointBorderColor: '#fff',
      pointBorderWidth: 3,
      pointRadius: 5,
      tension: .42,
      fill: i === 0,
      borderDash: i === 1 ? [6, 5] : [],
      borderWidth: 3
    }));
    competitionHistoryChart.update();
  }
}

function selectCompetitor(name) {
  if (!name || name === 'Média do mercado') return resetCompetitionHighlight();
  if (selectedCompetitor === name) return resetCompetitionHighlight();
  selectedCompetitor = name;
  const profile = competitorProfiles[name];
  document.querySelectorAll('.rank-item').forEach(item => {
    item.classList.toggle('selected', item.dataset.name === name);
  });
  if (competitionBarChart) {
    competitionBarChart.data.datasets[0].backgroundColor = competitionData.map(item => item.name === name ? item.color : fadedColor);
    competitionBarChart.data.datasets[0].borderColor = competitionData.map(item => item.name === name ? item.color : 'rgba(148,163,184,.25)');
    competitionBarChart.data.datasets[0].borderWidth = competitionData.map(item => item.name === name ? 3 : 0);
    competitionBarChart.update();
  }
  if (marketDominanceChart) {
    marketDominanceChart.data.datasets[0].offset = marketDominanceChart.data.labels.map(label => label === name ? 14 : 0);
    marketDominanceChart.data.datasets[0].borderWidth = marketDominanceChart.data.labels.map(label => label === name ? 3 : 0);
    marketDominanceChart.data.datasets[0].borderColor = marketDominanceChart.data.labels.map(label => label === name ? '#ffffff' : 'transparent');
    marketDominanceChart.update();
  }
  if (profile && competitionRadarChart) {
    competitionRadarChart.data.datasets = [
      {
        label: name,
        data: profile.radar,
        borderColor: profile.color,
        backgroundColor: `${profile.color}26`,
        pointBackgroundColor: profile.color,
        pointBorderColor: '#fff',
        pointRadius: 4
      },
      {
        label: 'Média do mercado',
        data: defaultRadar.data[1],
        borderColor: '#94a3b8',
        backgroundColor: 'rgba(148,163,184,.10)',
        pointBackgroundColor: '#94a3b8',
        pointBorderColor: '#fff',
        pointRadius: 4
      }
    ];
    competitionRadarChart.update();
  }
  if (profile && competitionHistoryChart) {
    competitionHistoryChart.data.datasets = [
      {
        label: name,
        data: profile.history,
        borderColor: profile.color,
        backgroundColor: `${profile.color}22`,
        pointBackgroundColor: profile.color,
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointRadius: 5,
        tension: .42,
        fill: true,
        borderWidth: 3
      },
      {
        label: 'Média do mercado',
        data: defaultHistory.data[1],
        borderColor: '#94a3b8',
        backgroundColor: 'rgba(148,163,184,.08)',
        pointBackgroundColor: '#94a3b8',
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointRadius: 5,
        tension: .42,
        fill: false,
        borderDash: [6, 5],
        borderWidth: 3
      }
    ];
    competitionHistoryChart.update();
  }
}

function getClickedChartLabel(chart, event) {
  if (!chart) return null;
  const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
  if (!points.length) return null;
  const point = points[0];
  const label = chart.data.labels?.[point.index] || chart.data.datasets?.[point.datasetIndex]?.label;
  return label;
}

document.querySelectorAll('.rank-item').forEach(item => {
  item.addEventListener('click', () => selectCompetitor(item.dataset.name || item.querySelector('span')?.textContent?.trim() || 'ABC'));
  item.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectCompetitor(item.dataset.name || item.querySelector('span')?.textContent?.trim() || 'ABC');
    }
  });
});

competitionBarChart?.canvas?.addEventListener('click', event => selectCompetitor(getClickedChartLabel(competitionBarChart, event)));
marketDominanceChart?.canvas?.addEventListener('click', event => selectCompetitor(getClickedChartLabel(marketDominanceChart, event)));
competitionRadarChart?.canvas?.addEventListener('click', event => selectCompetitor(getClickedChartLabel(competitionRadarChart, event)));
competitionHistoryChart?.canvas?.addEventListener('click', event => selectCompetitor(getClickedChartLabel(competitionHistoryChart, event)));
resetCompetitionHighlight();



function todayBR(){ return new Date().toLocaleDateString('pt-BR'); }
function exportRows(){
  return getFilteredReports().map(r => [r.id, r.area, r.indicador, r.trimestre, r.valor, r.meta, r.status]);
}
const pdfBtn = document.getElementById('exportPdfBtn');
const excelBtn = document.getElementById('exportExcelBtn');
if (pdfBtn) pdfBtn.onclick = () => {
  try {
    if (!window.jspdf?.jsPDF) {
      alert('Biblioteca jsPDF não carregou. Verifique sua conexão com a internet e tente novamente.');
      return;
    }

    exportToast?.classList.add('show');
    setTimeout(() => exportToast?.classList.remove('show'), 1500);

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const date = todayBR();
    const pageW = 210;
    const pageH = 297;

    const temporarilyRevealPages = () => {
      const pages = [...document.querySelectorAll('.page')];
      const old = pages.map(page => ({
        page,
        style: page.getAttribute('style'),
        active: page.classList.contains('active')
      }));
      pages.forEach(page => {
        page.classList.add('active');
        page.style.display = 'block';
        page.style.position = 'absolute';
        page.style.left = '-10000px';
        page.style.top = '0';
        page.style.width = '1180px';
        page.style.visibility = 'hidden';
      });
      ['lineChart','scoreChart','expenseBarChart','expenseDonutChart','competitionBarChart','marketDominanceChart','competitionRadarChart','competitionHistoryChart','trendChart'].forEach(id => {
        const chart = Chart.getChart(document.getElementById(id));
        if (chart) { chart.resize(900, 360); chart.update('none'); }
      });
      return () => old.forEach(({page, style, active}) => {
        if (style === null) page.removeAttribute('style'); else page.setAttribute('style', style);
        page.classList.toggle('active', active);
      });
    };

    const restorePages = temporarilyRevealPages();

    const chartImage = (id) => {
      const canvas = document.getElementById(id);
      const chart = canvas ? Chart.getChart(canvas) : null;
      try {
        if (chart) {
          chart.resize(900, 360);
          chart.update('none');
          return chart.toBase64Image('image/png', 1);
        }
        return canvas ? canvas.toDataURL('image/png', 1) : null;
      } catch (e) { return null; }
    };

    const images = {
      receita: chartImage('lineChart'),
      score: chartImage('scoreChart'),
      despesas: chartImage('expenseBarChart'),
      criticidade: chartImage('expenseDonutChart'),
      benchmark: chartImage('competitionBarChart'),
      dominio: chartImage('marketDominanceChart'),
      radar: chartImage('competitionRadarChart'),
      historico: chartImage('competitionHistoryChart')
    };

    restorePages();

    const filtered = exportRows();
    const dark = [15, 23, 34];
    const green = [0, 184, 148];
    const blue = [63, 124, 255];
    const muted = [122, 136, 153];
    const text = [26, 35, 46];
    const light = [242, 244, 248];

    const drawBrand = (x=14, y=12) => {
      doc.setFillColor(...green);
      doc.roundedRect(x, y, 12, 12, 3, 3, 'F');
      doc.setTextColor(255,255,255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('A', x+6, y+8, { align:'center' });
      doc.setTextColor(...text);
      doc.setFontSize(13);
      doc.text('ABC', x+18, y+5);
      doc.setTextColor(0, 184, 148);
      doc.setFontSize(8);
      doc.text('by Rafacodehub', x+18, y+11);
    };

    const addHeader = (title) => {
      doc.setFillColor(255,255,255);
      doc.rect(0,0,pageW,pageH,'F');
      drawBrand(14, 12);
      doc.setFont('helvetica','bold');
      doc.setFontSize(13);
      doc.setTextColor(...text);
      doc.text(title, 104, 20, { align:'center' });
      doc.setFont('helvetica','normal');
      doc.setFontSize(8);
      doc.setTextColor(...muted);
      doc.text(`Emitido em ${date}`, 196, 20, { align:'right' });
      doc.setDrawColor(228,233,240);
      doc.line(14, 29, 196, 29);
    };

    const drawFooter = (i, total) => {
      doc.setDrawColor(228,233,240);
      doc.line(14, 280, 196, 280);
      doc.setFont('helvetica','normal');
      doc.setFontSize(8);
      doc.setTextColor(...muted);
      doc.text('ABC Executive Analytics • by Rafacodehub', 14, 286);
      doc.text(`Página ${i}/${total}`, 196, 286, { align:'right' });
    };

    const drawCard = (x, y, w, h, title, value, note, color=green) => {
      doc.setFillColor(...light);
      doc.roundedRect(x, y, w, h, 5, 5, 'F');
      doc.setFillColor(color[0], color[1], color[2]);
      doc.roundedRect(x, y, 3, h, 2, 2, 'F');
      doc.setTextColor(...muted);
      doc.setFont('helvetica','bold');
      doc.setFontSize(8);
      doc.text(title, x+8, y+9);
      doc.setTextColor(...text);
      doc.setFontSize(15);
      doc.text(value, x+8, y+20);
      doc.setTextColor(...muted);
      doc.setFont('helvetica','normal');
      doc.setFontSize(8);
      doc.text(note, x+8, y+28);
    };

    const drawQRCode = (x, y, size, seedText) => {
      doc.setFillColor(255,255,255);
      doc.roundedRect(x-2, y-2, size+4, size+4, 2, 2, 'F');
      const cells = 25;
      const cell = size / cells;
      const seed = Array.from(seedText).reduce((a,ch)=>a+ch.charCodeAt(0),0);
      const finder = (fx, fy) => {
        doc.setFillColor(...dark); doc.rect(x+fx*cell, y+fy*cell, cell*7, cell*7, 'F');
        doc.setFillColor(255,255,255); doc.rect(x+(fx+1)*cell, y+(fy+1)*cell, cell*5, cell*5, 'F');
        doc.setFillColor(...dark); doc.rect(x+(fx+2)*cell, y+(fy+2)*cell, cell*3, cell*3, 'F');
      };
      finder(0,0); finder(18,0); finder(0,18);
      doc.setFillColor(...dark);
      for (let r=0; r<cells; r++) for (let c=0; c<cells; c++) {
        const inFinder=(c<7&&r<7)||(c>17&&r<7)||(c<7&&r>17);
        if (!inFinder && (((r*17+c*11+seed)%6===0)||((r+c+seed)%13===0))) {
          doc.rect(x+c*cell, y+r*cell, cell*.82, cell*.82, 'F');
        }
      }
    };

    doc.setFillColor(...dark); doc.rect(0,0,pageW,pageH,'F');
    doc.setFillColor(...green); doc.roundedRect(18,24,25,25,7,7,'F');
    doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(22); doc.text('A',30.5,41,{align:'center'});
    doc.setFontSize(12); doc.text('by Rafacodehub', 50, 34);
    doc.setFontSize(29); doc.text('Relatório Executivo ABC', 18, 78);
    doc.setFont('helvetica','normal'); doc.setFontSize(11); doc.setTextColor(203,214,228);
    doc.text(`Avaliação 2025 • Emitido em ${date}`, 18, 91);
    doc.setFillColor(255,255,255); doc.roundedRect(18, 116, 174, 70, 6, 6, 'F');
    doc.setTextColor(...text); doc.setFont('helvetica','bold'); doc.setFontSize(14); doc.text('KPI Summary', 28, 132);
    drawCard(28, 141, 72, 30, 'Receita Líquida', 'R$ 154,2 Mi', 'Acima da meta anual');
    drawCard(110, 141, 72, 30, 'Score Executivo', '86/100', 'Empresa saudável', blue);
    drawQRCode(164, 236, 25, `ABC|${date}|${filtered.length}`);
    doc.setTextColor(203,214,228); doc.setFontSize(8); doc.text('QR Code do relatório', 176.5, 267, {align:'center'});
    doc.setTextColor(...green); doc.setFont('helvetica','bold'); doc.text('ABC Executive Analytics', 18, 276);

    doc.addPage(); addHeader('Índice');
    doc.setTextColor(...text); doc.setFont('helvetica','bold'); doc.setFontSize(20); doc.text('Índice do relatório', 14, 48);
    doc.setFont('helvetica','normal'); doc.setFontSize(11); doc.setTextColor(65,75,90);
    [
      ['1. KPI Summary', 'p. 3'],
      ['2. Gráficos executivos', 'p. 4'],
      ['3. Benchmarking e radar chart', 'p. 5'],
      ['4. Resumo IA', 'p. 6'],
      ['5. Base analítica filtrada', 'p. 7+']
    ].forEach((row, idx) => { doc.text(row[0], 18, 68 + idx*12); doc.text(row[1], 188, 68 + idx*12, {align:'right'}); });
    doc.setFontSize(9); doc.setTextColor(...muted); doc.text(`Exportação filtrada: ${filtered.length} de 128 registros`, 18, 138);

    doc.addPage(); addHeader('KPI Summary');
    drawCard(14, 44, 84, 32, 'Receita Líquida', 'R$ 154,2 Mi', 'Meta anual: R$ 145 Mi');
    drawCard(112, 44, 84, 32, 'Lucro Operacional', 'R$ 28,7 Mi', 'Margem operacional: 18,6%', blue);
    drawCard(14, 88, 84, 32, 'Market Share', '23,7%', 'Avanço de 2,8 p.p.', [255,140,32]);
    drawCard(112, 88, 84, 32, 'Score Executivo', '86/100', 'Empresa saudável');
    if (images.score) doc.addImage(images.score, 'PNG', 70, 138, 70, 70);

    doc.addPage(); addHeader('Gráficos executivos');
    doc.setTextColor(...text); doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.text('Evolução mensal da receita', 14, 40);
    if (images.receita) doc.addImage(images.receita, 'PNG', 14, 45, 182, 72);
    doc.text('Custos por área', 14, 130);
    if (images.despesas) doc.addImage(images.despesas, 'PNG', 14, 135, 120, 64);
    if (images.criticidade) doc.addImage(images.criticidade, 'PNG', 140, 132, 56, 62);

    doc.addPage(); addHeader('Benchmarking e Radar Chart');
    doc.setTextColor(...text); doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.text('Comparativo de desempenho', 14, 40);
    if (images.benchmark) doc.addImage(images.benchmark, 'PNG', 14, 45, 88, 66);
    doc.text('Radar competitivo', 112, 40);
    if (images.radar) doc.addImage(images.radar, 'PNG', 108, 45, 88, 66);
    doc.text('Crescimento histórico', 14, 126);
    if (images.historico) doc.addImage(images.historico, 'PNG', 14, 132, 182, 68);
    doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(65,75,90);
    doc.text('ABC lidera o ranking competitivo, mantendo vantagem sobre a média do mercado.', 14, 218);

    doc.addPage(); addHeader('Resumo IA');
    doc.setTextColor(...text); doc.setFont('helvetica','bold'); doc.setFontSize(18); doc.text('Resumo automático executivo', 14, 48);
    const insights = [
      ['Crescimento saudável', 'ABC mantém evolução acima da média do mercado e consolida vantagem competitiva.'],
      ['Atenção em custos', 'Operações e logística seguem como pontos críticos para proteção da margem.'],
      ['Benchmark positivo', 'Concorrente A é o mais próximo, mas ABC preserva liderança no radar competitivo.'],
      ['Próxima ação', 'Priorizar renegociação de custos e manter ritmo comercial no próximo trimestre.']
    ];
    insights.forEach((it, idx) => {
      const y = 66 + idx*42;
      doc.setFillColor(...light); doc.roundedRect(14, y, 182, 28, 5, 5, 'F');
      doc.setFillColor(idx===1 ? 255 : 0, idx===1 ? 140 : 184, idx===1 ? 32 : 148); doc.roundedRect(14, y, 3, 28, 2, 2, 'F');
      doc.setTextColor(...text); doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.text(it[0], 22, y+10);
      doc.setTextColor(...muted); doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.text(it[1], 22, y+20, {maxWidth: 164});
    });

    doc.addPage(); addHeader('Base analítica filtrada');
    let ty = 42;
    const drawTableHeader = () => {
      doc.setFillColor(...light); doc.roundedRect(14, ty-6, 182, 10, 2, 2, 'F');
      doc.setFont('helvetica','bold'); doc.setFontSize(7.5); doc.setTextColor(...text);
      doc.text('ID', 17, ty); doc.text('Área', 29, ty); doc.text('Indicador', 62, ty); doc.text('Tri', 104, ty); doc.text('Valor', 123, ty); doc.text('Meta', 149, ty); doc.text('Status', 176, ty);
      ty += 10;
    };
    drawTableHeader();
    doc.setFont('helvetica','normal'); doc.setFontSize(7.2);
    filtered.forEach(row => {
      if (ty > 270) { doc.addPage(); addHeader('Base analítica filtrada'); ty = 42; drawTableHeader(); doc.setFont('helvetica','normal'); doc.setFontSize(7.2); }
      doc.setTextColor(65,75,90);
      doc.text(String(row[0]), 17, ty);
      doc.text(String(row[1]).slice(0, 14), 29, ty);
      doc.text(String(row[2]).slice(0, 17), 62, ty);
      doc.text(String(row[3]), 104, ty);
      doc.text(String(row[4]), 123, ty);
      doc.text(String(row[5]), 149, ty);
      doc.text(String(row[6]).slice(0, 10), 176, ty);
      ty += 7;
    });

    const total = doc.internal.getNumberOfPages();
    for (let i=2; i<=total; i++) { doc.setPage(i); drawFooter(i, total); }
    doc.save(`relatorio-executivo-abc-${date.replaceAll('/', '-')}.pdf`);
    showExportNotification?.();
  } catch (error) {
    console.error(error);
    alert('Não foi possível exportar o PDF. Confira o console do navegador para detalhes.');
  }
};

if (excelBtn) excelBtn.onclick = () => {
  const date = todayBR();
  const rows = [
    ['ABC Executive Analytics'],
    ['by Rafacodehub'],
    [`Data de emissão: ${date}`],
    [],
    ['ID','Área','Indicador','Trimestre','Valor','Meta','Status'],
    ...exportRows()
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  worksheet['!cols'] = [{wch:8},{wch:18},{wch:20},{wch:14},{wch:14},{wch:14},{wch:16}];
  worksheet['!freeze'] = { xSplit: 0, ySplit: 5 };
  const workbook = XLSX.utils.book_new();
  workbook.Props = { Title:'Relatório Executivo ABC', Subject:'Dashboard ABC', Author:'Rafacodehub', CreatedDate:new Date() };
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Base Executiva');

  const resumo = XLSX.utils.aoa_to_sheet([
    ['Logo','A'], ['Assinatura','by Rafacodehub'], ['Data', date], [],
    ['Indicador','Valor'], ['Receita Líquida','R$ 154,2 Mi'], ['Lucro Operacional','R$ 28,7 Mi'], ['Market Share','23,7%'], ['Score Executivo','86/100']
  ]);
  resumo['!cols'] = [{wch:22},{wch:22}];
  XLSX.utils.book_append_sheet(workbook, resumo, 'Resumo');
  XLSX.writeFile(workbook, `relatorio-executivo-abc-${date.replaceAll('/', '-')}.xlsx`);
};


(function initExcelCsvUpload(){
  const input = document.getElementById('dataUploadInput');
  const chooseBtn = document.getElementById('chooseUploadBtn');
  const templateBtn = document.getElementById('downloadTemplateBtn');
  const status = document.getElementById('uploadStatus');
  const uploadPanel = document.querySelector('.upload-panel');
  if (!input || !chooseBtn) return;

  const normalizeKey = key => String(key || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]/g, '');
  const getValue = (row, aliases) => {
    const normalized = Object.fromEntries(Object.keys(row).map(key => [normalizeKey(key), row[key]]));
    for (const alias of aliases) {
      const value = normalized[normalizeKey(alias)];
      if (value !== undefined && value !== null && value !== '') return value;
    }
    return '';
  };
  const toNum = value => {
    if (typeof value === 'number') return value;
    const clean = String(value ?? '').replace(/R\$/g, '').replace(/Mi/g, '').replace(/%/g, '').replace(/\./g, '').replace(',', '.').trim();
    const parsed = parseFloat(clean);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const monthOrder = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const competitorColorsMap = {
    'ABC':'#00b894', 'Concorrente A':'#3f7cff', 'Concorrente B':'#ff8c20', 'Concorrente C':'#8b5cf6', 'Concorrente D':'#e05252', 'Média do mercado':'#94a3b8'
  };

  function setText(selector, text) {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  }
  function formatMoney(value){ return `R$ ${Number(value || 0).toFixed(1).replace('.', ',')} Mi`; }
  function average(values){ const valid = values.filter(v => Number.isFinite(v) && v > 0); return valid.length ? valid.reduce((a,b)=>a+b,0)/valid.length : 0; }

  function updateDashboardFromRows(rows) {
    if (!rows.length) throw new Error('A planilha está vazia.');

    const monthMap = new Map();
    const reportRowsFromFile = [];
    const competitorMap = new Map();

    rows.forEach((row, index) => {
      const mes = String(getValue(row, ['Mês','Mes','Month']) || '').slice(0,3);
      const receitaABC = toNum(getValue(row, ['Receita ABC','ReceitaABC','ABC Receita','Receita']));
      const receitaCompA = toNum(getValue(row, ['Receita Concorrente A','Concorrente A Receita','Receita Conc A']));
      if (mes || receitaABC || receitaCompA) {
        const label = monthOrder.find(m => normalizeKey(m) === normalizeKey(mes)) || mes || `Mês ${index + 1}`;
        const current = monthMap.get(label) || { abc:0, compA:0 };
        current.abc += receitaABC;
        current.compA += receitaCompA;
        monthMap.set(label, current);
      }

      const area = getValue(row, ['Área','Area']);
      const indicador = getValue(row, ['Indicador','KPI']);
      const trimestre = getValue(row, ['Trimestre','Quarter']);
      const valorNum = toNum(getValue(row, ['Valor','Valor Num','Resultado']));
      const metaNum = toNum(getValue(row, ['Meta','Meta Num','Objetivo']));
      const rowStatus = getValue(row, ['Status','Situação','Situacao']) || 'OK';
      if (area || indicador || valorNum || metaNum) {
        reportRowsFromFile.push({
          id: reportRowsFromFile.length + 1,
          area: area || 'Geral',
          indicador: indicador || 'Indicador',
          trimestre: trimestre || 'Atual',
          valorNum,
          metaNum,
          valor: formatMoney(valorNum),
          meta: formatMoney(metaNum),
          status: rowStatus
        });
      }

      const competitor = getValue(row, ['Concorrente','Empresa','Competitor']);
      if (competitor) {
        const name = String(competitor).trim();
        const current = competitorMap.get(name) || { count:0, receita:0, roi:0, crescimento:0, eficiencia:0, market:0 };
        current.count += 1;
        current.receita += toNum(getValue(row, ['Receita','Receita Benchmark','Receita Concorrente']));
        current.roi += toNum(getValue(row, ['ROI']));
        current.crescimento += toNum(getValue(row, ['Crescimento','Growth']));
        current.eficiencia += toNum(getValue(row, ['Eficiência','Eficiencia','Efficiency']));
        current.market += toNum(getValue(row, ['Market Share','MarketShare','Share']));
        competitorMap.set(name, current);
      }
    });

    if (monthMap.size) {
      const labels = [...monthMap.keys()].sort((a,b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
      const abc = labels.map(m => +(monthMap.get(m).abc || 0).toFixed(1));
      const compA = labels.map(m => +(monthMap.get(m).compA || 0).toFixed(1));
      const chart = Chart.getChart('lineChart');
      if (chart) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = abc;
        chart.data.datasets[1].data = compA;
        chart.update();
      }
      const totalRevenue = abc.reduce((a,b)=>a+b,0);
      const compTotal = compA.reduce((a,b)=>a+b,0);
      const share = totalRevenue + compTotal ? (totalRevenue / (totalRevenue + compTotal) * 100) : 0;
      const firstCard = document.querySelector('.summary-grid .metric-card:nth-child(1)');
      const thirdCard = document.querySelector('.summary-grid .metric-card:nth-child(3)');
      if (firstCard) {
        firstCard.querySelector('h3').textContent = formatMoney(totalRevenue);
        firstCard.querySelector('p').textContent = `Atualizado via upload: ${labels.length} período(s)`;
      }
      if (thirdCard) {
        thirdCard.querySelector('h3').textContent = `${share.toFixed(1).replace('.', ',')}%`;
        thirdCard.querySelector('p').textContent = 'Market share recalculado via arquivo';
      }
      document.querySelectorAll('.report-cards div')[0]?.querySelector('strong') && (document.querySelectorAll('.report-cards div')[0].querySelector('strong').textContent = formatMoney(totalRevenue));
      document.querySelectorAll('.report-cards div')[2]?.querySelector('strong') && (document.querySelectorAll('.report-cards div')[2].querySelector('strong').textContent = `${share.toFixed(1).replace('.', ',')}%`);
    }

    if (reportRowsFromFile.length) {
      if (Array.isArray(reportDatabase)) {
        reportDatabase.length = 0;
        reportRowsFromFile.forEach(row => reportDatabase.push(row));
        renderReportTable?.();
      }
    }

    const expenseRows = rows.map(row => ({
      area: getValue(row, ['Área','Area']) || 'Geral',
      despesa: toNum(getValue(row, ['Despesa','Custo','Custos','Valor Despesa'])),
      orcamento: toNum(getValue(row, ['Orçamento','Orcamento','Budget','Meta Despesa'])),
      variacao: toNum(getValue(row, ['Variação','Variacao','Variação %','Variacao %'])),
      status: getValue(row, ['Status','Situação','Situacao']) || 'OK',
      acao: getValue(row, ['Ação','Acao','Plano de ação','Plano de acao']) || 'Acompanhar indicador'
    })).filter(item => item.despesa > 0 || item.orcamento > 0 || normalizeKey(item.status) === 'critico' || normalizeKey(item.status) === 'atencao');

    if (expenseRows.length && Array.isArray(expenses)) {
      const grouped = new Map();
      expenseRows.forEach(item => {
        const current = grouped.get(item.area) || { area:item.area, despesa:0, orcamento:0, variacao:0, status:'OK', acao:item.acao, count:0 };
        current.despesa += item.despesa;
        current.orcamento += item.orcamento;
        current.variacao += item.variacao;
        current.count += 1;
        if (normalizeKey(item.status).includes('critico')) current.status = 'Crítico';
        else if (normalizeKey(item.status).includes('atencao') && current.status !== 'Crítico') current.status = 'Atenção';
        current.acao = item.acao || current.acao;
        grouped.set(item.area, current);
      });
      expenses.length = 0;
      [...grouped.values()].forEach(item => expenses.push({
        area: item.area,
        despesa: +(item.despesa).toFixed(1),
        orcamento: +(item.orcamento || item.despesa).toFixed(1),
        variacao: +(item.count ? item.variacao / item.count : 0).toFixed(1),
        status: item.status,
        acao: item.acao
      }));
      renderExpensesTable?.();
      const expenseChart = Chart.getChart('expenseBarChart');
      if (expenseChart) {
        expenseChart.data.labels = expenses.map(e => e.area);
        expenseChart.data.datasets[0].data = expenses.map(e => e.despesa);
        expenseChart.data.datasets[0].backgroundColor = expenses.map(e => e.status === 'Crítico' ? '#e05252' : e.status === 'Atenção' ? '#ff8c20' : '#00b894');
        expenseChart.update();
      }
    }

    if (competitorMap.size) {
      const parsed = [...competitorMap.entries()].map(([name, data]) => {
        const count = data.count || 1;
        const market = data.market / count || 0;
        const receita = data.receita / count || 0;
        const roi = data.roi / count || 0;
        const crescimento = data.crescimento / count || 0;
        const eficiencia = data.eficiencia / count || 0;
        return { name, receita, roi, crescimento, eficiencia, market, score: average([receita, roi, crescimento, eficiencia, market]) };
      }).filter(item => item.score > 0);

      parsed.forEach(item => {
        const color = competitorColorsMap[item.name] || '#64748b';
        if (competitorProfiles?.[item.name]) {
          competitorProfiles[item.name].color = color;
          competitorProfiles[item.name].radar = [item.roi, item.receita, item.crescimento, item.eficiencia, item.market];
          competitorProfiles[item.name].history = [Math.max(20, item.score - 12), Math.max(25, item.score - 8), Math.max(30, item.score - 5), Math.max(35, item.score - 2), item.score];
        }
      });

      if (competitionBarChart && parsed.length) {
        competitionBarChart.data.labels = parsed.map(i => i.name);
        competitionBarChart.data.datasets[0].data = parsed.map(i => +i.score.toFixed(1));
        competitionBarChart.data.datasets[0].backgroundColor = parsed.map(i => competitorColorsMap[i.name] || '#64748b');
        competitionBarChart.update();
      }
      if (marketDominanceChart && parsed.length) {
        const total = parsed.reduce((sum, i) => sum + i.market, 0) || 1;
        marketDominanceChart.data.labels = parsed.map(i => i.name);
        marketDominanceChart.data.datasets[0].data = parsed.map(i => +(i.market / total * 100).toFixed(1));
        marketDominanceChart.data.datasets[0].backgroundColor = parsed.map(i => competitorColorsMap[i.name] || '#64748b');
        marketDominanceChart.update();
      }
      resetCompetitionHighlight?.();
    }

    status.textContent = `${rows.length} linha(s) importadas com sucesso`;
    uploadPanel?.classList.add('upload-success');
    addNotification('Upload concluído', 'Excel/CSV importado e dashboard atualizado.', 'success');
  }

  function addNotification(title, desc, type='info') {
    const panel = document.getElementById('notificationPanel');
    if (!panel) return;
    const item = document.createElement('div');
    item.className = `notification-item ${type}`;
    item.innerHTML = `<b>${title}</b><small>${desc}</small>`;
    panel.appendChild(item);
    const counters = document.querySelectorAll('.notification-toggle i');
    counters.forEach(counter => {
      const value = parseInt(counter.textContent || '0', 10) || 0;
      counter.textContent = value + 1;
      counter.parentElement?.classList.remove('no-unread');
    });
    const headCount = panel.querySelector('.notification-head span');
    if (headCount) headCount.textContent = `${panel.querySelectorAll('.notification-item:not(.read)').length} novas`;
  }

  chooseBtn.addEventListener('click', () => input.click());
  input.addEventListener('change', event => {
    const file = event.target.files?.[0];
    if (!file) return;
    status.textContent = 'Lendo arquivo...';
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type:'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(firstSheet, { defval:'' });
        updateDashboardFromRows(rows);
      } catch (error) {
        console.error(error);
        status.textContent = 'Erro ao importar. Verifique o modelo.';
        alert('Não foi possível ler o arquivo. Baixe o modelo e tente novamente.');
      }
    };
    reader.readAsArrayBuffer(file);
  });

  templateBtn?.addEventListener('click', () => {
    const rows = [
      ['Mês','Receita ABC','Receita Concorrente A','Área','Indicador','Trimestre','Valor','Meta','Status','Concorrente','ROI','Receita Benchmark','Crescimento','Eficiência','Market Share','Despesa','Orçamento','Variação','Ação'],
      ['Jan',12.5,9.4,'Comercial','Receita','1º Tri',12.5,11.0,'Acima','ABC',66,66,58,72,58,6.9,7.2,-4.2,'Manter canal comercial'],
      ['Fev',14.2,10.8,'Marketing','ROI','1º Tri',4.7,4.0,'OK','Concorrente A',58,52,52,66,52,9.8,9.1,7.7,'Otimizar campanhas de baixo ROI'],
      ['Mar',16.1,12.0,'Operações','Despesa','1º Tri',6.0,5.4,'Atenção','Concorrente B',53,48,48,58,48,18.4,16.4,12.2,'Revisar fornecedores e horas extras'],
      ['Abr',18.6,14.5,'Expansão','Market Share','2º Tri',23.7,21.0,'Acima','Concorrente C',49,44,44,55,44,4.5,4.8,-6.3,'Acelerar parcerias regionais'],
      ['Mai',22.0,17.2,'Custos','Eficiência','2º Tri',72,70,'OK','Concorrente D',43,39,39,49,39,5.8,5.1,13.7,'Renegociar fretes e rotas'],
      ['Jun',20.7,16.4,'Financeiro','Lucro','2º Tri',28.7,24.0,'Acima','Média do mercado',51,46,46,57,46,3.6,3.7,-2.7,'Manter produtividade'],
      ['Jul',25.2,19.8,'Atendimento','Eficiência','3º Tri',78,74,'OK','ABC',69,69,61,78,61,4.2,4.3,-2.3,'Padronizar SLAs'],
      ['Ago',29.4,23.1,'Produto','Receita','3º Tri',29.4,26.0,'Acima','Concorrente A',60,55,54,68,53,7.2,7.0,2.9,'Auditar licenças e cloud'],
      ['Set',31.8,25.2,'Comercial','Market Share','3º Tri',24.8,22.0,'Acima','Concorrente B',55,50,49,60,49,7.0,7.4,-5.4,'Reforçar contas estratégicas'],
      ['Out',34.5,27.6,'Marketing','ROI','4º Tri',5.2,4.4,'OK','Concorrente C',50,45,45,56,45,8.1,8.0,1.3,'Ajustar CAC por canal'],
      ['Nov',38.1,30.8,'Operações','Despesa','4º Tri',8.8,8.0,'Atenção','Concorrente D',44,40,40,50,40,12.8,11.6,10.3,'Reduzir custo variável'],
      ['Dez',42.7,34.0,'Expansão','Receita','4º Tri',42.7,39.0,'Acima','Média do mercado',52,47,47,58,47,6.4,6.7,-4.5,'Priorizar mercados lucrativos']
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = rows[0].map(h => ({ wch: Math.max(14, String(h).length + 2) }));
    const wb = XLSX.utils.book_new();
    wb.Props = { Title:'Modelo Dashboard ABC', Subject:'Base editável para upload no dashboard', Author:'Rafacodehub', CreatedDate:new Date() };
    XLSX.utils.book_append_sheet(wb, ws, 'Modelo Completo');
    XLSX.writeFile(wb, 'modelo_dashboard_abc_completo.xlsx');
  });
})();

(function initNotificationReadState(){
  const btn = document.getElementById('markNotificationsRead');
  const panel = document.getElementById('notificationPanel');
  if (!btn || !panel) return;
  btn.addEventListener('click', event => {
    event.stopPropagation();
    panel.querySelectorAll('.notification-item').forEach(item => item.classList.add('read'));
    panel.querySelector('.notification-head span').textContent = '0 novas';
    document.querySelectorAll('.notification-toggle').forEach(toggle => {
      toggle.classList.add('no-unread');
      const counter = toggle.querySelector('i');
      if (counter) counter.textContent = '0';
    });
  });
})();


(function initEnterpriseRuntime(){
  const API_BASE = (location.protocol.startsWith('http') ? `${location.origin}` : 'http://localhost:3000');
  let backendOnline = false;
  let pendingImportToken = null;

  const backendStatus = document.getElementById('backendStatus');
  const aiStatusTag = document.getElementById('aiStatusTag');
  const modal = document.getElementById('importPreviewModal');
  const previewHead = document.getElementById('importPreviewHead');
  const previewBody = document.getElementById('importPreviewBody');
  const validationSummary = document.getElementById('importValidationSummary');
  const closePreview = document.getElementById('closeImportPreview');
  const cancelPreview = document.getElementById('cancelBackendImport');
  const commitPreview = document.getElementById('commitBackendImport');

  function setBackendStatus(online){
    backendOnline = online;
    if (backendStatus) {
      backendStatus.textContent = online ? 'online' : 'modo local';
      backendStatus.style.color = online ? 'var(--green)' : 'var(--orange)';
    }
    if (aiStatusTag) aiStatusTag.textContent = online ? 'IA + banco' : 'IA local';
  }

  async function api(path, options={}){
    const res = await fetch(`${API_BASE}${path}`, options);
    if (!res.ok) throw new Error(await res.text());
    const type = res.headers.get('content-type') || '';
    return type.includes('application/json') ? res.json() : res.blob();
  }

  async function pingBackend(){
    try {
      await api('/api/health');
      setBackendStatus(true);
      addEnterpriseNotification('Banco conectado', 'Backend ativo: uploads, histórico, IA e exportações reais disponíveis.', 'success');
    } catch (_) {
      setBackendStatus(false);
    }
  }

  function addEnterpriseNotification(title, desc, type='info'){
    const panel = document.getElementById('notificationPanel');
    if (!panel) return;
    const item = document.createElement('div');
    item.className = `notification-item ${type}`;
    item.innerHTML = `<b>${title}</b><small>${desc}</small>`;
    panel.appendChild(item);
    document.querySelectorAll('.notification-toggle').forEach(toggle => {
      toggle.classList.remove('no-unread');
      const badge = toggle.querySelector('i');
      if (badge) badge.textContent = (parseInt(badge.textContent || '0', 10) || 0) + 1;
    });
    const count = panel.querySelectorAll('.notification-item:not(.read)').length;
    const headCount = panel.querySelector('.notification-head span');
    if (headCount) headCount.textContent = `${count} novas`;
  }

  function currentClientState(){
    const reports = typeof getFilteredReports === 'function' ? getFilteredReports() : [];
    const kpis = [...document.querySelectorAll('.summary-grid .metric-card')].slice(0,4).map(card => ({
      label: card.querySelector('.metric-top span')?.textContent?.trim() || '',
      value: card.querySelector('h3')?.textContent?.trim() || '',
      note: card.querySelector('p')?.textContent?.trim() || ''
    }));
    const expensesState = Array.isArray(window.expenses) ? window.expenses : (typeof expenses !== 'undefined' ? expenses : []);
    return { generatedAt: new Date().toISOString(), kpis, reports, expenses: expensesState };
  }

  async function syncBackend(){
    if (!backendOnline) return addEnterpriseNotification('Modo local', 'Inicie o backend com npm start para salvar no banco.', 'info');
    await api('/api/sync', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify(currentClientState())
    });
    addEnterpriseNotification('Dados sincronizados', 'Relatórios, KPIs e despesas foram salvos no banco.', 'success');
  }

  function showModal(){ modal?.classList.add('show'); modal?.setAttribute('aria-hidden','false'); }
  function hideModal(){ modal?.classList.remove('show'); modal?.setAttribute('aria-hidden','true'); pendingImportToken = null; }
  closePreview?.addEventListener('click', hideModal);
  cancelPreview?.addEventListener('click', hideModal);

  function renderPreview(payload){
    const rows = payload.preview || [];
    const headers = payload.headers || Object.keys(rows[0] || {});
    pendingImportToken = payload.importToken;
    validationSummary.className = `import-validation ${payload.valid ? 'valid' : 'invalid'}`;
    validationSummary.innerHTML = payload.valid
      ? `Arquivo validado com sucesso. ${payload.totalRows} linha(s), ${payload.sheets?.length || 1} aba(s). Pronto para salvar no banco.`
      : `Foram encontrados erros: ${(payload.errors || []).join(' • ')}`;
    previewHead.innerHTML = `<tr>${headers.slice(0,10).map(h => `<th>${h}</th>`).join('')}</tr>`;
    previewBody.innerHTML = rows.slice(0,8).map(row => `<tr>${headers.slice(0,10).map(h => `<td>${row[h] ?? ''}</td>`).join('')}</tr>`).join('');
    showModal();
  }

  document.getElementById('dataUploadInput')?.addEventListener('change', async event => {
    if (!backendOnline) return; // deixa o importador local já existente trabalhar
    event.stopImmediatePropagation();
    const file = event.target.files?.[0];
    if (!file) return;
    const status = document.getElementById('uploadStatus');
    if (status) status.textContent = 'Validando no backend...';
    const form = new FormData();
    form.append('file', file);
    try {
      const payload = await api('/api/import/preview', { method:'POST', body: form });
      renderPreview(payload);
      if (status) status.textContent = payload.valid ? 'Preview validado. Confirme para salvar.' : 'Arquivo com erros de validação.';
    } catch (error) {
      console.error(error);
      if (status) status.textContent = 'Falha no backend. Usando modo local.';
      addEnterpriseNotification('Validação indisponível', 'O arquivo será tratado em modo local.', 'info');
    }
  }, true);

  commitPreview?.addEventListener('click', async () => {
    if (!pendingImportToken) return;
    try {
      const result = await api('/api/import/commit', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ importToken: pendingImportToken })
      });
      hideModal();
      document.getElementById('uploadStatus').textContent = `${result.rowsSaved} linha(s) salvas no banco`;
      addEnterpriseNotification('Upload salvo', 'Dados importados com rollback disponível e histórico registrado.', 'success');
      const status = document.getElementById('backendStatus');
      if (status) status.textContent = 'dados salvos';
    } catch (error) {
      console.error(error);
      validationSummary.className = 'import-validation invalid';
      validationSummary.textContent = 'Erro ao salvar no banco. Nada foi alterado.';
    }
  });

  function aoaSheet(rows){
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = rows[0].map(h => ({ wch: Math.max(14, String(h).length + 3) }));
    return ws;
  }

  function downloadEnterpriseTemplate(event){
    event?.preventDefault?.();
    event?.stopImmediatePropagation?.();
    const wb = XLSX.utils.book_new();
    wb.Props = { Title:'Modelo Enterprise Dashboard ABC', Author:'Rafacodehub', CreatedDate:new Date() };
    XLSX.utils.book_append_sheet(wb, aoaSheet([
      ['Indicador','Valor','Meta','Variação','Status'],
      ['Receita Líquida',154.2,145,15.7,'Acima'],
      ['Lucro Operacional',28.7,24,21.4,'Acima'],
      ['Market Share',23.7,21,2.8,'Acima'],
      ['Eficiência',72,70,0,'Estável'],
      ['Score Executivo',86,80,6,'Acima']
    ]), 'KPIs');
    XLSX.utils.book_append_sheet(wb, aoaSheet([
      ['Mês','Receita ABC','Receita Concorrente A','Meta Projetada'],
      ['Jan',8,7,8],['Fev',15,12,14],['Mar',13,14,15],['Abr',18,16,18],['Mai',25,19,22],['Jun',22,20,24],['Jul',31,26,30],['Ago',40,31,36],['Set',46,35,42],['Out',43,37,44],['Nov',55,43,50],['Dez',66,49,60]
    ]), 'Mensal');
    XLSX.utils.book_append_sheet(wb, aoaSheet([
      ['ID','Área','Indicador','Trimestre','Valor','Meta','Status'],
      [1,'Comercial','Receita','1º Tri',66,60,'Acima'],
      [2,'Marketing','ROI','1º Tri',4.7,4,'OK'],
      [3,'Operações','Margem','1º Tri',14.2,16,'Atenção'],
      [4,'Expansão','Receita','2º Tri',30.6,28,'Planejado']
    ]), 'Relatorios');
    XLSX.utils.book_append_sheet(wb, aoaSheet([
      ['Concorrente','Índice','ROI','Receita','Crescimento','Eficiência','Market Share'],
      ['ABC',58,66,66,58,72,58],
      ['Concorrente A',52,58,52,52,66,52],
      ['Concorrente B',48,53,48,48,58,48],
      ['Concorrente C',44,49,44,44,55,44],
      ['Concorrente D',39,43,39,39,49,39],
      ['Média do mercado',46,51,46,46,57,46]
    ]), 'Benchmark');
    XLSX.utils.book_append_sheet(wb, aoaSheet([
      ['Área','Despesa','Orçamento','Variação','Status','Ação'],
      ['Operações',18.4,16.4,12.2,'Crítico','Revisar fornecedores e horas extras'],
      ['Marketing',9.8,9.1,7.7,'Atenção','Otimizar campanhas'],
      ['Comercial',6.9,7.2,-4.2,'OK','Manter controle']
    ]), 'Despesas');
    XLSX.writeFile(wb, 'modelo_enterprise_dashboard_abc.xlsx');
  }

  document.getElementById('downloadAdvancedTemplateBtn')?.addEventListener('click', downloadEnterpriseTemplate, true);
  document.getElementById('downloadTemplateBtn')?.addEventListener('click', downloadEnterpriseTemplate, true);

  async function exportRealPdf(event){
    if (!backendOnline) return; // deixa exportação local original funcionar
    event.preventDefault();
    event.stopImmediatePropagation();
    const toast = document.getElementById('exportToast');
    if (toast) { toast.textContent = 'gerando PDF real'; toast.classList.add('show'); }
    try {
      await syncBackend();
      const blob = await api('/api/export/pdf', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify(currentClientState())
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio_abc_${new Date().toISOString().slice(0,10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      addEnterpriseNotification('Exportação concluída', 'PDF validável com QR Code, paginação e dados reais gerado.', 'success');
    } catch (error) {
      console.error(error);
      addEnterpriseNotification('Erro na exportação', 'Não foi possível gerar o PDF no backend.', 'info');
    } finally {
      setTimeout(() => toast?.classList.remove('show'), 1200);
    }
  }
  document.getElementById('exportPdfBtn')?.addEventListener('click', exportRealPdf, true);
  document.getElementById('exportBtn')?.addEventListener('click', exportRealPdf, true);
  document.getElementById('syncBackendBtn')?.addEventListener('click', syncBackend);

  function localExecutiveAI(){
    const grid = document.getElementById('aiInsightsGrid');
    if (!grid) return;
    const reports = typeof getFilteredReports === 'function' ? getFilteredReports() : [];
    const critical = reports.filter(r => /crítico|critico/i.test(r.status)).length;
    const attention = reports.filter(r => /atenção|atencao/i.test(r.status)).length;
    const above = reports.filter(r => /acima|ok/i.test(r.status)).length;
    grid.innerHTML = `
      <div class="ai-card success"><b>ABC acima da média</b><span>KPIs principais seguem positivos e a receita anual supera a meta consolidada.</span></div>
      <div class="ai-card ${critical ? 'risk' : 'warning'}"><b>Risco financeiro ${critical ? 'moderado' : 'baixo'}</b><span>${critical} registro(s) crítico(s) e ${attention} em atenção exigem acompanhamento.</span></div>
      <div class="ai-card info"><b>Eficiência executiva</b><span>${above} indicador(es) estão em situação favorável na base filtrada.</span></div>
    `;
  }
  setTimeout(localExecutiveAI, 700);
  pingBackend();
})();
