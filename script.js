/* ================================================================
   Performance Ocoda v2 — Agency CRM & KPI Management Platform
   script.js — Complete Production Logic
   All values in SAR ر.س
   ================================================================ */
'use strict';

/* ───────────────────────────────────────────────────────────────
   1. APP CONFIG
─────────────────────────────────────────────────────────────── */
const APP = {
  name: 'Performance Ocoda',
  currency: 'SAR',
  sym: 'ر.س',
  webhookEndpoint: 'https://api.performanceocoda.sa/webhooks/v1/metrics/inbound',
  apiToken: 'sk_live_PerfOcoda_9Kx7mQ2nBvR4tZ8wLpAJ3fNdY6SA',
};

const LEVEL_CONFIG = {
  Senior:      { fullAt: 1.00, label: 'Strict — 100% target required',   cls: 'lv-senior' },
  'Mid-Level': { fullAt: 0.90, label: 'Balanced — 90% = full score',     cls: 'lv-mid'    },
  Junior:      { fullAt: 0.80, label: 'Growth — 80% = full score',       cls: 'lv-junior' },
};

const OPS_LABELS = [
  'Ad Account Setup',
  'Tracking & Pixels Implementation',
  'Client Requirements Fulfillment',
  'Campaign Optimization',
  'Problem Solving & Creative Ideas',
  'AI Tools Utilization',
];

const SUGGESTED_OBJECTIVES = [
  'Leads','Conversions','Messages','App Installs',
  'Brand Awareness','Reach','Traffic','Engagement',
  'Video Views','Store Visits','Catalog Sales','Event Responses',
];

const MEMBER_COLORS = { hassan:'#7F77DD', dalia:'#1D9E75', engy:'#D85A30', ahmed:'#378ADD' };
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/* ───────────────────────────────────────────────────────────────
   2. DATA STORE  (reactive — all UI reads from here)
─────────────────────────────────────────────────────────────── */

// Global filter state
const state = {
  month: 6,   // 1-based
  year: 2025,
  compareMode: false,
  compareMonth: 5,
  compareYear: 2025,
};

const members = [
  { id:'hassan', name:'Hassan', level:'Senior',    color:'purple', av:'HS', clients:['CL-001','CL-002','CL-005'] },
  { id:'dalia',  name:'Dalia',  level:'Senior',    color:'teal',   av:'DA', clients:['CL-003','CL-006'] },
  { id:'engy',   name:'Engy',   level:'Mid-Level', color:'coral',  av:'EN', clients:['CL-004','CL-007'] },
  { id:'ahmed',  name:'Ahmed',  level:'Junior',    color:'blue',   av:'AH', clients:['CL-008'] },
];

// clients array — mutable (CRUD)
const clients = [
  { id:'CL-001', name:'Nour Fashion',    industry:'Fashion & Retail',  status:'Active',     budget:35000, start:'2024-01-15', assigned:['hassan'], satisfaction:'Satisfied',
    platforms:[
      { name:'Meta',       objectives:['Leads','Brand Awareness'], targetResults:400, targetSpend:20000, actualSpend:18450, actualResults:312 },
      { name:'TikTok',     objectives:['Conversions'],             targetResults:150, targetSpend:8000,  actualSpend:7200,  actualResults:130 },
    ]},
  { id:'CL-002', name:'Gulf Auto Group', industry:'Automotive',         status:'Active',     budget:55000, start:'2023-11-01', assigned:['hassan'], satisfaction:'Satisfied',
    platforms:[
      { name:'Google Ads', objectives:['Leads'],            targetResults:250, targetSpend:30000, actualSpend:28900, actualResults:228 },
      { name:'Meta',       objectives:['Messages','Leads'], targetResults:300, targetSpend:15000, actualSpend:14200, actualResults:285 },
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
      { name:'Meta',   objectives:['Conversions'],          targetResults:150, targetSpend:9000, actualSpend:3200, actualResults:48 },
      { name:'TikTok', objectives:['Conversions','Reach'],  targetResults:80,  targetSpend:4000, actualSpend:1400, actualResults:18 },
    ]},
  { id:'CL-008', name:'TechSpark SA',    industry:'Technology',         status:'Active',     budget:35000, start:'2024-09-01', assigned:['ahmed'],  satisfaction:'Unsatisfied',
    platforms:[
      { name:'Google Ads', objectives:['Leads'],                    targetResults:200, targetSpend:20000, actualSpend:17800, actualResults:162 },
      { name:'LinkedIn',   objectives:['Leads','Brand Awareness'],  targetResults:60,  targetSpend:10000, actualSpend:8900,  actualResults:44  },
    ]},
];

// Section B ops scores — fully editable via UI, keyed by memberId then clientId
const opsScores = {
  hassan: { 'CL-001':[5,4,5,4,4,3], 'CL-002':[5,5,4,5,4,4], 'CL-005':[4,4,5,4,3,3] },
  dalia:  { 'CL-003':[5,5,5,4,5,4], 'CL-006':[3,3,4,3,3,2] },
  engy:   { 'CL-004':[4,4,4,3,3,3], 'CL-007':[3,3,4,3,2,2] },
  ahmed:  { 'CL-008':[3,4,3,3,2,3] },
};

// Manager notes per member, keyed by "memberId-YYYY-MM"
const managerNotes = {};

// Historical KPI snapshots for Compare feature (seeded)
const kpiHistory = {
  hassan: { '2025-04':82,'2025-05':85,'2025-06':88 },
  dalia:  { '2025-04':80,'2025-05':83,'2025-06':85 },
  engy:   { '2025-04':72,'2025-05':76,'2025-06':79 },
  ahmed:  { '2025-04':65,'2025-05':69,'2025-06':73 },
};

let _clientIdCounter = 9; // for new client IDs

/* ───────────────────────────────────────────────────────────────
   3. FORMATTING HELPERS
─────────────────────────────────────────────────────────────── */
const fmt   = n  => Number(n || 0).toLocaleString('en-SA');
const fmtS  = n  => `${fmt(n)} ${APP.sym}`;
const pct   = n  => `${Math.round(n || 0)}%`;
const pctF  = (n,d=1) => `${(+(n||0)).toFixed(d)}%`;
const monthKey = (m,y) => `${y}-${String(m).padStart(2,'0')}`;
const currentKey = () => monthKey(state.month, state.year);

function achCls(rate) {
  if (rate >= 0.90) return 'ok';
  if (rate >= 0.70) return 'warn';
  return 'bad';
}
function statusCls(s) {
  return { Active:'badge-active', Paused:'badge-paused', Onboarding:'badge-onboard' }[s] || 'badge-neutral';
}
function satCls(s) {
  return { Satisfied:'badge-sat', Neutral:'badge-neutral', Unsatisfied:'badge-unsat' }[s] || 'badge-neutral';
}
function avCls(color) {
  return `av av-${color}`;
}
function levelCls(level) {
  return { Senior:'lv-senior','Mid-Level':'lv-mid',Junior:'lv-junior' }[level] || '';
}

/* ───────────────────────────────────────────────────────────────
   4. KPI ENGINE
─────────────────────────────────────────────────────────────── */
function levelAdjust(rawRate, level) {
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG.Senior;
  return Math.min(rawRate / cfg.fullAt, 1.0);
}

function calcKpi(memberId) {
  const m  = members.find(x => x.id === memberId);
  const mc = clients.filter(c => m.clients.includes(c.id));

  let totalTS = 0;
  mc.forEach(c => c.platforms.forEach(p => { totalTS += p.targetSpend; }));

  let weightedScore = 0;
  const breakdown = [];

  mc.forEach(c => {
    let cTS=0, cTR=0, cAR=0;
    c.platforms.forEach(p => { cTS+=p.targetSpend; cTR+=p.targetResults; cAR+=p.actualResults; });
    const weight   = totalTS > 0 ? cTS / totalTS : 0;
    const rawRate  = cTR > 0 ? cAR / cTR : 0;
    const adjRate  = levelAdjust(rawRate, m.level);
    const contrib  = weight * adjRate * 70;
    weightedScore += weight * adjRate;
    breakdown.push({ client:c, cTS, cTR, cAR, weight, rawRate, adjRate, contrib });
  });

  const sectionA = Math.round(weightedScore * 70);

  // Section B — average of all ops scores this member has
  let opsTotal=0, opsCount=0;
  const sc = opsScores[memberId] || {};
  m.clients.forEach(cid => {
    if (sc[cid]) sc[cid].forEach(s => { opsTotal+=s; opsCount++; });
  });
  const avgOps  = opsCount > 0 ? opsTotal/opsCount/5 : 0;
  const sectionB = Math.round(avgOps * 100 * 0.3);

  const total = Math.min(sectionA + sectionB, 100);
  return { sectionA, sectionB, total, breakdown, avgOps };
}

/* ───────────────────────────────────────────────────────────────
   5. NAVIGATION
─────────────────────────────────────────────────────────────── */
const PAGE_TITLES = {
  dashboard:'Overview', clients:'Clients', kpi:'Team KPIs',
  team:'Team Dashboard', integrations:'Integrations',
};

function nav(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const page = document.getElementById(`page-${pageId}`);
  if (page) page.classList.add('active');
  document.querySelectorAll(`.nav-item[data-page="${pageId}"]`).forEach(n => n.classList.add('active'));
  document.getElementById('topbar-title').textContent = PAGE_TITLES[pageId] || pageId;

  // Lazy-init charts when their page becomes visible
  if (pageId === 'dashboard') { setTimeout(initDashboardCharts, 60); renderDashboard(); }
  if (pageId === 'team')      { setTimeout(initTeamCharts, 60); }
  if (pageId === 'kpi')       { renderKpiCards(); }
  if (pageId === 'clients')   { renderClientTable(); }
}

/* ───────────────────────────────────────────────────────────────
   6. GLOBAL FILTER & TIME ENGINE
─────────────────────────────────────────────────────────────── */
function applyFilter() {
  state.month = parseInt(document.getElementById('filter-month').value, 10);
  state.year  = parseInt(document.getElementById('filter-year').value,  10);
  document.getElementById('filter-label').textContent =
    `${MONTH_NAMES[state.month-1]} ${state.year}`;

  // Re-render active page
  const active = document.querySelector('.page.active');
  if (!active) return;
  const id = active.id.replace('page-','');
  nav(id);
}

/* ───────────────────────────────────────────────────────────────
   7. OVERVIEW DASHBOARD
─────────────────────────────────────────────────────────────── */
function renderDashboard() {
  renderSpendBars();
  renderTeamKpiMini();
  renderInsights();
  updateAvgDisplays();
}

function updateAvgDisplays() {
  // KPI averages
  const avg = Math.round(members.reduce((s,m)=>s+calcKpi(m.id).total,0)/members.length);
  ['avg-kpi-overview','avg-kpi-team'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.textContent=pct(avg);
  });

  // Achievement badge on main metric cards
  const totTR = clients.reduce((s,c)=>s+c.platforms.reduce((ss,p)=>ss+p.targetResults,0),0);
  const totAR = clients.reduce((s,c)=>s+c.platforms.reduce((ss,p)=>ss+p.actualResults,0),0);
  const totTS = clients.reduce((s,c)=>s+c.platforms.reduce((ss,p)=>ss+p.targetSpend,0),0);
  const totAS = clients.reduce((s,c)=>s+c.platforms.reduce((ss,p)=>ss+p.actualSpend,0),0);
  const rRate = totTR>0 ? totAR/totTR : 0;
  const sRate = totTS>0 ? totAS/totTS : 0;

  // Update results badge
  const resBadge = document.getElementById('results-ach-badge');
  if (resBadge) {
    const cls = rRate>=0.9?'ach-badge-ok':rRate>=0.7?'ach-badge-warn':'ach-badge-bad';
    resBadge.className = 'ach-badge ' + cls;
    resBadge.textContent = pctF(rRate*100) + ' achieved';
  }
  // Update spend badge
  const spendBadge = document.getElementById('spend-ach-badge');
  if (spendBadge) {
    const cls = sRate>=0.9?'ach-badge-ok':sRate>=0.7?'ach-badge-warn':'ach-badge-bad';
    spendBadge.className = 'ach-badge ' + cls;
    spendBadge.textContent = pctF(sRate*100) + ' utilized';
  }
  // Update results sub-text
  const resSub = document.getElementById('results-sub-text');
  if (resSub) resSub.textContent = fmt(totAR) + ' of ' + fmt(totTR) + ' target';
  // Update spend sub-text
  const spendSub = document.getElementById('spend-sub-text');
  if (spendSub) spendSub.textContent = fmtS(totAS) + ' of ' + fmtS(totTS);
}

function renderSpendBars() {
  const el = document.getElementById('spend-bars'); if(!el) return;
  const rows = clients.map(c=>({
    name: c.name,
    spend: c.platforms.reduce((s,p)=>s+p.actualSpend,0),
    target: c.platforms.reduce((s,p)=>s+p.targetSpend,0),
  })).sort((a,b)=>b.spend-a.spend);
  const maxSpend = Math.max(...rows.map(r=>r.target),1);
  el.innerHTML = rows.map(r=>{
    const pctW = (r.spend/maxSpend*100).toFixed(1);
    const ach  = r.target>0 ? r.spend/r.target : 0;
    const cls  = achCls(ach);
    return `<div class="sbar-row">
      <div class="sbar-label" title="${r.name}">${r.name.split(' ')[0]}</div>
      <div class="sbar-track"><div class="sbar-fill sbar-${cls}" style="width:${pctW}%"></div></div>
      <div class="sbar-val">${fmtS(r.spend)}</div>
    </div>`;
  }).join('');
}

function renderTeamKpiMini() {
  const el = document.getElementById('team-kpi-mini'); if(!el) return;
  el.innerHTML = members.map(m=>{
    const k=calcKpi(m.id);
    return `<div class="mini-kpi-row">
      <div class="mini-kpi-meta">
        <span>${m.name}</span>
        <span class="muted" style="font-size:11px">${m.level}</span>
        <span class="mini-kpi-score">${pct(k.total)}</span>
      </div>
      <div class="progress-track"><div class="progress-fill fill-${m.color}" style="width:${k.total}%"></div></div>
    </div>`;
  }).join('');
}

function renderInsights() {
  const topEl   = document.getElementById('insight-top');
  const riskEl  = document.getElementById('insight-risk');
  const wloadEl = document.getElementById('insight-workload');
  if (!topEl) return;

  const top=[], risk=[];
  clients.forEach(c=>{
    const totalTR = c.platforms.reduce((s,p)=>s+p.targetResults,0);
    const totalAR = c.platforms.reduce((s,p)=>s+p.actualResults,0);
    const rate = totalTR>0 ? totalAR/totalTR : 0;
    if (rate>=0.90) top.push({name:c.name, rate});
    if (rate<0.70 && c.status==='Active') risk.push({name:c.name, rate});
  });

  topEl.innerHTML = top.length
    ? top.map(c=>`<div class="insight-chip chip-ok"><i class="ti ti-trending-up"></i>${c.name} — ${pctF(c.rate*100)}</div>`).join('')
    : `<div class="insight-empty">No clients at ≥90% yet this month</div>`;

  riskEl.innerHTML = risk.length
    ? risk.map(c=>`<div class="insight-chip chip-bad"><i class="ti ti-alert-triangle"></i>${c.name} — ${pctF(c.rate*100)}</div>`).join('')
    : `<div class="insight-empty">No underperforming accounts — great job!</div>`;

  wloadEl.innerHTML = members.map(m=>{
    const mc = clients.filter(c=>m.clients.includes(c.id));
    const active = mc.filter(c=>c.status==='Active').length;
    const other  = mc.length - active;
    return `<div class="wload-row">
      <div class="${avCls(m.color)} av-sm">${m.av}</div>
      <div class="wload-name">${m.name}</div>
      <span class="badge badge-active">${active} active</span>
      ${other?`<span class="badge badge-onboard">${other} other</span>`:''}
    </div>`;
  }).join('');
}

/* ───────────────────────────────────────────────────────────────
   8. CLIENT TABLE
─────────────────────────────────────────────────────────────── */
function renderClientTable() {
  const tbody = document.getElementById('clients-tbody');
  if (!tbody) return;

  tbody.innerHTML = clients.map(c => {
    const aNames = c.assigned
      .map(id => members.find(m => m.id === id)?.name || id)
      .join(', ');

    // Achievement rate badge for the row
    const totTR = c.platforms.reduce((s, p) => s + p.targetResults, 0);
    const totAR = c.platforms.reduce((s, p) => s + p.actualResults, 0);
    const rRate = totTR > 0 ? totAR / totTR : 0;
    const achBadgeCls = rRate >= 0.9 ? 'ach-badge-ok' : rRate >= 0.7 ? 'ach-badge-warn' : 'ach-badge-bad';
    const achBadge = totTR > 0
      ? `<span class="ach-badge ${achBadgeCls}">${pctF(rRate * 100)} achieved</span>`
      : '';

    return `<tr data-client-id="${c.id}">
      <td>
        <span class="client-link" data-id="${c.id}">${c.name}</span>
        ${achBadge}
      </td>
      <td class="muted">${c.industry || '—'}</td>
      <td>${c.status ? `<span class="badge ${statusCls(c.status)}">${c.status}</span>` : '<span class="muted">—</span>'}</td>
      <td><strong>${fmt(c.budget)}</strong> <span class="muted" style="font-size:11px">${APP.sym}</span></td>
      <td class="muted">${c.start || '—'}</td>
      <td>${aNames.split(', ').map(n => `<span class="chip">${n}</span>`).join('')}</td>
      <td>${c.satisfaction ? `<span class="badge ${satCls(c.satisfaction)}">${c.satisfaction}</span>` : '<span class="muted">—</span>'}</td>
      <td style="white-space:nowrap">
        <button class="icon-btn" data-action="view" data-id="${c.id}" title="View profile"><i class="ti ti-eye"></i></button>
        <button class="icon-btn" data-action="edit" data-id="${c.id}" title="Edit client"><i class="ti ti-edit"></i></button>
        <button class="icon-btn icon-btn-danger" data-action="delete" data-id="${c.id}" title="Delete client"><i class="ti ti-trash"></i></button>
      </td>
    </tr>`;
  }).join('');

  // ── Single delegated listener on tbody (fixes ALL click issues) ──
  tbody.onclick = function (e) {
    // Client name link
    const link = e.target.closest('.client-link[data-id]');
    if (link) { openClientDrawer(link.dataset.id); return; }

    // Action buttons
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id  = btn.dataset.id;
    const act = btn.dataset.action;
    if (act === 'view')   openClientDrawer(id);
    if (act === 'edit')   openEditClientModal(id);
    if (act === 'delete') deleteClient(id);
  };
}

/* ───────────────────────────────────────────────────────────────
   9. CLIENT DRAWER — Deep Profile View
─────────────────────────────────────────────────────────────── */
let _activeClientId = null;

function openClientDrawer(clientId) {
  if (!clientId) return;
  _activeClientId = clientId;

  const c = clients.find(x => x.id === clientId);
  if (!c) { console.warn('[Ocoda] openClientDrawer: client not found:', clientId); return; }

  const aNames = c.assigned
    .map(id => members.find(m => m.id === id)?.name || id)
    .join(', ');

  // ── Header ──
  const nameEl = document.getElementById('drawer-client-name');
  const subEl  = document.getElementById('drawer-client-subtitle');
  if (nameEl) nameEl.textContent = c.name;
  if (subEl)  subEl.textContent  = `${c.industry} · ${c.id} · Assigned: ${aNames}`;

  // ── Aggregated totals ──
  const totTR = c.platforms.reduce((s,p)=>s+p.targetResults,0);
  const totAR = c.platforms.reduce((s,p)=>s+p.actualResults,0);
  const totTS = c.platforms.reduce((s,p)=>s+p.targetSpend,0);
  const totAS = c.platforms.reduce((s,p)=>s+p.actualSpend,0);
  const rRate = totTR > 0 ? totAR / totTR : 0;
  const sRate = totTS > 0 ? totAS / totTS : 0;

  const sumEl = document.getElementById('drawer-summary');
  if (sumEl) {
    sumEl.innerHTML = `
      <div class="summary-grid">
        <div class="sum-card">
          <div class="sum-label">Total Target Results</div>
          <div class="sum-val">${fmt(totTR)}</div>
        </div>
        <div class="sum-card">
          <div class="sum-label">Total Actual Results</div>
          <div class="sum-val ${achCls(rRate)}-text">${fmt(totAR)}</div>
          <div class="sum-sub"><span class="ach-badge ${rRate>=0.9?'ach-badge-ok':rRate>=0.7?'ach-badge-warn':'ach-badge-bad'}">${pctF(rRate*100)} achieved</span></div>
        </div>
        <div class="sum-card">
          <div class="sum-label">Total Target Spend</div>
          <div class="sum-val">${fmtS(totTS)}</div>
        </div>
        <div class="sum-card">
          <div class="sum-label">Total Actual Spend</div>
          <div class="sum-val ${achCls(sRate)}-text">${fmtS(totAS)}</div>
          <div class="sum-sub"><span class="ach-badge ${sRate>=0.9?'ach-badge-ok':sRate>=0.7?'ach-badge-warn':'ach-badge-bad'}">${pctF(sRate*100)} utilized</span></div>
        </div>
      </div>
      <div class="sum-bars">
        <div class="sum-bar-row">
          <span class="sum-bar-label">Results</span>
          <div class="sbar-track" style="flex:1"><div class="sbar-fill sbar-${achCls(rRate)}" style="width:${Math.min(rRate*100,100)}%"></div></div>
          <span class="sum-bar-val">${fmt(totAR)} / ${fmt(totTR)}</span>
        </div>
        <div class="sum-bar-row">
          <span class="sum-bar-label">Spend ${APP.sym}</span>
          <div class="sbar-track" style="flex:1"><div class="sbar-fill sbar-${achCls(sRate)}" style="width:${Math.min(sRate*100,100)}%"></div></div>
          <span class="sum-bar-val">${fmtS(totAS)} / ${fmtS(totTS)}</span>
        </div>
      </div>`;
  }

  renderDrawerPlatforms(c);

  // ── FIX: force overlay open reliably ──
  const overlay = document.getElementById('client-drawer-overlay');
  if (overlay) {
    overlay.style.display = 'flex';   // belt-and-suspenders alongside the class
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
  }
}

function renderDrawerPlatforms(c) {
  const el = document.getElementById('drawer-platforms');
  el.innerHTML = c.platforms.map((p,pIdx)=>{
    const achR = p.targetResults>0?p.actualResults/p.targetResults:0;
    const achS = p.targetSpend>0?p.actualSpend/p.targetSpend:0;
    const uid  = `obj-${c.id}-${pIdx}`;
    const objTags = p.objectives.map((o,i)=>`
      <span class="obj-tag">${o}
        <span class="obj-remove" onclick="removeObj('${c.id}',${pIdx},${i})" title="Remove">×</span>
      </span>`).join('');
    const suggestions = SUGGESTED_OBJECTIVES.filter(s=>!p.objectives.includes(s)).slice(0,6)
      .map(s=>`<span class="obj-sugg" onclick="addObjSugg('${c.id}',${pIdx},'${s}')">${s}</span>`).join('');
    return `
    <div class="plat-card" id="plat-${c.id}-${pIdx}">
      <div class="plat-head">
        <div>
          <div class="plat-name">${p.name}</div>
          <div class="muted" style="font-size:11px">${p.objectives.join(', ') || 'No objectives'}</div>
        </div>
        <button class="icon-btn icon-btn-danger" onclick="removePlatform('${c.id}',${pIdx})" title="Remove platform">
          <i class="ti ti-trash"></i>
        </button>
      </div>

      <!-- Editable objectives -->
      <div class="obj-editor">
        <div class="obj-editor-label">Campaign Objectives</div>
        <div class="obj-tags">${objTags || '<span class="muted" style="font-size:11px">None yet</span>'}</div>
        <div class="obj-input-row">
          <input class="obj-input" id="${uid}-in" placeholder="Type objective + Enter">
          <button class="btn btn-xs btn-primary" onclick="addObjInput('${c.id}',${pIdx},'${uid}')">
            <i class="ti ti-plus"></i>
          </button>
        </div>
        <div class="obj-suggestions">${suggestions}</div>
      </div>

      <!-- Editable numbers -->
      <div class="plat-metrics-grid">
        ${editableMetric('Target Results','targetResults',c.id,pIdx,p.targetResults,'')}
        ${editableMetric('Actual Results','actualResults',c.id,pIdx,p.actualResults,'',achCls(achR))}
        ${editableMetric('Target Spend','targetSpend',c.id,pIdx,p.targetSpend,APP.sym)}
        ${editableMetric('Actual Spend','actualSpend',c.id,pIdx,p.actualSpend,APP.sym,achCls(achS))}
      </div>
      <div class="plat-bars">
        <div class="sbar-row">
          <div class="sbar-label">Results</div>
          <div class="sbar-track"><div class="sbar-fill sbar-${achCls(achR)}" style="width:${Math.min(achR*100,100)}%"></div></div>
          <div class="sbar-val">${fmt(p.actualResults)} / ${fmt(p.targetResults)}</div>
        </div>
        <div class="sbar-row">
          <div class="sbar-label">Spend ${APP.sym}</div>
          <div class="sbar-track"><div class="sbar-fill sbar-${achCls(achS)}" style="width:${Math.min(achS*100,100)}%"></div></div>
          <div class="sbar-val">${fmtS(p.actualSpend)} / ${fmtS(p.targetSpend)}</div>
        </div>
      </div>
    </div>`;
  }).join('') + `
  <button class="btn btn-outline w-full mt-1" onclick="addPlatform('${c.id}')">
    <i class="ti ti-plus"></i> Add Platform
  </button>`;
}

function editableMetric(label, field, clientId, pIdx, val, unit, colorCls='') {
  return `<div class="plat-metric">
    <div class="pm-label">${label}${unit?' ('+unit+')':''}</div>
    <input class="pm-input ${colorCls}-text" type="number" value="${val}" min="0"
      onchange="updatePlatformField('${clientId}',${pIdx},'${field}',this.value)"
      onblur="refreshClientDrawer()">
  </div>`;
}

function updatePlatformField(clientId, pIdx, field, value) {
  const c = clients.find(x=>x.id===clientId); if(!c) return;
  c.platforms[pIdx][field] = parseFloat(value)||0;
}

function refreshClientDrawer() {
  if (_activeClientId) {
    const c = clients.find(x=>x.id===_activeClientId); if(!c) return;
    // Re-render summary only (don't disrupt inputs)
    const totTR=c.platforms.reduce((s,p)=>s+p.targetResults,0);
    const totAR=c.platforms.reduce((s,p)=>s+p.actualResults,0);
    const totTS=c.platforms.reduce((s,p)=>s+p.targetSpend,0);
    const totAS=c.platforms.reduce((s,p)=>s+p.actualSpend,0);
    const rR=totTR>0?totAR/totTR:0; const sR=totTS>0?totAS/totTS:0;
    const sumEl = document.getElementById('drawer-summary'); if(!sumEl) return;
    sumEl.innerHTML = `
      <div class="summary-grid">
        <div class="sum-card"><div class="sum-label">Total Target Results</div><div class="sum-val">${fmt(totTR)}</div></div>
        <div class="sum-card"><div class="sum-label">Total Actual Results</div><div class="sum-val ${achCls(rR)}-text">${fmt(totAR)}</div><div class="sum-sub">${pctF(rR*100)} achieved</div></div>
        <div class="sum-card"><div class="sum-label">Total Target Spend</div><div class="sum-val">${fmtS(totTS)}</div></div>
        <div class="sum-card"><div class="sum-label">Total Actual Spend</div><div class="sum-val ${achCls(sR)}-text">${fmtS(totAS)}</div><div class="sum-sub">${pctF(sR*100)} utilized</div></div>
      </div>
      <div class="sum-bars">
        <div class="sum-bar-row"><span class="sum-bar-label">Results</span><div class="sbar-track" style="flex:1"><div class="sbar-fill sbar-${achCls(rR)}" style="width:${Math.min(rR*100,100)}%"></div></div><span class="sum-bar-val">${fmt(totAR)} / ${fmt(totTR)}</span></div>
        <div class="sum-bar-row"><span class="sum-bar-label">Spend</span><div class="sbar-track" style="flex:1"><div class="sbar-fill sbar-${achCls(sR)}" style="width:${Math.min(sR*100,100)}%"></div></div><span class="sum-bar-val">${fmtS(totAS)} / ${fmtS(totTS)}</span></div>
      </div>`;
    renderKpiCards(); updateAvgDisplays(); refreshTeamChart();
  }
}

function closeClientDrawer(e, force) {
  const overlay = document.getElementById('client-drawer-overlay');
  if (!overlay) return;
  if (force || e?.target === overlay) {
    overlay.classList.remove('open');
    overlay.style.display = '';         // reset inline style set by openClientDrawer
    overlay.setAttribute('aria-hidden', 'true');
    _activeClientId = null;
  }
}

/* ── Platform CRUD ── */
function addPlatform(clientId) {
  const c = clients.find(x=>x.id===clientId); if(!c) return;
  const name = prompt('Platform name (e.g. Meta, Google Ads, TikTok):','');
  if (!name?.trim()) return;
  c.platforms.push({ name:name.trim(), objectives:[], targetResults:0, targetSpend:0, actualSpend:0, actualResults:0 });
  openClientDrawer(clientId);
}

function removePlatform(clientId, pIdx) {
  const c = clients.find(x=>x.id===clientId); if(!c) return;
  if (!confirm(`Remove platform "${c.platforms[pIdx].name}"?`)) return;
  c.platforms.splice(pIdx,1);
  openClientDrawer(clientId);
}

/* ── Objective CRUD ── */
function removeObj(clientId, pIdx, oIdx) {
  const c = clients.find(x=>x.id===clientId); if(!c) return;
  c.platforms[pIdx].objectives.splice(oIdx,1);
  openClientDrawer(clientId);
}
function addObjSugg(clientId, pIdx, val) {
  const c = clients.find(x=>x.id===clientId); if(!c) return;
  if (!c.platforms[pIdx].objectives.includes(val)) c.platforms[pIdx].objectives.push(val);
  openClientDrawer(clientId);
}
function addObjInput(clientId, pIdx, uid) {
  const inp = document.getElementById(`${uid}-in`); if(!inp) return;
  const val = inp.value.trim(); if(!val) return;
  const c = clients.find(x=>x.id===clientId); if(!c) return;
  if (!c.platforms[pIdx].objectives.includes(val)) c.platforms[pIdx].objectives.push(val);
  inp.value='';
  openClientDrawer(clientId);
}
function handleObjKey(e,clientId,pIdx,uid) { if(e.key==='Enter'){e.preventDefault();addObjInput(clientId,pIdx,uid);} }

/* ───────────────────────────────────────────────────────────────
   10. CLIENT CRUD — New / Edit / Delete
─────────────────────────────────────────────────────────────── */
function openNewClientModal() {
  _editingClientId = null;
  document.getElementById('client-modal-title').textContent = 'New Client';
  document.getElementById('client-form').reset();
  document.getElementById('cf-id').value = '';
  document.getElementById('client-modal-overlay').classList.add('open');
}

let _editingClientId = null;
function openEditClientModal(clientId) {
  _editingClientId = clientId;
  const c = clients.find(x=>x.id===clientId); if(!c) return;
  document.getElementById('client-modal-title').textContent = 'Edit Client';
  document.getElementById('cf-id').value        = c.id;
  document.getElementById('cf-name').value      = c.name;
  document.getElementById('cf-industry').value  = c.industry;
  document.getElementById('cf-status').value    = c.status || '';
  document.getElementById('cf-budget').value    = c.budget;
  document.getElementById('cf-start').value     = c.start;
  document.getElementById('cf-assigned').value  = c.assigned.join(', ');
  document.getElementById('cf-sat').value       = c.satisfaction || '';
  document.getElementById('client-modal-overlay').classList.add('open');
}

function saveClientForm() {
  const name     = document.getElementById('cf-name').value.trim();
  const industry = document.getElementById('cf-industry').value.trim();
  const status   = document.getElementById('cf-status').value;
  const budget   = parseFloat(document.getElementById('cf-budget').value)||0;
  const start    = document.getElementById('cf-start').value;
  const assignedRaw = document.getElementById('cf-assigned').value;
  const sat      = document.getElementById('cf-sat').value;

  if (!name) { alert('Client name is required.'); return; }

  const assigned = assignedRaw.split(',').map(s=>s.trim()).filter(Boolean);

  if (_editingClientId) {
    const c = clients.find(x=>x.id===_editingClientId); if(!c) return;
    Object.assign(c, { name, industry, status:status||null, budget, start, assigned, satisfaction:sat||null });
  } else {
    const newId = `CL-${String(_clientIdCounter++).padStart(3,'0')}`;
    clients.push({ id:newId, name, industry, status:status||null, budget, start, assigned, satisfaction:sat||null, platforms:[] });
    // Add to assigned members' client lists
    assigned.forEach(aid=>{ const m=members.find(x=>x.id===aid); if(m&&!m.clients.includes(newId)) m.clients.push(newId); });
  }

  closeClientModal();
  renderClientTable();
  renderKpiCards();
  updateAvgDisplays();
}

function closeClientModal() {
  document.getElementById('client-modal-overlay').classList.remove('open');
}

function deleteClient(clientId) {
  const c = clients.find(x=>x.id===clientId); if(!c) return;
  if (!confirm(`Delete client "${c.name}"? This cannot be undone.`)) return;
  const idx = clients.findIndex(x=>x.id===clientId);
  if (idx>-1) clients.splice(idx,1);
  // Remove from member lists
  members.forEach(m=>{ m.clients=m.clients.filter(id=>id!==clientId); });
  renderClientTable();
  renderKpiCards();
  updateAvgDisplays();
}

/* ───────────────────────────────────────────────────────────────
   11. KPI CARDS
─────────────────────────────────────────────────────────────── */
function renderKpiCards() {
  const grid = document.getElementById('kpi-cards-grid'); if(!grid) return;
  grid.innerHTML = members.map(m=>{
    const k = calcKpi(m.id);
    return `
    <div class="kpi-card" onclick="openKpiModal('${m.id}')" role="button" tabindex="0"
         onkeydown="if(event.key==='Enter')openKpiModal('${m.id}')">
      <div class="kpi-card-hdr">
        <div class="${avCls(m.color)}">${m.av}</div>
        <div class="kpi-card-info">
          <div class="kpi-card-name">${m.name}</div>
          <div class="kpi-card-level">${m.level}</div>
        </div>
        <span class="level-pill ${levelCls(m.level)}">${m.level}</span>
      </div>
      <div class="kpi-big" style="color:${MEMBER_COLORS[m.id]||'#378ADD'}">${k.total}<span class="kpi-big-unit">%</span></div>
      <div class="progress-track">
        <div class="progress-fill fill-${m.color}" style="width:${k.total}%"></div>
      </div>
      <div class="kpi-split">
        <span>Section A: ${pct(k.sectionA)}</span>
        <span>Section B: ${pct(k.sectionB)}</span>
      </div>
      <div class="kpi-chips">
        ${clients.filter(c=>m.clients.includes(c.id)).map(c=>`<span class="chip">${c.name}</span>`).join('')}
      </div>
    </div>`;
  }).join('');
  updateAvgDisplays();
}

/* ───────────────────────────────────────────────────────────────
   12. KPI DETAIL MODAL — with editable Section B + Manager Notes
─────────────────────────────────────────────────────────────── */
let _openMemberId = null;

function openKpiModal(memberId) {
  _openMemberId = memberId;
  _renderKpiModal(memberId);
  document.getElementById('kpi-modal-overlay').classList.add('open');
}

function _renderKpiModal(memberId) {
  const m   = members.find(x=>x.id===memberId);
  const k   = calcKpi(memberId);
  const col = MEMBER_COLORS[memberId]||'#378ADD';
  const cfg = LEVEL_CONFIG[m.level];
  const noteKey = `${memberId}-${currentKey()}`;
  const note = managerNotes[noteKey] || '';

  document.getElementById('modal-member-name').textContent = `${m.name} — Individual Performance`;

  // Section A table rows
  const aRows = k.breakdown.map(({client:c, cTS, cTR, cAR, weight, rawRate, adjRate, contrib})=>{
    const rC = achCls(adjRate);
    return `<tr>
      <td><strong>${c.name}</strong></td>
      <td>${fmtS(cTS)}</td>
      <td>${pctF(weight*100,1)}</td>
      <td>${fmt(cAR)} / ${fmt(cTR)}</td>
      <td class="muted">${pctF(rawRate*100,1)}</td>
      <td class="${rC}-text"><strong>${pctF(adjRate*100,1)}</strong></td>
      <td>${contrib.toFixed(1)} pts</td>
    </tr>`;
  }).join('');

  // Section B — editable stars per ops label, averaged across clients
  const sc = opsScores[memberId] || {};
  const bRows = OPS_LABELS.map((label,i)=>{
    let total=0, cnt=0;
    m.clients.forEach(cid=>{ if(sc[cid]){ total+=sc[cid][i]; cnt++; } });
    const avg = cnt>0?total/cnt:0;
    // Interactive star rating
    const stars = [1,2,3,4,5].map(v=>`
      <button class="star-btn ${Math.round(avg)>=v?'star-on':''}"
        onclick="setOpsScore('${memberId}','ALL',${i},${v})" title="${v}/5">★</button>`).join('');
    return `<div class="ops-row">
      <div class="ops-label">${label}</div>
      <div class="ops-stars">${stars}<span class="ops-avg muted">${avg.toFixed(1)}/5</span></div>
    </div>`;
  }).join('');

  document.getElementById('modal-body').innerHTML = `
    <!-- Level Banner -->
    <div class="level-banner lv-banner-${m.level==='Senior'?'senior':m.level==='Mid-Level'?'mid':'junior'}">
      <strong>${m.level} — ${cfg.label}</strong>
      Threshold: ${Math.round(cfg.fullAt*100)}% of target = 100% of Section A points.
    </div>

    <!-- Score Cards -->
    <div class="grid-3 mb-2">
      <div class="metric-card">
        <div class="mc-label">Total KPI Score</div>
        <div class="mc-value" style="color:${col}">${pct(k.total)}</div>
      </div>
      <div class="metric-card">
        <div class="mc-label">Section A — Results (70%)</div>
        <div class="mc-value">${pct(k.sectionA)}</div>
        <div class="mc-sub">Spend-weighted, level-adjusted</div>
      </div>
      <div class="metric-card">
        <div class="mc-label">Section B — Ops (30%)</div>
        <div class="mc-value">${pct(k.sectionB)}</div>
        <div class="mc-sub">Manager-graded, 6 metrics</div>
      </div>
    </div>
    <div class="progress-track mb-2" style="height:10px">
      <div class="progress-fill" style="width:${k.total}%;background:${col}"></div>
    </div>

    <!-- Section A -->
    <div class="modal-section-title">Section A — Client Results & Spend
      <span class="muted" style="font-weight:400">(70% weight · ${APP.sym})</span>
    </div>
    <div class="table-wrap mb-2">
      <table>
        <thead><tr>
          <th>Client</th><th>Target Spend</th><th>Weight</th>
          <th>Results (Actual/Target)</th><th>Raw Rate</th>
          <th>Adj. Rate</th><th>KPI Pts</th>
        </tr></thead>
        <tbody>${aRows}</tbody>
      </table>
    </div>
    <div class="info-box mb-2">
      Formula: Adj. Rate = min(Actual ÷ Target ÷ ${cfg.fullAt}, 1.0) · Points = Weight × Adj. Rate × 70
    </div>

    <!-- Section B editable -->
    <div class="modal-section-title">Section B — Operational & Technical Matrix
      <span class="muted" style="font-weight:400">(30% weight · click stars to grade)</span>
    </div>
    <div class="ops-grid mb-2">${bRows}</div>
    <div class="info-box mb-3">Click stars to update grade. Scores are averaged across all assigned clients.</div>

    <!-- Per-client ops breakdown -->
    <div class="modal-section-title" style="margin-bottom:0.5rem">Per-Client Ops Scores</div>
    ${m.clients.map(cid=>{
      const cl=clients.find(x=>x.id===cid); if(!cl) return '';
      return `<div class="per-client-ops mb-1">
        <div class="per-client-name">${cl.name}</div>
        <div class="per-client-stars">
          ${OPS_LABELS.map((lbl,i)=>{
            const v=(sc[cid]||[])[i]||0;
            const stars=[1,2,3,4,5].map(s=>`<button class="star-btn star-sm ${v>=s?'star-on':''}"
              onclick="setOpsScoreClient('${memberId}','${cid}',${i},${s})" title="${lbl} ${s}/5">★</button>`).join('');
            return `<div class="pclient-row"><span class="pclient-lbl muted">${lbl}</span><span class="pclient-stars">${stars}<span class="muted" style="font-size:10px">${v}/5</span></span></div>`;
          }).join('')}
        </div>
      </div>`;
    }).join('')}

    <!-- Manager Notes -->
    <div class="modal-section-title mt-2">Manager's Monthly Evaluation Notes
      <span class="muted" style="font-weight:400">(${MONTH_NAMES[state.month-1]} ${state.year})</span>
    </div>
    <textarea class="mgr-notes" id="mgr-notes-${memberId}" placeholder="Write evaluation notes for ${m.name} this month…"
      onInput="saveManagerNote('${memberId}')">${note}</textarea>
    <div class="info-box" style="margin-top:6px">Notes auto-save as you type and are stored per month.</div>
  `;
}

function setOpsScore(memberId, scope, metricIdx, val) {
  const m = members.find(x=>x.id===memberId); if(!m) return;
  if (!opsScores[memberId]) opsScores[memberId]={};
  // Apply to all clients for this member
  m.clients.forEach(cid=>{
    if (!opsScores[memberId][cid]) opsScores[memberId][cid]=[3,3,3,3,3,3];
    opsScores[memberId][cid][metricIdx] = val;
  });
  _renderKpiModal(memberId);
  renderKpiCards();
  updateAvgDisplays();
  refreshTeamChart();
}

function setOpsScoreClient(memberId, clientId, metricIdx, val) {
  if (!opsScores[memberId]) opsScores[memberId]={};
  if (!opsScores[memberId][clientId]) opsScores[memberId][clientId]=[3,3,3,3,3,3];
  opsScores[memberId][clientId][metricIdx] = val;
  _renderKpiModal(memberId);
  renderKpiCards();
  updateAvgDisplays();
  refreshTeamChart();
}

function saveManagerNote(memberId) {
  const key = `${memberId}-${currentKey()}`;
  const el  = document.getElementById(`mgr-notes-${memberId}`);
  if (el) managerNotes[key] = el.value;
}

function closeKpiModal(e, force) {
  if (force || e?.target === document.getElementById('kpi-modal-overlay')) {
    document.getElementById('kpi-modal-overlay').classList.remove('open');
    _openMemberId = null;
  }
}

/* ───────────────────────────────────────────────────────────────
   13. TEAM DASHBOARD + CHARTS
─────────────────────────────────────────────────────────────── */
const charts = {};
function destroyChart(k) { if(charts[k]){charts[k].destroy();delete charts[k];} }

function initDashboardCharts() {
  initTrendChart();
}

function initTeamCharts() {
  initTeamBarChart();
  initResultsDoughnut();
  initGrowthChart();
  renderCompareSection();
}

function initTrendChart() {
  destroyChart('trend');
  const ctx = document.getElementById('trendChart'); if(!ctx) return;
  charts.trend = new Chart(ctx,{
    type:'line',
    data:{
      labels:['Jan','Feb','Mar','Apr','May','Jun'],
      datasets:[{
        label:`Total Spend (${APP.sym})`,
        data:[140000,155000,168000,180000,191000,194320],
        borderColor:'#378ADD', backgroundColor:'rgba(55,138,221,0.08)',
        fill:true, tension:0.4, pointRadius:5,
        pointBackgroundColor:'#378ADD', pointBorderColor:'#fff', pointBorderWidth:2,
      }]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false} },
      scales:{
        y:{ ticks:{callback:v=>`${(v/1000).toFixed(0)}k`,color:'#888780'}, grid:{color:'rgba(136,135,128,0.1)'} },
        x:{ ticks:{color:'#888780'}, grid:{display:false} }
      }
    }
  });
}

function initTeamBarChart() {
  destroyChart('teamBar');
  const ctx = document.getElementById('teamChart'); if(!ctx) return;
  const kpis = members.map(m=>calcKpi(m.id).total);
  charts.teamBar = new Chart(ctx,{
    type:'bar',
    data:{
      labels:members.map(m=>m.name),
      datasets:[{ label:'KPI %', data:kpis, backgroundColor:['#7F77DD','#1D9E75','#D85A30','#378ADD'], borderRadius:6, borderSkipped:false }]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false} },
      scales:{
        y:{ min:0, max:100, ticks:{callback:v=>v+'%',color:'#888780'}, grid:{color:'rgba(136,135,128,0.1)'} },
        x:{ ticks:{color:'#888780'}, grid:{display:false} }
      }
    }
  });
}

function initResultsDoughnut() {
  destroyChart('results');
  const ctx = document.getElementById('resultsChart'); if(!ctx) return;
  const totR = clients.reduce((s,c)=>s+c.platforms.reduce((ss,p)=>ss+p.actualResults,0),0);
  const totT = clients.reduce((s,c)=>s+c.platforms.reduce((ss,p)=>ss+p.targetResults,0),0);
  charts.results = new Chart(ctx,{
    type:'doughnut',
    data:{
      labels:['Achieved','Remaining'],
      datasets:[{ data:[totR,Math.max(totT-totR,0)], backgroundColor:['#1D9E75','rgba(136,135,128,0.15)'], borderWidth:0, hoverOffset:4 }]
    },
    options:{
      responsive:true, maintainAspectRatio:false, cutout:'72%',
      plugins:{ legend:{labels:{color:'#888780',font:{size:11},usePointStyle:true}} },
      layout:{padding:8}
    }
  });
}

function initGrowthChart() {
  destroyChart('growth');
  const ctx = document.getElementById('growthChart'); if(!ctx) return;
  charts.growth = new Chart(ctx,{
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
      plugins:{ legend:{labels:{color:'#888780',font:{size:11},usePointStyle:true}} },
      scales:{
        y:{ min:60, max:100, ticks:{callback:v=>v+'%',color:'#888780'}, grid:{color:'rgba(136,135,128,0.1)'} },
        x:{ ticks:{color:'#888780'}, grid:{display:false} }
      }
    }
  });
}

function refreshTeamChart() {
  if (!charts.teamBar) return;
  charts.teamBar.data.datasets[0].data = members.map(m=>calcKpi(m.id).total);
  charts.teamBar.update();
}

/* ── Compare Feature ── */
function renderCompareSection() {
  const el = document.getElementById('compare-content'); if(!el) return;
  const m1 = parseInt(document.getElementById('cmp-month-a').value,10);
  const y1 = parseInt(document.getElementById('cmp-year-a').value,10);
  const m2 = parseInt(document.getElementById('cmp-month-b').value,10);
  const y2 = parseInt(document.getElementById('cmp-year-b').value,10);
  const k1 = monthKey(m1,y1);
  const k2 = monthKey(m2,y2);
  const label1 = `${MONTH_NAMES[m1-1]} ${y1}`;
  const label2 = `${MONTH_NAMES[m2-1]} ${y2}`;

  // Build comparison data from kpiHistory
  const rows = members.map(m=>{
    const v1 = kpiHistory[m.id]?.[k1] ?? calcKpi(m.id).total;
    const v2 = kpiHistory[m.id]?.[k2] ?? calcKpi(m.id).total;
    const diff = v2-v1;
    const arrow = diff>0?'↑ ':diff<0?'↓ ':'→ ';
    const cls   = diff>0?'ok-text':diff<0?'bad-text':'muted';
    return `<tr>
      <td><div class="${avCls(m.color)} av-sm" style="display:inline-flex">${m.av}</div> ${m.name}</td>
      <td style="text-align:center"><strong>${v1}%</strong></td>
      <td style="text-align:center"><strong>${v2}%</strong></td>
      <td style="text-align:center" class="${cls}"><strong>${arrow}${Math.abs(diff)}%</strong></td>
    </tr>`;
  }).join('');

  el.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead><tr><th>Member</th><th style="text-align:center">${label1}</th><th style="text-align:center">${label2}</th><th style="text-align:center">Change</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;

  // Mini comparison bar chart
  destroyChart('cmpChart');
  const ctx = document.getElementById('cmpChart'); if(!ctx) return;
  charts.cmpChart = new Chart(ctx,{
    type:'bar',
    data:{
      labels: members.map(m=>m.name),
      datasets:[
        { label:label1, data:members.map(m=>kpiHistory[m.id]?.[k1]??calcKpi(m.id).total), backgroundColor:'rgba(127,119,221,0.7)', borderRadius:4, borderSkipped:false },
        { label:label2, data:members.map(m=>kpiHistory[m.id]?.[k2]??calcKpi(m.id).total), backgroundColor:'rgba(29,158,117,0.7)', borderRadius:4, borderSkipped:false },
      ]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{labels:{color:'#888780',font:{size:11}}} },
      scales:{
        y:{ min:0, max:100, ticks:{callback:v=>v+'%',color:'#888780'}, grid:{color:'rgba(136,135,128,0.1)'} },
        x:{ ticks:{color:'#888780'}, grid:{display:false} }
      }
    }
  });
}

/* ───────────────────────────────────────────────────────────────
   14. INTEGRATIONS
─────────────────────────────────────────────────────────────── */
let _tokenRevealed = false;
function toggleToken() {
  _tokenRevealed = !_tokenRevealed;
  const el  = document.getElementById('token-value');
  const btn = document.getElementById('token-toggle-btn');
  if(el) el.textContent = _tokenRevealed ? APP.apiToken : 'sk_live_••••••••••••••••••••••••••••';
  if(btn) btn.textContent = _tokenRevealed ? 'Hide' : 'Reveal';
}

function copyToClipboard(text, btnId) {
  navigator.clipboard.writeText(text).then(()=>{
    const btn=document.getElementById(btnId); if(!btn) return;
    const orig=btn.innerHTML;
    btn.innerHTML='<i class="ti ti-check"></i> Copied';
    setTimeout(()=>{ btn.innerHTML=orig; },2000);
  }).catch(()=>{ alert('Copy failed — please copy manually.'); });
}

function simulateWebhook() {
  const clientId = document.getElementById('sim-client')?.value;
  const spend    = parseFloat(document.getElementById('sim-spend')?.value)||0;
  const results  = parseInt(document.getElementById('sim-results')?.value,10)||0;
  const c = clients.find(x=>x.id===clientId);
  if (c?.platforms[0]) { c.platforms[0].actualSpend=spend; c.platforms[0].actualResults=results; }
  const el = document.getElementById('webhook-response');
  if (el) el.innerHTML=`<div class="response-success"><i class="ti ti-circle-check"></i>
    <div><strong>Payload received for ${c?.name||clientId}</strong><br>
    Spend → ${fmtS(spend)}, Results → ${fmt(results)}. KPIs recalculated live.</div></div>`;
  renderKpiCards(); renderSpendBars(); renderTeamKpiMini(); updateAvgDisplays(); refreshTeamChart();
}

/* ───────────────────────────────────────────────────────────────
   15. DARK MODE TOGGLE
─────────────────────────────────────────────────────────────── */
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  const btn = document.getElementById('dark-toggle');
  if (btn) btn.innerHTML = document.documentElement.classList.contains('dark')
    ? '<i class="ti ti-sun"></i>' : '<i class="ti ti-moon"></i>';
}

/* ───────────────────────────────────────────────────────────────
   16. INIT
─────────────────────────────────────────────────────────────── */
function init() {
  // Nav wiring
  document.querySelectorAll('.nav-item[data-page]').forEach(el=>{
    el.addEventListener('click', ()=>nav(el.dataset.page));
    el.addEventListener('keydown', e=>{ if(e.key==='Enter') nav(el.dataset.page); });
  });

  // Filter wiring
  const fm=document.getElementById('filter-month');
  const fy=document.getElementById('filter-year');
  if(fm) fm.addEventListener('change', applyFilter);
  if(fy) fy.addEventListener('change', applyFilter);

  // Initialize filter label
  document.getElementById('filter-label').textContent = `${MONTH_NAMES[state.month-1]} ${state.year}`;

  // Dashboard is default active page
  renderDashboard();
  renderClientTable();
  renderKpiCards();
  updateAvgDisplays();
  setTimeout(initDashboardCharts, 80);
}

document.addEventListener('DOMContentLoaded', init);
