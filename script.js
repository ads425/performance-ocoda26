/* ================================================================
   Performance Ocoda v4 — Complete Production Logic
   script.js  |  All values in SAR ر.س
   ================================================================ */
'use strict';

/* ══════════════════════════════════════════════════════════════
   1. CONFIG
══════════════════════════════════════════════════════════════ */
const APP = {
  sym:     'ر.س',
  token:   'sk_live_PerfOcoda_9Kx7mQ2nBvR4tZ8wLpAJ3fNdY6SA',
  webhook: 'https://api.performanceocoda.sa/webhooks/v1/metrics/inbound',
};

const LEVEL_CFG = {
  Senior:      { fullAt: 1.00, bannerCls: 'lvb-senior', label: 'Strict — 100% of target required' },
  'Mid-Level': { fullAt: 0.90, bannerCls: 'lvb-mid',    label: 'Balanced — 90% of target = full score' },
  Junior:      { fullAt: 0.80, bannerCls: 'lvb-junior', label: 'Growth — 80% of target = full score' },
};

const OPS_LABELS = [
  'Ad Account Setup',
  'Tracking & Pixels Implementation',
  'Client Requirements Fulfillment',
  'Campaign Optimization',
  'Problem Solving & Creative Ideas',
  'AI Tools Utilization',
];

const SUGGESTED_OBJ = [
  'Leads','Conversions','Messages','App Installs',
  'Brand Awareness','Reach','Traffic','Engagement',
  'Video Views','Store Visits','Catalog Sales','Event Responses',
];

const MEMBER_COLORS = {
  hassan: '#7F77DD',
  dalia:  '#1D9E75',
  engy:   '#D85A30',
  ahmed:  '#378ADD',
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/* ══════════════════════════════════════════════════════════════
   2. GLOBAL STATE
══════════════════════════════════════════════════════════════ */
const state = { month: 6, year: 2025 };

/* ══════════════════════════════════════════════════════════════
   3. DATA STORE
══════════════════════════════════════════════════════════════ */
const members = [
  { id:'hassan', name:'Hassan', level:'Senior',    color:'purple', av:'HS', clients:['CL-001','CL-002','CL-005'] },
  { id:'dalia',  name:'Dalia',  level:'Senior',    color:'teal',   av:'DA', clients:['CL-003','CL-006'] },
  { id:'engy',   name:'Engy',   level:'Mid-Level', color:'coral',  av:'EN', clients:['CL-004','CL-007'] },
  { id:'ahmed',  name:'Ahmed',  level:'Junior',    color:'blue',   av:'AH', clients:['CL-008'] },
];

const clients = [
  { id:'CL-001', name:'Nour Fashion',    industry:'Fashion & Retail',  status:'Active',     budget:35000, start:'2024-01-15', assigned:['hassan'], satisfaction:'Satisfied',
    platforms:[
      { name:'Meta',       objectives:['Leads','Brand Awareness'], targetResults:400, targetSpend:20000, actualSpend:18450, actualResults:312 },
      { name:'TikTok',     objectives:['Conversions'],             targetResults:150, targetSpend:8000,  actualSpend:7200,  actualResults:130 },
    ]},
  { id:'CL-002', name:'Gulf Auto Group', industry:'Automotive',         status:'Active',     budget:55000, start:'2023-11-01', assigned:['hassan'], satisfaction:'Satisfied',
    platforms:[
      { name:'Google Ads', objectives:['Leads'],             targetResults:250, targetSpend:30000, actualSpend:28900, actualResults:228 },
      { name:'Meta',       objectives:['Messages','Leads'],  targetResults:300, targetSpend:15000, actualSpend:14200, actualResults:285 },
    ]},
  { id:'CL-003', name:'MedPlus Clinics', industry:'Healthcare',         status:'Active',     budget:28000, start:'2024-03-01', assigned:['dalia'],  satisfaction:'Satisfied',
    platforms:[
      { name:'Google Ads', objectives:['Leads'], targetResults:180, targetSpend:22000, actualSpend:20100, actualResults:165 },
      { name:'Meta',       objectives:['Leads'], targetResults:100, targetSpend:6000,  actualSpend:5800,  actualResults:88  },
    ]},
  { id:'CL-004', name:'Bloom Academy',   industry:'Education',          status:'Active',     budget:22000, start:'2024-05-10', assigned:['engy'],   satisfaction:'Neutral',
    platforms:[
      { name:'Meta',     objectives:['Leads','App Installs'], targetResults:200, targetSpend:14000, actualSpend:12500, actualResults:172 },
      { name:'Snapchat', objectives:['Leads'],                targetResults:80,  targetSpend:6000,  actualSpend:5100,  actualResults:64  },
    ]},
  { id:'CL-005', name:'Riyadh Eats',     industry:'Food & Beverage',    status:'Active',     budget:18000, start:'2024-02-20', assigned:['hassan'], satisfaction:'Satisfied',
    platforms:[
      { name:'Meta',   objectives:['Messages'],    targetResults:500, targetSpend:10000, actualSpend:9800, actualResults:478 },
      { name:'TikTok', objectives:['Conversions'], targetResults:120, targetSpend:6000,  actualSpend:5700, actualResults:104 },
    ]},
  { id:'CL-006', name:'LuxStay Hotels',  industry:'Hospitality',        status:'Paused',     budget:40000, start:'2024-01-05', assigned:['dalia'],  satisfaction:'Neutral',
    platforms:[
      { name:'Google Ads', objectives:['Conversions'],             targetResults:90,  targetSpend:28000, actualSpend:0, actualResults:0 },
      { name:'Meta',       objectives:['Leads','Brand Awareness'], targetResults:120, targetSpend:10000, actualSpend:0, actualResults:0 },
    ]},
  { id:'CL-007', name:'KidsZone Toys',   industry:'Retail',             status:'Onboarding', budget:14000, start:'2025-06-01', assigned:['engy'],   satisfaction:'Neutral',
    platforms:[
      { name:'Meta',   objectives:['Conversions'],         targetResults:150, targetSpend:9000, actualSpend:3200, actualResults:48 },
      { name:'TikTok', objectives:['Conversions','Reach'], targetResults:80,  targetSpend:4000, actualSpend:1400, actualResults:18 },
    ]},
  { id:'CL-008', name:'TechSpark SA',    industry:'Technology',         status:'Active',     budget:35000, start:'2024-09-01', assigned:['ahmed'],  satisfaction:'Unsatisfied',
    platforms:[
      { name:'Google Ads', objectives:['Leads'],                   targetResults:200, targetSpend:20000, actualSpend:17800, actualResults:162 },
      { name:'LinkedIn',   objectives:['Leads','Brand Awareness'], targetResults:60,  targetSpend:10000, actualSpend:8900,  actualResults:44  },
    ]},
];

/* ops scores: keyed by memberId → clientId → array[6] of 1-5 scores */
const opsScores = {
  hassan: { 'CL-001':[5,4,5,4,4,3], 'CL-002':[5,5,4,5,4,4], 'CL-005':[4,4,5,4,3,3] },
  dalia:  { 'CL-003':[5,5,5,4,5,4], 'CL-006':[3,3,4,3,3,2] },
  engy:   { 'CL-004':[4,4,4,3,3,3], 'CL-007':[3,3,4,3,2,2] },
  ahmed:  { 'CL-008':[3,4,3,3,2,3] },
};

/* manager notes: keyed by "memberId-YYYY-MM" */
const managerNotes = {};

/* historical KPI data for compare feature */
const kpiHistory = {
  hassan: { '2025-04':82, '2025-05':85, '2025-06':88 },
  dalia:  { '2025-04':80, '2025-05':83, '2025-06':85 },
  engy:   { '2025-04':72, '2025-05':76, '2025-06':79 },
  ahmed:  { '2025-04':65, '2025-05':69, '2025-06':73 },
};

let _clientCounter = 9;

/* ══════════════════════════════════════════════════════════════
   4. FORMATTERS & HELPERS
══════════════════════════════════════════════════════════════ */
const fmt   = n  => Number(n || 0).toLocaleString('en-SA');
const fmtS  = n  => `${fmt(n)} ${APP.sym}`;
const pct   = n  => `${Math.round(n || 0)}%`;
const pctF  = (n, d=1) => `${Number(n || 0).toFixed(d)}%`;
const mkey  = (m, y) => `${y}-${String(m).padStart(2, '0')}`;

function achCls(rate) {
  if (rate >= 0.90) return 'ok';
  if (rate >= 0.70) return 'warn';
  return 'bad';
}

function achBadgeHTML(rate, label) {
  const c = achCls(rate);
  return `<span class="ach-badge ach-${c}">${pctF(rate * 100)} ${label}</span>`;
}

/* Platform performance badge — Best / Bad / neutral */
function platPerfBadge(rate) {
  if (rate >= 0.90) {
    return `<span class="perf-badge perf-best">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      Best Performance
    </span>`;
  }
  if (rate < 0.70 && rate > 0) {
    return `<span class="perf-badge perf-risk">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      Underperforming
    </span>`;
  }
  return '';
}

function statusBadge(s) {
  const map = { Active:'badge-active', Paused:'badge-paused', Onboarding:'badge-onboard' };
  return s ? `<span class="badge ${map[s] || 'badge-neut'}">${s}</span>` : `<span class="muted">—</span>`;
}

function satBadge(s) {
  const map = { Satisfied:'badge-sat', Neutral:'badge-neut', Unsatisfied:'badge-unsat' };
  return s ? `<span class="badge ${map[s] || 'badge-neut'}">${s}</span>` : `<span class="muted">—</span>`;
}

function avEl(color, text, extraClass='') {
  return `<div class="av${extraClass} av-${color}">${text}</div>`;
}

/* DOM helpers */
function $id(id)        { return document.getElementById(id); }
function setHTML(id, h) { const el=$id(id); if(el) el.innerHTML=h; }
function setTxt(id, t)  { const el=$id(id); if(el) el.textContent=t; }
function getVal(id)     { return ($id(id)?.value || ''); }
function setVal(id, v)  { const el=$id(id); if(el) el.value=v; }

/* ══════════════════════════════════════════════════════════════
   5. KPI ENGINE
══════════════════════════════════════════════════════════════ */
function levelAdjust(rawRate, level) {
  const cfg = LEVEL_CFG[level] || LEVEL_CFG.Senior;
  return Math.min(rawRate / cfg.fullAt, 1.0);
}

function calcKpi(memberId) {
  const m  = members.find(x => x.id === memberId);
  const mc = clients.filter(c => m.clients.includes(c.id));

  let totalTS = 0;
  mc.forEach(c => c.platforms.forEach(p => { totalTS += p.targetSpend; }));

  let weightedScore = 0;
  const breakdown   = [];

  mc.forEach(c => {
    let cTS=0, cTR=0, cAR=0;
    c.platforms.forEach(p => { cTS += p.targetSpend; cTR += p.targetResults; cAR += p.actualResults; });
    const weight  = totalTS > 0 ? cTS / totalTS : 0;
    const rawRate = cTR > 0 ? cAR / cTR : 0;
    const adjRate = levelAdjust(rawRate, m.level);
    const contrib = weight * adjRate * 70;
    weightedScore += weight * adjRate;
    breakdown.push({ client: c, cTS, cTR, cAR, weight, rawRate, adjRate, contrib });
  });

  const sectionA = Math.round(weightedScore * 70);

  let opsT=0, opsC=0;
  const sc = opsScores[memberId] || {};
  m.clients.forEach(cid => {
    if (sc[cid]) sc[cid].forEach(v => { opsT += v; opsC++; });
  });
  const avgOps   = opsC > 0 ? opsT / opsC / 5 : 0;
  const sectionB = Math.round(avgOps * 100 * 0.3);

  return { sectionA, sectionB, total: Math.min(sectionA + sectionB, 100), breakdown, avgOps };
}

/* ══════════════════════════════════════════════════════════════
   6. NAVIGATION
══════════════════════════════════════════════════════════════ */
const PAGE_TITLES = {
  dashboard:    'Overview',
  clients:      'Clients',
  kpi:          'Team KPIs',
  team:         'Team Dashboard',
  integrations: 'Integrations',
};

function nav(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const pg = $id(`page-${pageId}`);
  if (pg) pg.classList.add('active');

  document.querySelectorAll(`.nav-item[data-page="${pageId}"]`)
    .forEach(n => n.classList.add('active'));

  setTxt('topbar-title', PAGE_TITLES[pageId] || pageId);

  if (pageId === 'dashboard')    { renderDashboard();    setTimeout(initDashboardCharts, 60); }
  if (pageId === 'clients')      { renderClientTable(); }
  if (pageId === 'kpi')          { renderKpiCards(); }
  if (pageId === 'team')         { renderTeamMetrics(); setTimeout(initTeamCharts, 60); }
}

/* ══════════════════════════════════════════════════════════════
   7. FILTER (global month/year)
══════════════════════════════════════════════════════════════ */
function applyFilter() {
  state.month = parseInt(getVal('filter-month'), 10);
  state.year  = parseInt(getVal('filter-year'),  10);
  setTxt('period-badge', `${MONTHS[state.month - 1]} ${state.year}`);
  const active = document.querySelector('.page.active');
  if (active) nav(active.id.replace('page-', ''));
}

/* ══════════════════════════════════════════════════════════════
   8. DASHBOARD
══════════════════════════════════════════════════════════════ */
function renderDashboard() {
  renderMetricCards();
  renderInsights();
  renderSpendBars();
  renderTeamKpiMini();
  renderCompare();
}

function renderMetricCards() {
  const totalBudget = clients.reduce((s, c) => s + c.budget, 0);
  setHTML('mc-budget',     fmtS(totalBudget));
  setHTML('mc-budget-sub', `SAR across ${clients.length} clients`);

  const totTS = clients.reduce((s,c)=>s+c.platforms.reduce((ss,p)=>ss+p.targetSpend,0),0);
  const totAS = clients.reduce((s,c)=>s+c.platforms.reduce((ss,p)=>ss+p.actualSpend,0),0);
  const sRate = totTS > 0 ? totAS / totTS : 0;
  setHTML('mc-spend', fmtS(totAS));
  const sb = $id('spend-ach-badge');
  if (sb) { sb.className=`ach-badge ach-${achCls(sRate)}`; sb.textContent=`${pctF(sRate*100)} utilized`; }

  const totTR = clients.reduce((s,c)=>s+c.platforms.reduce((ss,p)=>ss+p.targetResults,0),0);
  const totAR = clients.reduce((s,c)=>s+c.platforms.reduce((ss,p)=>ss+p.actualResults,0),0);
  const rRate = totTR > 0 ? totAR / totTR : 0;
  setHTML('mc-results', fmt(totAR));
  const rb = $id('results-ach-badge');
  if (rb) { rb.className=`ach-badge ach-${achCls(rRate)}`; rb.textContent=`${pctF(rRate*100)} of ${fmt(totTR)} target`; }

  const avg = Math.round(members.reduce((s,m)=>s+calcKpi(m.id).total,0)/members.length);
  setHTML('mc-kpi', pct(avg));
  setHTML('avg-kpi-team', pct(avg));
}

function renderInsights() {
  const top=[], risk=[];
  clients.forEach(c => {
    const tR = c.platforms.reduce((s,p)=>s+p.targetResults,0);
    const aR = c.platforms.reduce((s,p)=>s+p.actualResults,0);
    const r  = tR > 0 ? aR/tR : 0;
    if (r >= 0.90) top.push({name:c.name, r});
    if (r < 0.70 && c.status==='Active') risk.push({name:c.name, r});
  });

  setHTML('insight-top-body', top.length
    ? top.map(x=>`<div class="insight-chip chip-ok">↑ ${x.name} — ${pctF(x.r*100)}</div>`).join('')
    : `<div class="insight-empty">No clients at ≥90% yet this month</div>`);

  setHTML('insight-risk-body', risk.length
    ? risk.map(x=>`<div class="insight-chip chip-bad">⚠ ${x.name} — ${pctF(x.r*100)}</div>`).join('')
    : `<div class="insight-empty">No underperforming accounts — great!</div>`);

  setHTML('insight-workload-body', members.map(m => {
    const mc     = clients.filter(c => m.clients.includes(c.id));
    const active = mc.filter(c => c.status==='Active').length;
    const other  = mc.length - active;
    return `<div class="workload-row">
      ${avEl(m.color, m.av, '-sm')}
      <div class="wl-name">${m.name}</div>
      <span class="badge badge-active">${active} active</span>
      ${other ? `<span class="badge badge-neut">${other} other</span>` : ''}
    </div>`;
  }).join(''));
}

function renderSpendBars() {
  const el = $id('spend-bars'); if (!el) return;
  const rows = clients.map(c => ({
    name:   c.name,
    spend:  c.platforms.reduce((s,p)=>s+p.actualSpend,0),
    target: c.platforms.reduce((s,p)=>s+p.targetSpend,0),
  })).sort((a,b)=>b.spend-a.spend);
  const maxT = Math.max(...rows.map(r=>r.target), 1);
  el.innerHTML = rows.map(r => {
    const ach = r.target > 0 ? r.spend/r.target : 0;
    const w   = (r.spend/maxT*100).toFixed(1);
    return `<div class="sbar-row">
      <div class="sbar-lbl" title="${r.name}">${r.name.split(' ')[0]}</div>
      <div class="sbar-track"><div class="sbar-fill sbar-${achCls(ach)}" style="width:${w}%"></div></div>
      <div class="sbar-val">${fmtS(r.spend)}</div>
    </div>`;
  }).join('');
}

function renderTeamKpiMini() {
  const el = $id('team-kpi-mini'); if (!el) return;
  el.innerHTML = members.map(m => {
    const k = calcKpi(m.id);
    return `<div class="mini-kpi-item">
      <div class="mini-kpi-meta">
        <span class="mini-kpi-name">${m.name}</span>
        <span class="mini-kpi-level">${m.level}</span>
        <span class="mini-kpi-score" style="color:${MEMBER_COLORS[m.id]}">${pct(k.total)}</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill fill-${m.color}" style="width:${k.total}%"></div>
      </div>
    </div>`;
  }).join('');
}

/* ══════════════════════════════════════════════════════════════
   9. COMPARE VIEW
══════════════════════════════════════════════════════════════ */
function renderCompare() {
  const m1 = parseInt(getVal('cmp-m-a')||5, 10);
  const y1 = parseInt(getVal('cmp-y-a')||2025, 10);
  const m2 = parseInt(getVal('cmp-m-b')||6, 10);
  const y2 = parseInt(getVal('cmp-y-b')||2025, 10);
  const k1 = mkey(m1,y1), k2 = mkey(m2,y2);
  const l1 = `${MONTHS[m1-1]} ${y1}`, l2 = `${MONTHS[m2-1]} ${y2}`;

  const tblRows = members.map(m => {
    const v1  = kpiHistory[m.id]?.[k1] ?? calcKpi(m.id).total;
    const v2  = kpiHistory[m.id]?.[k2] ?? calcKpi(m.id).total;
    const d   = v2 - v1;
    const sym = d > 0 ? '↑' : d < 0 ? '↓' : '→';
    const cls = d > 0 ? 'ok-t' : d < 0 ? 'bad-t' : 'muted';
    return `<tr>
      <td>${avEl(m.color,m.av,'-sm')} <strong style="margin-left:6px">${m.name}</strong></td>
      <td style="text-align:center"><strong>${v1}%</strong></td>
      <td style="text-align:center"><strong>${v2}%</strong></td>
      <td style="text-align:center" class="${cls}"><strong>${sym} ${Math.abs(d)}%</strong></td>
    </tr>`;
  }).join('');

  setHTML('compare-table', `<table>
    <thead><tr>
      <th>Member</th>
      <th style="text-align:center">${l1}</th>
      <th style="text-align:center">${l2}</th>
      <th style="text-align:center">Change</th>
    </tr></thead>
    <tbody>${tblRows}</tbody>
  </table>`);

  destroyChart('cmp');
  const ctx = $id('cmpChart'); if (!ctx) return;
  charts.cmp = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: members.map(m=>m.name),
      datasets: [
        { label:l1, data:members.map(m=>kpiHistory[m.id]?.[k1]??calcKpi(m.id).total), backgroundColor:'rgba(127,119,221,0.75)', borderRadius:4, borderSkipped:false },
        { label:l2, data:members.map(m=>kpiHistory[m.id]?.[k2]??calcKpi(m.id).total), backgroundColor:'rgba(29,158,117,0.75)',  borderRadius:4, borderSkipped:false },
      ]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ labels:{ color:'#888780', font:{size:11} } } },
      scales:{ y:{ min:0, max:100, ticks:{callback:v=>v+'%',color:'#888780'}, grid:{color:'rgba(136,135,128,0.1)'} }, x:{ticks:{color:'#888780'},grid:{display:false}} }
    }
  });
}

/* ══════════════════════════════════════════════════════════════
   10. CLIENT TABLE
══════════════════════════════════════════════════════════════ */
function renderClientTable() {
  const tbody = $id('clients-tbody'); if (!tbody) return;

  // Inline SVGs for action buttons — fully reliable, no broken boxes
  const SVG_VIEW   = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  const SVG_EDIT   = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
  const SVG_DELETE = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`;

  tbody.innerHTML = clients.map(c => {
    const aNames = c.assigned.map(id => members.find(m=>m.id===id)?.name||id).join(', ');
    const tR = c.platforms.reduce((s,p)=>s+p.targetResults,0);
    const aR = c.platforms.reduce((s,p)=>s+p.actualResults,0);
    const r  = tR > 0 ? aR/tR : 0;
    const achB = tR > 0 ? achBadgeHTML(r,'achieved') : '';
    return `<tr data-cid="${c.id}">
      <td>
        <span class="client-link" data-cid="${c.id}">${c.name}</span>
        ${achB}
      </td>
      <td class="muted">${c.industry || '—'}</td>
      <td>${statusBadge(c.status)}</td>
      <td><strong>${fmt(c.budget)}</strong> <span class="muted" style="font-size:11px">${APP.sym}</span></td>
      <td class="muted">${c.start || '—'}</td>
      <td>${aNames.split(', ').map(n=>`<span class="chip">${n}</span>`).join('')}</td>
      <td>${satBadge(c.satisfaction)}</td>
      <td>
        <div class="action-btns">
          <button class="act-btn" data-act="view" data-cid="${c.id}" title="View Profile">${SVG_VIEW}</button>
          <button class="act-btn" data-act="edit" data-cid="${c.id}" title="Quick Edit">${SVG_EDIT}</button>
          <button class="act-btn act-danger" data-act="del" data-cid="${c.id}" title="Delete Client">${SVG_DELETE}</button>
        </div>
      </td>
    </tr>`;
  }).join('');

  /* Single delegated listener — fires for both old and new clients */
  tbody.onclick = function(e) {
    const link = e.target.closest('.client-link[data-cid]');
    if (link) { openClientDrawer(link.dataset.cid); return; }
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const id  = btn.dataset.cid;
    const act = btn.dataset.act;
    if (act === 'view') openClientDrawer(id);
    if (act === 'edit') openEditClientModal(id);
    if (act === 'del')  deleteClient(id);
  };
}

/* ══════════════════════════════════════════════════════════════
   11. CLIENT DRAWER
══════════════════════════════════════════════════════════════ */
let _activeClientId = null;

/* Temporary edits buffer — holds unsaved user changes */
let _editBuffer = {};

function openClientDrawer(clientId) {
  if (!clientId) return;
  _activeClientId = clientId;
  _editBuffer = {};

  const c = clients.find(x=>x.id===clientId); if (!c) return;
  const aNames = c.assigned.map(id=>members.find(m=>m.id===id)?.name||id).join(', ');
  setTxt('drawer-title', c.name);
  setTxt('drawer-sub',  `${c.industry||''} · ${c.id} · Assigned: ${aNames}`);
  setHTML('drawer-body', buildDrawerBody(c));

  const ov = $id('client-overlay');
  if (ov) { ov.classList.add('open'); ov.setAttribute('aria-hidden','false'); }
}

function buildDrawerBody(c) {
  /* Aggregated summary across all platforms */
  const tR = c.platforms.reduce((s,p)=>s+p.targetResults,0);
  const aR = c.platforms.reduce((s,p)=>s+p.actualResults,0);
  const tS = c.platforms.reduce((s,p)=>s+p.targetSpend,0);
  const aS = c.platforms.reduce((s,p)=>s+p.actualSpend,0);
  const rR = tR>0?aR/tR:0, sR = tS>0?aS/tS:0;

  const summary = `
  <div>
    <div class="section-label mb-1" style="margin-bottom:.5rem">Aggregated Summary — All Platforms</div>
    <div class="summary-grid mb-2">
      <div class="sum-card"><div class="sum-label">Target Results</div><div class="sum-val">${fmt(tR)}</div></div>
      <div class="sum-card"><div class="sum-label">Actual Results</div><div class="sum-val ${achCls(rR)}-t">${fmt(aR)}</div><div class="sum-sub">${achBadgeHTML(rR,'achieved')}</div></div>
      <div class="sum-card"><div class="sum-label">Target Spend</div><div class="sum-val">${fmtS(tS)}</div></div>
      <div class="sum-card"><div class="sum-label">Actual Spend</div><div class="sum-val ${achCls(sR)}-t">${fmtS(aS)}</div><div class="sum-sub">${achBadgeHTML(sR,'utilized')}</div></div>
    </div>
    <div class="sum-bars">
      <div class="sum-bar-row">
        <span class="sum-bar-lbl">Results</span>
        <div class="sbar-track" style="flex:1"><div class="sbar-fill sbar-${achCls(rR)}" style="width:${Math.min(rR*100,100)}%"></div></div>
        <span class="sum-bar-val">${fmt(aR)} / ${fmt(tR)}</span>
      </div>
      <div class="sum-bar-row">
        <span class="sum-bar-lbl">Spend ${APP.sym}</span>
        <div class="sbar-track" style="flex:1"><div class="sbar-fill sbar-${achCls(sR)}" style="width:${Math.min(sR*100,100)}%"></div></div>
        <span class="sum-bar-val">${fmtS(aS)} / ${fmtS(tS)}</span>
      </div>
    </div>
  </div>
  <hr class="divider" />`;

  /* Platform cards */
  const platCards = c.platforms.map((p, pIdx) => {
    const achR = p.targetResults>0 ? p.actualResults/p.targetResults : 0;
    const achS = p.targetSpend>0   ? p.actualSpend/p.targetSpend     : 0;
    const overallRate = (achR + achS) / 2;
    const perfBadge = platPerfBadge(overallRate);
    const uid = `obj-${c.id}-${pIdx}`;

    const tags = p.objectives.map((o,i)=>
      `<span class="obj-tag">${o}<span class="obj-remove" onclick="removeObj('${c.id}',${pIdx},${i})">×</span></span>`
    ).join('');

    const suggs = SUGGESTED_OBJ.filter(s=>!p.objectives.includes(s)).slice(0,6)
      .map(s=>`<span class="obj-sugg" onclick="addObjSugg('${c.id}',${pIdx},'${s}')">${s}</span>`).join('');

    return `
    <div class="plat-card" id="plat-${c.id}-${pIdx}">
      <div class="plat-hdr">
        <div>
          <div class="plat-name">${p.name} ${perfBadge}</div>
          <div class="muted" style="font-size:11px;margin-top:2px">${p.objectives.join(', ')||'No objectives'}</div>
        </div>
        <button class="act-btn act-danger" onclick="removePlatform('${c.id}',${pIdx})" title="Remove platform" style="width:28px;height:28px;flex-shrink:0">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
        </button>
      </div>

      <!-- Editable Objectives -->
      <div class="obj-editor">
        <div class="obj-editor-label">Campaign Objectives</div>
        <div class="obj-tags">${tags||'<span class="muted" style="font-size:11px">None added yet</span>'}</div>
        <div class="obj-input-row">
          <input class="obj-input" id="${uid}-in" placeholder="Type objective + Enter"
            onkeydown="if(event.key==='Enter'){event.preventDefault();addObjInput('${c.id}',${pIdx},'${uid}');}">
          <button class="btn btn-xs btn-primary" onclick="addObjInput('${c.id}',${pIdx},'${uid}')">+</button>
        </div>
        <div class="obj-suggestions">${suggs}</div>
      </div>

      <!-- Editable Metric Inputs -->
      <div class="plat-grid">
        <div class="plat-metric">
          <div class="pm-label">Target Results</div>
          <input class="pm-input" type="number" value="${p.targetResults}" min="0"
            onchange="bufferField('${c.id}',${pIdx},'targetResults',this.value)">
        </div>
        <div class="plat-metric">
          <div class="pm-label">Actual Results</div>
          <input class="pm-input ${achCls(achR)}-t" type="number" value="${p.actualResults}" min="0"
            onchange="bufferField('${c.id}',${pIdx},'actualResults',this.value)">
        </div>
        <div class="plat-metric">
          <div class="pm-label">Target Spend (${APP.sym})</div>
          <input class="pm-input" type="number" value="${p.targetSpend}" min="0"
            onchange="bufferField('${c.id}',${pIdx},'targetSpend',this.value)">
        </div>
        <div class="plat-metric">
          <div class="pm-label">Actual Spend (${APP.sym})</div>
          <input class="pm-input ${achCls(achS)}-t" type="number" value="${p.actualSpend}" min="0"
            onchange="bufferField('${c.id}',${pIdx},'actualSpend',this.value)">
        </div>
      </div>

      <!-- Visual Progress Bars -->
      <div class="plat-bars">
        <div class="sbar-row">
          <div class="sbar-lbl">Results</div>
          <div class="sbar-track"><div class="sbar-fill sbar-${achCls(achR)}" style="width:${Math.min(achR*100,100)}%"></div></div>
          <div class="sbar-val">${fmt(p.actualResults)} / ${fmt(p.targetResults)}</div>
        </div>
        <div class="sbar-row">
          <div class="sbar-lbl">Spend ${APP.sym}</div>
          <div class="sbar-track"><div class="sbar-fill sbar-${achCls(achS)}" style="width:${Math.min(achS*100,100)}%"></div></div>
          <div class="sbar-val">${fmtS(p.actualSpend)} / ${fmtS(p.targetSpend)}</div>
        </div>
      </div>
    </div>`;
  }).join('');

  return summary + `
  <div>
    <div class="section-label mb-1" style="margin-bottom:.5rem">Platform Performance
      <span class="muted" style="font-weight:400;text-transform:none;font-size:11px"> — edit fields then click Save</span>
    </div>
    ${platCards}
    <button class="btn btn-outline" style="width:100%;justify-content:center;margin-top:.75rem" onclick="addPlatform('${c.id}')">
      + Add Platform
    </button>
  </div>
  <button class="btn btn-save-drawer" onclick="saveDrawerChanges('${c.id}')">
    Save Changes & Recalculate KPIs
  </button>`;
}

/* Buffer field changes without committing until Save is pressed */
function bufferField(cid, pIdx, field, value) {
  const key = `${cid}-${pIdx}-${field}`;
  _editBuffer[key] = parseFloat(value) || 0;
}

/* Commit buffered edits → live-refresh everything */
function saveDrawerChanges(cid) {
  const c = clients.find(x=>x.id===cid); if (!c) return;
  Object.entries(_editBuffer).forEach(([key, val]) => {
    const parts = key.split('-');
    const pIdx  = parseInt(parts[parts.length-2], 10);
    const field = parts[parts.length-1];
    if (!isNaN(pIdx) && c.platforms[pIdx]) c.platforms[pIdx][field] = val;
  });
  _editBuffer = {};

  /* Live refresh */
  renderMetricCards();
  renderSpendBars();
  renderTeamKpiMini();
  renderInsights();
  renderKpiCards();
  if (document.getElementById('page-team')?.classList.contains('active')) renderTeamMetrics();
  refreshTeamChart();

  /* Re-render drawer with updated data */
  openClientDrawer(cid);

  /* Flash confirmation */
  const el = $id('drawer-body');
  if (el) {
    const flash = document.createElement('div');
    flash.className = 'response-ok';
    flash.style.cssText = 'margin-top:8px;font-size:12px';
    flash.textContent = '✓ Changes saved and KPIs recalculated.';
    el.appendChild(flash);
    setTimeout(() => flash.remove(), 3000);
  }
}

function closeClientDrawer(e, force) {
  const ov = $id('client-overlay');
  if (!ov) return;
  if (force || e?.target === ov) {
    ov.classList.remove('open');
    ov.setAttribute('aria-hidden','true');
    _activeClientId = null;
    _editBuffer = {};
  }
}

/* ── Platform CRUD ── */
function addPlatform(cid) {
  const c = clients.find(x=>x.id===cid); if (!c) return;
  const name = prompt('Platform name (e.g. Meta, Google Ads, TikTok, Snapchat):','');
  if (!name?.trim()) return;
  c.platforms.push({ name:name.trim(), objectives:[], targetResults:0, targetSpend:0, actualSpend:0, actualResults:0 });
  openClientDrawer(cid);
}

function removePlatform(cid, pIdx) {
  const c = clients.find(x=>x.id===cid); if (!c) return;
  if (!confirm(`Remove platform "${c.platforms[pIdx].name}"?`)) return;
  c.platforms.splice(pIdx, 1);
  openClientDrawer(cid);
}

/* ── Objective CRUD ── */
function removeObj(cid, pIdx, oIdx) {
  const c = clients.find(x=>x.id===cid); if (!c) return;
  c.platforms[pIdx].objectives.splice(oIdx, 1);
  openClientDrawer(cid);
}

function addObjSugg(cid, pIdx, val) {
  const c = clients.find(x=>x.id===cid); if (!c) return;
  if (!c.platforms[pIdx].objectives.includes(val)) c.platforms[pIdx].objectives.push(val);
  openClientDrawer(cid);
}

function addObjInput(cid, pIdx, uid) {
  const inp = $id(`${uid}-in`); if (!inp) return;
  const val = inp.value.trim(); if (!val) return;
  const c   = clients.find(x=>x.id===cid); if (!c) return;
  if (!c.platforms[pIdx].objectives.includes(val)) c.platforms[pIdx].objectives.push(val);
  inp.value = '';
  openClientDrawer(cid);
}

/* Drawer edit/delete shortcuts */
function editActiveClient()   { if (_activeClientId) { closeClientDrawer(null,true); openEditClientModal(_activeClientId); } }
function deleteActiveClient() { if (_activeClientId) deleteClient(_activeClientId); }

/* ══════════════════════════════════════════════════════════════
   12. CLIENT CRUD
══════════════════════════════════════════════════════════════ */
let _editingId = null;

function openNewClientModal() {
  _editingId = null;
  setTxt('client-form-title', 'New Client');
  const f = $id('client-form'); if (f) f.reset();
  setVal('cf-eid', '');
  const ov = $id('client-form-overlay'); if (ov) ov.classList.add('open');
}

function openEditClientModal(cid) {
  _editingId = cid;
  const c = clients.find(x=>x.id===cid); if (!c) return;
  setTxt('client-form-title', 'Edit Client');
  setVal('cf-eid',      c.id);
  setVal('cf-name',     c.name);
  setVal('cf-industry', c.industry || '');
  setVal('cf-status',   c.status   || '');
  setVal('cf-budget',   c.budget);
  setVal('cf-start',    c.start    || '');
  setVal('cf-assigned', c.assigned.join(', '));
  setVal('cf-sat',      c.satisfaction || '');
  const ov = $id('client-form-overlay'); if (ov) ov.classList.add('open');
}

function saveClientForm() {
  const name     = getVal('cf-name').trim();
  const industry = getVal('cf-industry').trim();
  const status   = getVal('cf-status');
  const budget   = parseFloat(getVal('cf-budget')) || 0;
  const start    = getVal('cf-start');
  const sat      = getVal('cf-sat');
  const assigned = getVal('cf-assigned').split(',').map(s=>s.trim()).filter(Boolean);

  if (!name) { alert('Client name is required.'); return; }

  if (_editingId) {
    const c = clients.find(x=>x.id===_editingId); if (!c) return;
    Object.assign(c, { name, industry, status:status||null, budget, start, assigned, satisfaction:sat||null });
  } else {
    const newId = `CL-${String(_clientCounter++).padStart(3,'0')}`;
    clients.push({ id:newId, name, industry, status:status||null, budget, start, assigned, satisfaction:sat||null, platforms:[] });
    assigned.forEach(aid => {
      const m = members.find(x=>x.id===aid);
      if (m && !m.clients.includes(newId)) m.clients.push(newId);
    });
  }

  closeClientForm();
  renderClientTable();
  renderKpiCards();
  renderMetricCards();
}

function closeClientForm() {
  const ov = $id('client-form-overlay'); if (ov) ov.classList.remove('open');
}

function deleteClient(cid) {
  const c = clients.find(x=>x.id===cid); if (!c) return;
  if (!confirm(`Delete client "${c.name}"?\nThis action cannot be undone.`)) return;
  clients.splice(clients.findIndex(x=>x.id===cid), 1);
  members.forEach(m => { m.clients = m.clients.filter(id=>id!==cid); });
  closeClientDrawer(null, true);
  renderClientTable();
  renderKpiCards();
  renderMetricCards();
}

/* ══════════════════════════════════════════════════════════════
   13. KPI CARDS
══════════════════════════════════════════════════════════════ */
function renderKpiCards() {
  const grid = $id('kpi-cards-grid'); if (!grid) return;
  grid.innerHTML = members.map(m => {
    const k   = calcKpi(m.id);
    const col = MEMBER_COLORS[m.id] || '#378ADD';
    const lvlCls = m.level==='Senior'?'lvl-senior':m.level==='Mid-Level'?'lvl-mid':'lvl-junior';
    return `
    <div class="kpi-card" onclick="openKpiModal('${m.id}')" role="button" tabindex="0"
         onkeydown="if(event.key==='Enter')openKpiModal('${m.id}')">
      <div class="kpi-card-hdr">
        ${avEl(m.color, m.av)}
        <div class="kpi-card-info">
          <div class="kpi-card-name">${m.name}</div>
          <div class="kpi-card-lvl">${m.level}</div>
        </div>
        <span class="lvl-pill ${lvlCls}">${m.level}</span>
      </div>
      <div class="kpi-big" style="color:${col}">${k.total}<span class="kpi-big-unit">%</span></div>
      <div class="progress-track" style="margin-bottom:8px">
        <div class="progress-fill fill-${m.color}" style="width:${k.total}%"></div>
      </div>
      <div class="kpi-split">
        <span>Section A (Results): ${pct(k.sectionA)}</span>
        <span>Section B (Ops): ${pct(k.sectionB)}</span>
      </div>
      <div class="kpi-chips">
        ${clients.filter(c=>m.clients.includes(c.id)).map(c=>`<span class="chip">${c.name}</span>`).join('')}
      </div>
    </div>`;
  }).join('');
}

/* ══════════════════════════════════════════════════════════════
   14. KPI MODAL — Editable Section B + Manager Notes
══════════════════════════════════════════════════════════════ */
let _openMemberId = null;

function openKpiModal(memberId) {
  _openMemberId = memberId;
  _renderKpiModal(memberId);
  const ov = $id('kpi-overlay'); if (ov) ov.classList.add('open');
}

function _renderKpiModal(memberId) {
  const m   = members.find(x=>x.id===memberId);
  const k   = calcKpi(memberId);
  const col = MEMBER_COLORS[memberId] || '#378ADD';
  const cfg = LEVEL_CFG[m.level];
  const noteKey = `${memberId}-${mkey(state.month, state.year)}`;
  const note    = managerNotes[noteKey] || '';

  setTxt('kpi-modal-title', `${m.name} — Individual Performance`);

  /* Section A table */
  const aRows = k.breakdown.map(({client:c,cTS,cTR,cAR,weight,rawRate,adjRate,contrib}) => {
    const cls = achCls(adjRate);
    return `<tr>
      <td><strong>${c.name}</strong></td>
      <td>${fmtS(cTS)}</td>
      <td>${pctF(weight*100,1)}</td>
      <td>${fmt(cAR)} / ${fmt(cTR)}</td>
      <td class="muted">${pctF(rawRate*100,1)}</td>
      <td class="${cls}-t"><strong>${pctF(adjRate*100,1)}</strong></td>
      <td>${contrib.toFixed(1)} pts</td>
    </tr>`;
  }).join('');

  /* Section B — aggregate star rows (bulk-set all clients) */
  const sc = opsScores[memberId] || {};
  const bRows = OPS_LABELS.map((label, i) => {
    let tot=0, cnt=0;
    m.clients.forEach(cid => { if(sc[cid]){ tot+=sc[cid][i]; cnt++; } });
    const avg = cnt > 0 ? tot/cnt : 0;
    const stars = [1,2,3,4,5].map(v =>
      `<button class="star-btn ${Math.round(avg)>=v?'on':''}" onclick="setOpsAll('${memberId}',${i},${v})" title="${v}/5">★</button>`
    ).join('');
    return `<div class="ops-row">
      <div class="ops-label">${label}</div>
      <div class="ops-stars">${stars}<span class="ops-avg">${avg.toFixed(1)}/5</span></div>
    </div>`;
  }).join('');

  /* Per-client granular ops scoring */
  const perClientOps = m.clients.map(cid => {
    const cl = clients.find(x=>x.id===cid); if (!cl) return '';
    return `<div class="per-client-ops">
      <div class="per-client-name">${cl.name}</div>
      ${OPS_LABELS.map((lbl,i)=>{
        const v = (sc[cid]||[])[i] || 0;
        const stars = [1,2,3,4,5].map(sv=>
          `<button class="star-btn star-sm ${v>=sv?'on':''}" onclick="setOpsClient('${memberId}','${cid}',${i},${sv})" title="${lbl} ${sv}/5">★</button>`
        ).join('');
        return `<div class="pc-row">
          <span class="pc-lbl muted">${lbl}</span>
          <span style="display:flex;align-items:center;gap:1px">${stars}<span class="muted" style="font-size:10px;margin-left:4px">${v}/5</span></span>
        </div>`;
      }).join('')}
    </div>`;
  }).join('');

  setHTML('kpi-modal-body', `
    <!-- Level Banner -->
    <div class="lvl-banner ${cfg.bannerCls}">
      <strong>${m.level} — ${cfg.label}</strong>
      Threshold: ${Math.round(cfg.fullAt*100)}% of target = 100% of Section A points.
    </div>

    <!-- Score Summary -->
    <div class="grid-3 mb-2">
      <div class="metric-mini">
        <div class="sum-label">Total KPI Score</div>
        <div style="font-size:22px;font-weight:700;color:${col}">${pct(k.total)}</div>
      </div>
      <div class="metric-mini">
        <div class="sum-label">Section A — Results (70%)</div>
        <div style="font-size:22px;font-weight:700">${pct(k.sectionA)}</div>
        <div class="sum-sub">Spend-weighted, level-adjusted</div>
      </div>
      <div class="metric-mini">
        <div class="sum-label">Section B — Ops (30%)</div>
        <div style="font-size:22px;font-weight:700">${pct(k.sectionB)}</div>
        <div class="sum-sub">Manager-graded</div>
      </div>
    </div>
    <div class="progress-track mb-2" style="height:10px">
      <div class="progress-fill" style="width:${k.total}%;background:${col}"></div>
    </div>

    <!-- Section A Breakdown -->
    <div class="modal-section">Section A — Client Results & Spend
      <span class="sub">(70% weight · all spend in ${APP.sym})</span>
    </div>
    <div style="overflow-x:auto;margin-bottom:1rem">
      <table>
        <thead><tr>
          <th>Client</th><th>Target Spend</th><th>Weight</th>
          <th>Results Actual/Target</th><th>Raw Rate</th>
          <th>Adj. Rate (${m.level})</th><th>KPI Points</th>
        </tr></thead>
        <tbody>${aRows}</tbody>
      </table>
    </div>
    <div class="info-box mb-2">
      Formula: Adj. Rate = min(Actual ÷ Target ÷ ${cfg.fullAt}, 1.0) &nbsp;·&nbsp; Points = Weight × Adj. Rate × 70
    </div>

    <!-- Section B — Bulk Stars -->
    <div class="modal-section">Section B — Operational Matrix
      <span class="sub">(30% weight · click stars to grade · updates all clients)</span>
    </div>
    <div style="margin-bottom:1rem">${bRows}</div>
    <div class="info-box mb-2">Averages across all assigned clients. Use per-client scoring below for granular control.</div>

    <!-- Section B — Per-Client -->
    <div class="modal-section">Per-Client Ops Scoring</div>
    <div class="mb-2">${perClientOps}</div>

    <!-- Manager Notes -->
    <div class="modal-section">Manager's Monthly Evaluation Notes
      <span class="sub">(${MONTHS[state.month-1]} ${state.year} · auto-saves as you type)</span>
    </div>
    <textarea class="mgr-notes" id="mgr-notes-${memberId}"
      placeholder="Write evaluation notes for ${m.name} this month…"
      oninput="saveNote('${memberId}')">${note}</textarea>
    <div class="info-box mt-1">Notes are stored per month per member and persist throughout the session.</div>
  `);
}

function setOpsAll(memberId, idx, val) {
  const m = members.find(x=>x.id===memberId); if (!m) return;
  if (!opsScores[memberId]) opsScores[memberId] = {};
  m.clients.forEach(cid => {
    if (!opsScores[memberId][cid]) opsScores[memberId][cid] = [3,3,3,3,3,3];
    opsScores[memberId][cid][idx] = val;
  });
  _renderKpiModal(memberId);
  renderKpiCards();
  renderMetricCards();
  refreshTeamChart();
}

function setOpsClient(memberId, cid, idx, val) {
  if (!opsScores[memberId]) opsScores[memberId] = {};
  if (!opsScores[memberId][cid]) opsScores[memberId][cid] = [3,3,3,3,3,3];
  opsScores[memberId][cid][idx] = val;
  _renderKpiModal(memberId);
  renderKpiCards();
  renderMetricCards();
  refreshTeamChart();
}

function saveNote(memberId) {
  const key = `${memberId}-${mkey(state.month, state.year)}`;
  const el  = $id(`mgr-notes-${memberId}`);
  if (el) managerNotes[key] = el.value;
}

function closeKpiModal(e, force) {
  const ov = $id('kpi-overlay'); if (!ov) return;
  if (force || e?.target === ov) { ov.classList.remove('open'); _openMemberId = null; }
}

/* ══════════════════════════════════════════════════════════════
   15. TEAM DASHBOARD
══════════════════════════════════════════════════════════════ */
function renderTeamMetrics() {
  const totAS = clients.reduce((s,c)=>s+c.platforms.reduce((ss,p)=>ss+p.actualSpend,0),0);
  const totAR = clients.reduce((s,c)=>s+c.platforms.reduce((ss,p)=>ss+p.actualResults,0),0);
  const totTR = clients.reduce((s,c)=>s+c.platforms.reduce((ss,p)=>ss+p.targetResults,0),0);
  const avg   = Math.round(members.reduce((s,m)=>s+calcKpi(m.id).total,0)/members.length);
  const sat   = clients.filter(c=>c.satisfaction==='Satisfied').length;

  setHTML('team-spend',       fmtS(totAS));
  setHTML('team-results',     fmt(totAR));
  setHTML('team-results-sub', `vs ${fmt(totTR)} target`);
  setHTML('avg-kpi-team',     pct(avg));
  setHTML('team-sat',         `${sat} / ${clients.length}`);
}

/* ══════════════════════════════════════════════════════════════
   16. CHARTS
══════════════════════════════════════════════════════════════ */
const charts = {};

function destroyChart(k) { if(charts[k]){ charts[k].destroy(); delete charts[k]; } }

const GRID_COLOR = 'rgba(136,135,128,0.1)';
const TICK_COLOR = '#888780';

function chartScaleY(min, max) {
  return { min, max, ticks:{callback:v=>v+(max<=100?'%':''),color:TICK_COLOR}, grid:{color:GRID_COLOR} };
}
const SCALE_X = { ticks:{color:TICK_COLOR}, grid:{display:false} };

function initDashboardCharts() {
  destroyChart('trend');
  const ctx = $id('trendChart'); if (!ctx) return;
  charts.trend = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun'],
      datasets: [{
        label: `Total Spend (${APP.sym})`,
        data: [140000,155000,168000,180000,191000,194320],
        borderColor:'#378ADD', backgroundColor:'rgba(55,138,221,0.07)',
        fill:true, tension:0.4, pointRadius:5,
        pointBackgroundColor:'#378ADD', pointBorderColor:'#fff', pointBorderWidth:2,
      }]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false} },
      scales:{
        y:{ ticks:{callback:v=>`${(v/1000).toFixed(0)}k`,color:TICK_COLOR}, grid:{color:GRID_COLOR} },
        x: SCALE_X,
      }
    }
  });
}

function initTeamCharts() {
  destroyChart('team'); destroyChart('results'); destroyChart('growth');

  /* KPI bar chart */
  const tCtx = $id('teamChart');
  if (tCtx) {
    charts.team = new Chart(tCtx, {
      type:'bar',
      data:{
        labels: members.map(m=>m.name),
        datasets:[{
          label:'KPI %',
          data: members.map(m=>calcKpi(m.id).total),
          backgroundColor:['#7F77DD','#1D9E75','#D85A30','#378ADD'],
          borderRadius:6, borderSkipped:false
        }]
      },
      options:{
        responsive:true, maintainAspectRatio:false,
        plugins:{legend:{display:false}},
        scales:{ y:chartScaleY(0,100), x:SCALE_X }
      }
    });
  }

  /* Results doughnut */
  const rCtx = $id('resultsChart');
  if (rCtx) {
    const totR = clients.reduce((s,c)=>s+c.platforms.reduce((ss,p)=>ss+p.actualResults,0),0);
    const totT = clients.reduce((s,c)=>s+c.platforms.reduce((ss,p)=>ss+p.targetResults,0),0);
    charts.results = new Chart(rCtx, {
      type:'doughnut',
      data:{
        labels:['Achieved','Remaining'],
        datasets:[{ data:[totR, Math.max(totT-totR,0)], backgroundColor:['#1D9E75','rgba(136,135,128,0.15)'], borderWidth:0, hoverOffset:4 }]
      },
      options:{
        responsive:true, maintainAspectRatio:false, cutout:'72%',
        plugins:{ legend:{labels:{color:TICK_COLOR,font:{size:11},usePointStyle:true}} },
        layout:{padding:8}
      }
    });
  }

  /* Growth trend line */
  const gCtx = $id('growthChart');
  if (gCtx) {
    charts.growth = new Chart(gCtx, {
      type:'line',
      data:{
        labels:['Apr','May','Jun'],
        datasets:[
          { label:'Hassan', data:[82,85,88], borderColor:'#7F77DD', tension:0.4, pointRadius:5, pointBackgroundColor:'#7F77DD', pointBorderColor:'#fff', pointBorderWidth:2, borderDash:[] },
          { label:'Dalia',  data:[80,83,85], borderColor:'#1D9E75', tension:0.4, pointRadius:5, pointBackgroundColor:'#1D9E75', pointBorderColor:'#fff', pointBorderWidth:2, borderDash:[5,4] },
          { label:'Engy',   data:[72,76,79], borderColor:'#D85A30', tension:0.4, pointRadius:5, pointBackgroundColor:'#D85A30', pointBorderColor:'#fff', pointBorderWidth:2, borderDash:[2,3] },
          { label:'Ahmed',  data:[65,69,73], borderColor:'#378ADD', tension:0.4, pointRadius:5, pointBackgroundColor:'#378ADD', pointBorderColor:'#fff', pointBorderWidth:2, borderDash:[8,4] },
        ]
      },
      options:{
        responsive:true, maintainAspectRatio:false,
        plugins:{legend:{labels:{color:TICK_COLOR,font:{size:11},usePointStyle:true}}},
        scales:{ y:chartScaleY(60,100), x:SCALE_X }
      }
    });
  }
}

function refreshTeamChart() {
  if (!charts.team) return;
  charts.team.data.datasets[0].data = members.map(m=>calcKpi(m.id).total);
  charts.team.update();
}

/* ══════════════════════════════════════════════════════════════
   17. INTEGRATIONS
══════════════════════════════════════════════════════════════ */
let _tokenShown = false;
function toggleToken() {
  _tokenShown = !_tokenShown;
  setHTML('token-val', _tokenShown ? APP.token : 'sk_live_••••••••••••••••••••••••••••');
  setTxt('btn-token-tog', _tokenShown ? 'Hide' : 'Reveal');
}

function copyText(text, btnId) {
  navigator.clipboard.writeText(text).then(() => {
    const btn = $id(btnId); if (!btn) return;
    const orig = btn.textContent;
    btn.textContent = '✓ Copied!';
    setTimeout(() => { btn.textContent = orig; }, 2000);
  }).catch(() => alert('Copy failed — please copy manually.'));
}

function simulateWebhook() {
  const cid     = getVal('sim-client');
  const spend   = parseFloat(getVal('sim-spend'))   || 0;
  const results = parseInt(getVal('sim-results'), 10) || 0;
  const c = clients.find(x=>x.id===cid);
  if (c?.platforms[0]) { c.platforms[0].actualSpend = spend; c.platforms[0].actualResults = results; }
  setHTML('webhook-response', `<div class="response-ok">
    ✓ <div><strong>Payload received for ${c?.name||cid}</strong><br>
    Spend → ${fmtS(spend)}, Results → ${fmt(results)}. KPIs recalculated live.</div>
  </div>`);
  renderMetricCards();
  renderSpendBars();
  renderTeamKpiMini();
  renderInsights();
  renderKpiCards();
  refreshTeamChart();
}

/* ══════════════════════════════════════════════════════════════
   18. DARK MODE
══════════════════════════════════════════════════════════════ */
function toggleDark() {
  document.documentElement.classList.toggle('dark');
  const btn = $id('dark-btn');
  if (btn) btn.innerHTML = document.documentElement.classList.contains('dark')
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
}

/* ══════════════════════════════════════════════════════════════
   19. INIT
══════════════════════════════════════════════════════════════ */
function init() {
  /* Nav */
  document.querySelectorAll('.nav-item[data-page]').forEach(el => {
    el.addEventListener('click', () => nav(el.dataset.page));
  });

  /* Period badge */
  setTxt('period-badge', `${MONTHS[state.month - 1]} ${state.year}`);

  /* Initial render */
  renderDashboard();
  renderClientTable();
  renderKpiCards();
  setTimeout(initDashboardCharts, 60);
}

document.addEventListener('DOMContentLoaded', init);
