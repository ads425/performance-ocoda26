/* ================================================================
   Performance Ocoda v5 — Complete Production Logic
   Key upgrade: Objective-level numeric inputs per platform
   All values in SAR ر.س
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

/* Level-based KPI thresholds — fullAt = achievement rate that earns 100% of points */
const LEVEL_CFG = {
  Senior:      { fullAt: 1.00, bannerCls: 'lvb-senior', label: 'Strict — 100% of target required' },
  'Mid-Level': { fullAt: 0.90, bannerCls: 'lvb-mid',    label: 'Balanced — 90% of target = full score' },
  Junior:      { fullAt: 0.80, bannerCls: 'lvb-junior', label: 'Growth — 80% of target = full score'   },
};

const OPS_LABELS = [
  'Ad Account Setup',
  'Tracking & Pixels Implementation',
  'Client Requirements Fulfillment',
  'Campaign Optimization',
  'Problem Solving & Creative Ideas',
  'AI Tools Utilization',
];

/* Suggested campaign objectives for quick-add chips */
const SUGGESTED_OBJ = [
  'Leads', 'Conversions', 'Messages', 'App Installs',
  'Brand Awareness', 'Reach', 'Traffic', 'Engagement',
  'Video Views', 'Store Visits', 'Catalog Sales', 'Event Responses',
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
   
   v5 DATA SHAPE — platforms.objectives is now an array of objects:
   {
     name: 'Leads',
     targetResults: 0,
     actualResults: 0,
     targetSpend:   0,
     actualSpend:   0,
   }
   Platform-level totals are computed dynamically by summing objectives.
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
      { name:'Meta', objectives:[
          { name:'Leads',          targetResults:400, actualResults:312, targetSpend:12000, actualSpend:11200 },
          { name:'Brand Awareness',targetResults:150, actualResults:130, targetSpend:8000,  actualSpend:7250  },
        ]},
      { name:'TikTok', objectives:[
          { name:'Conversions',    targetResults:150, actualResults:130, targetSpend:8000,  actualSpend:7200  },
        ]},
    ]},
  { id:'CL-002', name:'Gulf Auto Group', industry:'Automotive',         status:'Active',     budget:55000, start:'2023-11-01', assigned:['hassan'], satisfaction:'Satisfied',
    platforms:[
      { name:'Google Ads', objectives:[
          { name:'Leads',          targetResults:250, actualResults:228, targetSpend:30000, actualSpend:28900 },
        ]},
      { name:'Meta', objectives:[
          { name:'Messages',       targetResults:200, actualResults:185, targetSpend:10000, actualSpend:9500  },
          { name:'Leads',          targetResults:100, actualResults:100, targetSpend:5000,  actualSpend:4700  },
        ]},
    ]},
  { id:'CL-003', name:'MedPlus Clinics', industry:'Healthcare',         status:'Active',     budget:28000, start:'2024-03-01', assigned:['dalia'],  satisfaction:'Satisfied',
    platforms:[
      { name:'Google Ads', objectives:[
          { name:'Leads',          targetResults:180, actualResults:165, targetSpend:22000, actualSpend:20100 },
        ]},
      { name:'Meta', objectives:[
          { name:'Leads',          targetResults:100, actualResults:88,  targetSpend:6000,  actualSpend:5800  },
        ]},
    ]},
  { id:'CL-004', name:'Bloom Academy',   industry:'Education',          status:'Active',     budget:22000, start:'2024-05-10', assigned:['engy'],   satisfaction:'Neutral',
    platforms:[
      { name:'Meta', objectives:[
          { name:'Leads',          targetResults:160, actualResults:140, targetSpend:10000, actualSpend:9000  },
          { name:'App Installs',   targetResults:40,  actualResults:32,  targetSpend:4000,  actualSpend:3500  },
        ]},
      { name:'Snapchat', objectives:[
          { name:'Leads',          targetResults:80,  actualResults:64,  targetSpend:6000,  actualSpend:5100  },
        ]},
    ]},
  { id:'CL-005', name:'Riyadh Eats',     industry:'Food & Beverage',    status:'Active',     budget:18000, start:'2024-02-20', assigned:['hassan'], satisfaction:'Satisfied',
    platforms:[
      { name:'Meta', objectives:[
          { name:'Messages',       targetResults:500, actualResults:478, targetSpend:10000, actualSpend:9800  },
        ]},
      { name:'TikTok', objectives:[
          { name:'Conversions',    targetResults:120, actualResults:104, targetSpend:6000,  actualSpend:5700  },
        ]},
    ]},
  { id:'CL-006', name:'LuxStay Hotels',  industry:'Hospitality',        status:'Paused',     budget:40000, start:'2024-01-05', assigned:['dalia'],  satisfaction:'Neutral',
    platforms:[
      { name:'Google Ads', objectives:[
          { name:'Conversions',    targetResults:90,  actualResults:0,   targetSpend:28000, actualSpend:0     },
        ]},
      { name:'Meta', objectives:[
          { name:'Leads',          targetResults:80,  actualResults:0,   targetSpend:6000,  actualSpend:0     },
          { name:'Brand Awareness',targetResults:40,  actualResults:0,   targetSpend:4000,  actualSpend:0     },
        ]},
    ]},
  { id:'CL-007', name:'KidsZone Toys',   industry:'Retail',             status:'Onboarding', budget:14000, start:'2025-06-01', assigned:['engy'],   satisfaction:'Neutral',
    platforms:[
      { name:'Meta', objectives:[
          { name:'Conversions',    targetResults:150, actualResults:48,  targetSpend:9000,  actualSpend:3200  },
        ]},
      { name:'TikTok', objectives:[
          { name:'Conversions',    targetResults:60,  actualResults:18,  targetSpend:3000,  actualSpend:1100  },
          { name:'Reach',          targetResults:20,  actualResults:0,   targetSpend:1000,  actualSpend:300   },
        ]},
    ]},
  { id:'CL-008', name:'TechSpark SA',    industry:'Technology',         status:'Active',     budget:35000, start:'2024-09-01', assigned:['ahmed'],  satisfaction:'Unsatisfied',
    platforms:[
      { name:'Google Ads', objectives:[
          { name:'Leads',          targetResults:200, actualResults:162, targetSpend:20000, actualSpend:17800 },
        ]},
      { name:'LinkedIn', objectives:[
          { name:'Leads',          targetResults:40,  actualResults:30,  targetSpend:6000,  actualSpend:5500  },
          { name:'Brand Awareness',targetResults:20,  actualResults:14,  targetSpend:4000,  actualSpend:3400  },
        ]},
    ]},
];

/* Ops scores: memberId → clientId → [6 values 1-5] */
const opsScores = {
  hassan: { 'CL-001':[5,4,5,4,4,3], 'CL-002':[5,5,4,5,4,4], 'CL-005':[4,4,5,4,3,3] },
  dalia:  { 'CL-003':[5,5,5,4,5,4], 'CL-006':[3,3,4,3,3,2] },
  engy:   { 'CL-004':[4,4,4,3,3,3], 'CL-007':[3,3,4,3,2,2] },
  ahmed:  { 'CL-008':[3,4,3,3,2,3] },
};

/* Manager notes: "memberId-YYYY-MM" → text */
const managerNotes = {};

/* Historical KPI data for compare feature */
const kpiHistory = {
  hassan: { '2025-04':82,'2025-05':85,'2025-06':88 },
  dalia:  { '2025-04':80,'2025-05':83,'2025-06':85 },
  engy:   { '2025-04':72,'2025-05':76,'2025-06':79 },
  ahmed:  { '2025-04':65,'2025-05':69,'2025-06':73 },
};

let _clientCounter = 9;

/* ══════════════════════════════════════════════════════════════
   4. DATA HELPERS — platform totals from objectives
══════════════════════════════════════════════════════════════ */

/**
 * platStats(platform)
 *
 * Returns raw spend totals (summed directly — spend is homogeneous SAR)
 * and a results "achievement average" across all active objectives
 * (because 1 Conversion ≠ 1 Message — we must NOT sum raw counts).
 *
 * resultsAvgRate  = average of each objective's (actual/target) rate
 *                   for objectives that have a target > 0.
 *                   Range: 0–1.  Represents the platform's composite
 *                   results performance.
 *
 * totalTS / totalAS  = plain sum (SAR is homogeneous).
 *
 * For backward-compat, totalTR and totalAR are still returned as raw
 * sums so the drawer can show absolute numbers to the manager.
 */
function platStats(platform) {
  let totalTR=0, totalAR=0, totalTS=0, totalAS=0;
  let objPctSum=0, objPctCount=0;

  (platform.objectives || []).forEach(o => {
    totalTR += o.targetResults || 0;
    totalAR += o.actualResults || 0;
    totalTS += o.targetSpend   || 0;
    totalAS += o.actualSpend   || 0;
    // Only include objectives that have a target set
    if ((o.targetResults || 0) > 0) {
      objPctSum   += (o.actualResults || 0) / o.targetResults;
      objPctCount += 1;
    }
  });

  // Average-of-percentages for results (avoids cross-type distortion)
  const resultsAvgRate = objPctCount > 0 ? objPctSum / objPctCount : 0;
  // Spend is SAR — homogeneous, plain ratio is correct
  const spendRate      = totalTS > 0 ? totalAS / totalTS : 0;

  return { totalTR, totalAR, totalTS, totalAS, resultsAvgRate, spendRate };
}

/** Keep platTotals as a thin alias so nothing else breaks */
function platTotals(platform) { return platStats(platform); }

/**
 * clientTotals(client)
 *
 * tS / aS  — raw SAR sums (homogeneous, safe to add).
 * tR / aR  — raw result sums (kept for display only).
 *
 * resultsRate — spend-weighted average of each platform's
 *   resultsAvgRate. A platform that spends more has proportionally
 *   more impact on the composite client results score.
 *   This is the value used in the KPI engine.
 */
function clientTotals(client) {
  let tR=0, aR=0, tS=0, aS=0;
  let weightedRateSum=0;

  (client.platforms || []).forEach(p => {
    const ps = platStats(p);
    tR += ps.totalTR; aR += ps.totalAR;
    tS += ps.totalTS; aS += ps.totalAS;
    // Weight each platform's results rate by its own target spend
    weightedRateSum += ps.resultsAvgRate * ps.totalTS;
  });

  // Spend-weighted composite results rate for this client
  const resultsRate = tS > 0 ? weightedRateSum / tS : 0;
  const spendRate   = tS > 0 ? aS / tS : 0;

  return { tR, aR, tS, aS, resultsRate, spendRate };
}

/* ══════════════════════════════════════════════════════════════
   5. FORMATTERS & HELPERS
══════════════════════════════════════════════════════════════ */
const fmt  = n => Number(n||0).toLocaleString('en-SA');
const fmtS = n => `${fmt(n)} ${APP.sym}`;
const pct  = n => `${Math.round(n||0)}%`;
const pctF = (n,d=1) => `${Number(n||0).toFixed(d)}%`;
const mkey = (m,y) => `${y}-${String(m).padStart(2,'0')}`;

function achCls(rate) {
  if (rate >= 0.90) return 'ok';
  if (rate >= 0.70) return 'warn';
  return 'bad';
}
function achBadge(rate, label) {
  return `<span class="ach-badge ach-${achCls(rate)}">${pctF(rate*100)} ${label}</span>`;
}
function platPerfBadge(rate) {
  if (rate >= 0.90) return `<span class="perf-badge pb-best">✓ Best Performance</span>`;
  if (rate > 0 && rate < 0.70) return `<span class="perf-badge pb-risk">⚠ Underperforming</span>`;
  return '';
}
function kpiStatusBadge(total) {
  if (total >= 90) return `<span class="kpi-status-badge ksb-top">✓ Top Performer</span>`;
  if (total < 70)  return `<span class="kpi-status-badge ksb-risk">⚠ Action Required</span>`;
  return '';
}
function statusBadge(s) {
  const m = { Active:'b-active', Paused:'b-paused', Onboarding:'b-onboard' };
  return s ? `<span class="badge ${m[s]||'b-neut'}">${s}</span>` : `<span class="muted">—</span>`;
}
function satBadge(s) {
  const m = { Satisfied:'b-sat', Neutral:'b-neut', Unsatisfied:'b-unsat' };
  return s ? `<span class="badge ${m[s]||'b-neut'}">${s}</span>` : `<span class="muted">—</span>`;
}
function avEl(color, text, extra='') {
  return `<div class="av${extra} av-${color}">${text}</div>`;
}

/* DOM helpers */
function $id(id)       { return document.getElementById(id); }
function setHTML(id,h) { const el=$id(id); if(el) el.innerHTML=h; }
function setTxt(id,t)  { const el=$id(id); if(el) el.textContent=t; }
function getVal(id)    { return ($id(id)?.value||''); }
function setVal(id,v)  { const el=$id(id); if(el) el.value=v; }

/* ══════════════════════════════════════════════════════════════
   6. KPI ENGINE
══════════════════════════════════════════════════════════════ */
function levelAdjust(rawRate, level) {
  const cfg = LEVEL_CFG[level] || LEVEL_CFG.Senior;
  return Math.min(rawRate / cfg.fullAt, 1.0);
}

function calcKpi(memberId) {
  const m  = members.find(x=>x.id===memberId);
  const mc = clients.filter(c=>m.clients.includes(c.id));

  /* Total target spend across all assigned clients (for spend-based weighting) */
  let totalTS = 0;
  mc.forEach(c => {
    c.platforms.forEach(p => {
      const pt = platTotals(p);
      totalTS += pt.totalTS;
    });
  });

  let weightedScore = 0;
  const breakdown   = [];

  mc.forEach(c => {
    const ct = clientTotals(c);
    const weight  = totalTS > 0 ? ct.tS / totalTS : 0;
    // Use resultsRate (avg-of-pct) instead of raw aR/tR sum ratio
    const rawRate = ct.resultsRate;
    const adjRate = levelAdjust(rawRate, m.level);
    const contrib = weight * adjRate * 70;
    weightedScore += weight * adjRate;
    breakdown.push({ client:c, cTS:ct.tS, cTR:ct.tR, cAR:ct.aR,
                     weight, rawRate, adjRate, contrib,
                     resultsRate: ct.resultsRate });
  });

  const sectionA = Math.round(weightedScore * 70);

  let opsT=0, opsC=0;
  const sc = opsScores[memberId] || {};
  m.clients.forEach(cid => {
    if (sc[cid]) sc[cid].forEach(v => { opsT+=v; opsC++; });
  });
  const avgOps   = opsC > 0 ? opsT/opsC/5 : 0;
  const sectionB = Math.round(avgOps * 100 * 0.3);

  return { sectionA, sectionB, total: Math.min(sectionA+sectionB,100), breakdown };
}

/* ══════════════════════════════════════════════════════════════
   7. NAVIGATION
══════════════════════════════════════════════════════════════ */
const PAGE_TITLES = {
  dashboard:'Overview', clients:'Clients', kpi:'Team KPIs',
  team:'Team Dashboard', integrations:'Integrations',
};

function nav(pageId) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const pg=$id(`page-${pageId}`); if(pg) pg.classList.add('active');
  document.querySelectorAll(`.nav-item[data-page="${pageId}"]`).forEach(n=>n.classList.add('active'));
  setTxt('topbar-title', PAGE_TITLES[pageId]||pageId);

  if (pageId==='dashboard')   { renderDashboard();   setTimeout(initDashCharts,60); }
  if (pageId==='clients')     { renderClientTable(); }
  if (pageId==='kpi')         { renderKpiCards(); }
  if (pageId==='team')        { renderTeamMetrics(); setTimeout(initTeamCharts,60); }
}

/* ══════════════════════════════════════════════════════════════
   8. FILTER
══════════════════════════════════════════════════════════════ */
function applyFilter() {
  state.month = parseInt(getVal('filter-month'),10);
  state.year  = parseInt(getVal('filter-year'),10);
  setTxt('period-tag', `${MONTHS[state.month-1]} ${state.year}`);
  const active = document.querySelector('.page.active');
  if (active) nav(active.id.replace('page-',''));
}

/* ══════════════════════════════════════════════════════════════
   9. DASHBOARD
══════════════════════════════════════════════════════════════ */
function renderDashboard() {
  renderMetricCards();
  renderInsights();
  renderSpendBars();
  renderKpiMini();
  renderCompare();
}

function renderMetricCards() {
  const totalBudget = clients.reduce((s,c)=>s+c.budget,0);
  setHTML('mc-budget',     fmtS(totalBudget));
  setHTML('mc-budget-sub', `SAR across ${clients.length} clients`);

  // Aggregate across all clients
  let totTS=0, totAS=0, totTR=0, totAR=0;
  let clientRateSum=0, clientRateCount=0;
  clients.forEach(c => {
    const ct = clientTotals(c);
    totTS += ct.tS; totAS += ct.aS; totTR += ct.tR; totAR += ct.aR;
    if (ct.tS > 0) {
      // Spend-weight each client's resultsRate for global average
      clientRateSum   += ct.resultsRate * ct.tS;
      clientRateCount += ct.tS;
    }
  });

  const sRate = totTS>0 ? totAS/totTS : 0;
  // Global results rate = spend-weighted avg-of-pct
  const rRate = clientRateCount>0 ? clientRateSum/clientRateCount : 0;

  setHTML('mc-spend', fmtS(totAS));
  const sb = $id('spend-badge');
  if(sb){ sb.className=`ach-badge ach-${achCls(sRate)}`; sb.textContent=`${pctF(sRate*100)} utilized`; }

  setHTML('mc-results', fmt(totAR));
  const rb = $id('results-badge');
  if(rb){ rb.className=`ach-badge ach-${achCls(rRate)}`; rb.textContent=`${pctF(rRate*100)} avg achievement`; }

  const avg = Math.round(members.reduce((s,m)=>s+calcKpi(m.id).total,0)/members.length);
  setHTML('mc-kpi', pct(avg));
  setHTML('t-kpi-avg', pct(avg));
}

function renderInsights() {
  const top=[], risk=[];
  clients.forEach(c => {
    const ct = clientTotals(c);
    const r  = ct.resultsRate;           // avg-of-pct (correct)
    if (r>=0.90) top.push({name:c.name, r});
    if (r<0.70 && c.status==='Active') risk.push({name:c.name, r});
  });
  setHTML('ins-top',  top.length  ? top.map(x=>`<div class="ins-chip ic-ok">↑ ${x.name} — ${pctF(x.r*100)}</div>`).join('') : `<div class="ins-empty">No clients at ≥90% yet this month</div>`);
  setHTML('ins-risk', risk.length ? risk.map(x=>`<div class="ins-chip ic-bad">⚠ ${x.name} — ${pctF(x.r*100)}</div>`).join('') : `<div class="ins-empty">No underperforming accounts — great!</div>`);
  setHTML('ins-workload', members.map(m=>{
    const mc=clients.filter(c=>m.clients.includes(c.id));
    const active=mc.filter(c=>c.status==='Active').length;
    const other=mc.length-active;
    return `<div class="wl-row">${avEl(m.color,m.av,'-sm')}<div class="wl-name">${m.name}</div><span class="badge b-active">${active} active</span>${other?`<span class="badge b-neut">${other} other</span>`:''}</div>`;
  }).join(''));
}

function renderSpendBars() {
  const el=$id('spend-bars'); if(!el) return;
  const rows=clients.map(c=>{ const ct=clientTotals(c); return {name:c.name,spend:ct.aS,target:ct.tS}; })
    .sort((a,b)=>b.spend-a.spend);
  const maxT=Math.max(...rows.map(r=>r.target),1);
  el.innerHTML=rows.map(r=>{
    const ach=r.target>0?r.spend/r.target:0;
    return `<div class="sbar-row"><div class="sbar-lbl" title="${r.name}">${r.name.split(' ')[0]}</div><div class="sbar-trk"><div class="sbar-fill sf-${achCls(ach)}" style="width:${Math.min(r.spend/maxT*100,100).toFixed(1)}%"></div></div><div class="sbar-val">${fmtS(r.spend)}</div></div>`;
  }).join('');
}

function renderKpiMini() {
  const el=$id('kpi-mini'); if(!el) return;
  el.innerHTML=members.map(m=>{
    const k=calcKpi(m.id);
    return `<div class="kpi-mini-item"><div class="kpi-mini-meta"><span class="km-name">${m.name}</span><span class="km-level">${m.level}</span><span class="km-score" style="color:${MEMBER_COLORS[m.id]}">${pct(k.total)}</span></div><div class="prog-trk"><div class="prog-fill pf-${m.color}" style="width:${k.total}%"></div></div></div>`;
  }).join('');
}

/* ══════════════════════════════════════════════════════════════
   10. COMPARE VIEW
══════════════════════════════════════════════════════════════ */
function renderCompare() {
  const m1=parseInt(getVal('cmp-ma')||5,10),y1=parseInt(getVal('cmp-ya')||2025,10);
  const m2=parseInt(getVal('cmp-mb')||6,10),y2=parseInt(getVal('cmp-yb')||2025,10);
  const k1=mkey(m1,y1),k2=mkey(m2,y2);
  const l1=`${MONTHS[m1-1]} ${y1}`, l2=`${MONTHS[m2-1]} ${y2}`;
  const rows=members.map(m=>{
    const v1=kpiHistory[m.id]?.[k1]??calcKpi(m.id).total;
    const v2=kpiHistory[m.id]?.[k2]??calcKpi(m.id).total;
    const d=v2-v1; const sym=d>0?'↑':d<0?'↓':'→'; const cls=d>0?'ok-t':d<0?'bad-t':'muted';
    return `<tr><td>${avEl(m.color,m.av,'-sm')} <strong style="margin-left:6px">${m.name}</strong></td><td style="text-align:center"><strong>${v1}%</strong></td><td style="text-align:center"><strong>${v2}%</strong></td><td style="text-align:center" class="${cls}"><strong>${sym} ${Math.abs(d)}%</strong></td></tr>`;
  }).join('');
  setHTML('cmp-table',`<table><thead><tr><th>Member</th><th style="text-align:center">${l1}</th><th style="text-align:center">${l2}</th><th style="text-align:center">Change</th></tr></thead><tbody>${rows}</tbody></table>`);
  destroyChart('cmp');
  const ctx=$id('cmpChart'); if(!ctx) return;
  charts.cmp=new Chart(ctx,{type:'bar',data:{labels:members.map(m=>m.name),datasets:[{label:l1,data:members.map(m=>kpiHistory[m.id]?.[k1]??calcKpi(m.id).total),backgroundColor:'rgba(127,119,221,.75)',borderRadius:4,borderSkipped:false},{label:l2,data:members.map(m=>kpiHistory[m.id]?.[k2]??calcKpi(m.id).total),backgroundColor:'rgba(29,158,117,.75)',borderRadius:4,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#888780',font:{size:11}}}},scales:{y:{min:0,max:100,ticks:{callback:v=>v+'%',color:'#888780'},grid:{color:'rgba(136,135,128,.1)'}},x:{ticks:{color:'#888780'},grid:{display:false}}}}});
}

/* ══════════════════════════════════════════════════════════════
   11. CLIENT TABLE
══════════════════════════════════════════════════════════════ */
function renderClientTable() {
  const tbody=$id('clients-tbody'); if(!tbody) return;

  tbody.innerHTML=clients.map(c=>{
    const aNames=c.assigned.map(id=>members.find(m=>m.id===id)?.name||id).join(', ');
    const ct=clientTotals(c);
    const r=ct.resultsRate;                          // avg-of-pct
    const achB=ct.tS>0?achBadge(r,'achieved'):'';   // show when any spend exists
    return `<tr data-cid="${c.id}">
      <td><span class="cl-link" data-cid="${c.id}">${c.name}</span> ${achB}</td>
      <td class="muted">${c.industry||'—'}</td>
      <td>${statusBadge(c.status)}</td>
      <td><strong>${fmt(c.budget)}</strong> <span class="muted" style="font-size:11px">${APP.sym}</span></td>
      <td class="muted">${c.start||'—'}</td>
      <td>${aNames.split(', ').map(n=>`<span class="chip">${n}</span>`).join('')}</td>
      <td>${satBadge(c.satisfaction)}</td>
      <td>
        <div class="act-wrap">
          <button class="act-btn act-view" data-act="view" data-cid="${c.id}" aria-label="View profile">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            View Profile
          </button>
          <button class="act-btn act-del" data-act="del" data-cid="${c.id}" aria-label="Delete client">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
            Delete
          </button>
        </div>
      </td>
    </tr>`;
  }).join('');

  /* Delegated click handler — works for ALL clients including newly added ones */
  tbody.onclick=function(e){
    const link=e.target.closest('.cl-link[data-cid]');
    if(link){ openDrawer(link.dataset.cid); return; }
    const btn=e.target.closest('button[data-act]');
    if(!btn) return;
    const id=btn.dataset.cid, act=btn.dataset.act;
    if(act==='view') openDrawer(id);
    if(act==='del')  deleteClient(id);
  };
}

/* ══════════════════════════════════════════════════════════════
   12. CLIENT DRAWER
══════════════════════════════════════════════════════════════ */
let _activeCid = null;

function openDrawer(cid) {
  if(!cid) return;
  _activeCid=cid;
  const c=clients.find(x=>x.id===cid); if(!c) return;
  const aNames=c.assigned.map(id=>members.find(m=>m.id===id)?.name||id).join(', ');
  setTxt('dr-title', c.name);
  setTxt('dr-sub',   `${c.industry||''} · ${c.id} · Assigned: ${aNames}`);
  setHTML('dr-body', buildDrawerBody(c));
  const ov=$id('cl-overlay');
  if(ov){ ov.classList.add('open'); ov.setAttribute('aria-hidden','false'); }
}

function buildDrawerBody(c) {
  const ct=clientTotals(c);
  const rR=ct.resultsRate;   // avg-of-pct across all objectives
  const sR=ct.spendRate;     // plain SAR ratio (homogeneous)

  /* Aggregated summary section */
  const summary=`
  <div>
    <div class="section-lbl mb-1">Aggregated Summary — All Platforms Combined</div>
    <div class="sum-grid mb-2">
      <div class="sum-card"><div class="sum-lbl">Target Results</div><div class="sum-val">${fmt(ct.tR)}</div></div>
      <div class="sum-card"><div class="sum-lbl">Actual Results</div><div class="sum-val ${achCls(rR)}-t">${fmt(ct.aR)}</div><div class="sum-sub">${achBadge(rR,'achieved')}</div></div>
      <div class="sum-card"><div class="sum-lbl">Target Spend</div><div class="sum-val">${fmtS(ct.tS)}</div></div>
      <div class="sum-card"><div class="sum-lbl">Actual Spend</div><div class="sum-val ${achCls(sR)}-t">${fmtS(ct.aS)}</div><div class="sum-sub">${achBadge(sR,'utilized')}</div></div>
    </div>
    <div class="sum-bars">
      <div class="sum-bar-row">
        <span class="sum-bar-lbl">Results avg</span>
        <div class="sbar-trk" style="flex:1"><div class="sbar-fill sf-${achCls(rR)}" style="width:${Math.min(rR*100,100)}%"></div></div>
        <span class="sum-bar-val">${pctF(rR*100)} avg achieved</span>
      </div>
      <div class="sum-bar-row">
        <span class="sum-bar-lbl">Spend ${APP.sym}</span>
        <div class="sbar-trk" style="flex:1"><div class="sbar-fill sf-${achCls(sR)}" style="width:${Math.min(sR*100,100)}%"></div></div>
        <span class="sum-bar-val">${fmtS(ct.aS)} / ${fmtS(ct.tS)}</span>
      </div>
    </div>
  </div>
  <hr class="divider"/>`;

  /* Platform cards with per-objective input rows */
  const platHTML=c.platforms.map((p,pIdx)=>{
    const ps=platStats(p);
    // resultsAvgRate = avg-of-pct (correct composite metric)
    // spendRate      = plain SAR ratio
    const overallRate=(ps.resultsAvgRate + ps.spendRate)/2;

    /* Per-objective rows — each shows its own % badge */
    const objRows=(p.objectives||[]).map((o,oIdx)=>{
      const or=o.targetResults>0 ? o.actualResults/o.targetResults : 0;
      const os=o.targetSpend>0   ? o.actualSpend/o.targetSpend     : 0;
      // Individual objective achievement badge (results %)
      const objPctBadge=o.targetResults>0
        ? `<span class="ach-badge ach-${achCls(or)}" style="font-size:10px;margin-left:6px">${pctF(or*100)} results</span>`
        : '';
      return `
      <div class="obj-row" id="objrow-${c.id}-${pIdx}-${oIdx}">
        <div class="obj-row-hdr">
          <div class="obj-row-name">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${o.name}
            ${objPctBadge}
            ${platPerfBadge(or)}
          </div>
          <button class="obj-row-del" onclick="removeObjRow('${c.id}',${pIdx},${oIdx})" title="Remove objective" aria-label="Remove ${o.name}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="obj-metrics">
          <div class="obj-metric-cell">
            <div class="obj-metric-lbl">Target Results</div>
            <input class="obj-metric-inp" type="number" value="${o.targetResults}" min="0"
              onchange="updateObjField('${c.id}',${pIdx},${oIdx},'targetResults',this.value)">
          </div>
          <div class="obj-metric-cell">
            <div class="obj-metric-lbl">Actual Results</div>
            <input class="obj-metric-inp ${achCls(or)}-t" type="number" value="${o.actualResults}" min="0"
              onchange="updateObjField('${c.id}',${pIdx},${oIdx},'actualResults',this.value)">
          </div>
          <div class="obj-metric-cell">
            <div class="obj-metric-lbl">Target Spend (${APP.sym})</div>
            <input class="obj-metric-inp" type="number" value="${o.targetSpend}" min="0"
              onchange="updateObjField('${c.id}',${pIdx},${oIdx},'targetSpend',this.value)">
          </div>
          <div class="obj-metric-cell">
            <div class="obj-metric-lbl">Actual Spend (${APP.sym})</div>
            <input class="obj-metric-inp ${achCls(os)}-t" type="number" value="${o.actualSpend}" min="0"
              onchange="updateObjField('${c.id}',${pIdx},${oIdx},'actualSpend',this.value)">
          </div>
        </div>
      </div>`;
    }).join('');

    /* Suggestions — filter already-added */
    const addedNames=(p.objectives||[]).map(o=>o.name);
    const suggs=SUGGESTED_OBJ.filter(s=>!addedNames.includes(s)).slice(0,7)
      .map(s=>`<span class="obj-sugg" onclick="addObjByName('${c.id}',${pIdx},'${s}')">${s}</span>`).join('');

    return `
    <div class="plat-card" id="plat-${c.id}-${pIdx}">
      <div class="plat-hdr">
        <div>
          <div class="plat-name">${p.name} ${platPerfBadge(overallRate)}</div>
          <div class="muted" style="font-size:11px;margin-top:2px">${(p.objectives||[]).map(o=>o.name).join(', ')||'No objectives'}</div>
        </div>
        <button class="act-btn act-del" onclick="removePlatform('${c.id}',${pIdx})" style="padding:3px 8px;font-size:11px" aria-label="Remove platform">Remove</button>
      </div>

      <!-- Add new objective -->
      <div class="obj-editor">
        <div class="obj-editor-lbl">Campaign Objectives — each generates its own metrics row</div>
        <div class="obj-sugg-row">${suggs}</div>
        <div class="obj-add-row">
          <input class="obj-add-inp" id="obj-inp-${c.id}-${pIdx}" placeholder="Type custom objective + Enter"
            onkeydown="if(event.key==='Enter'){event.preventDefault();addObjFromInput('${c.id}',${pIdx});}">
          <button class="btn btn-xs btn-primary" onclick="addObjFromInput('${c.id}',${pIdx})">+ Add</button>
        </div>
      </div>

      <!-- Per-objective metric rows -->
      <div class="obj-rows">${objRows||'<div class="muted" style="font-size:12px;padding:8px 0">No objectives yet — add one above to unlock metric inputs.</div>'}</div>

      <!-- Platform totals (auto-aggregated) -->
      ${ps.totalTS>0?`
      <div class="plat-totals">
        <div class="plat-totals-lbl">
          Platform Totals — Auto-Aggregated
          <span style="font-weight:400;font-size:9px;opacity:.75;margin-left:6px">
            Results % = avg of objective achievement rates (not raw sum)
          </span>
        </div>
        <div class="plat-totals-grid">
          <div class="pt-cell">
            <div class="pt-lbl">Results Avg Achievement</div>
            <div class="pt-val" style="font-size:16px">${pctF(ps.resultsAvgRate*100)}</div>
          </div>
          <div class="pt-cell">
            <div class="pt-lbl">Active Objectives</div>
            <div class="pt-val">${(p.objectives||[]).filter(o=>o.targetResults>0).length} with targets</div>
          </div>
          <div class="pt-cell">
            <div class="pt-lbl">Target Spend</div>
            <div class="pt-val">${fmtS(ps.totalTS)}</div>
          </div>
          <div class="pt-cell">
            <div class="pt-lbl">Actual Spend</div>
            <div class="pt-val">${fmtS(ps.totalAS)} <span style="font-size:10px;opacity:.8">(${pctF(ps.spendRate*100)})</span></div>
          </div>
        </div>
      </div>`:''}

      <!-- Progress bars using corrected rates -->
      ${ps.totalTS>0?`
      <div class="plat-bars">
        <div class="sbar-row">
          <div class="sbar-lbl">Results avg</div>
          <div class="sbar-trk"><div class="sbar-fill sf-${achCls(ps.resultsAvgRate)}" style="width:${Math.min(ps.resultsAvgRate*100,100)}%"></div></div>
          <div class="sbar-val">${pctF(ps.resultsAvgRate*100)} avg</div>
        </div>
        <div class="sbar-row">
          <div class="sbar-lbl">Spend ${APP.sym}</div>
          <div class="sbar-trk"><div class="sbar-fill sf-${achCls(ps.spendRate)}" style="width:${Math.min(ps.spendRate*100,100)}%"></div></div>
          <div class="sbar-val">${fmtS(ps.totalAS)} / ${fmtS(ps.totalTS)}</div>
        </div>
      </div>`:''}
    </div>`;
  }).join('');

  return summary+`
  <div>
    <div class="section-lbl mb-1" style="margin-bottom:.5rem">Platform Performance
      <span class="muted" style="font-weight:400;text-transform:none;font-size:11px"> — edit any field · changes save on "Save All"</span>
    </div>
    ${platHTML}
    <button class="btn btn-outline" style="width:100%;justify-content:center;margin-top:.75rem" onclick="addPlatform('${c.id}')">+ Add Platform</button>
  </div>
  <button class="btn-save-all btn" onclick="saveAllChanges('${c.id}')">Save All Changes & Recalculate KPIs</button>`;
}

/* ── Objective field update (immediate, no buffer) ── */
function updateObjField(cid, pIdx, oIdx, field, value) {
  const c=clients.find(x=>x.id===cid); if(!c) return;
  c.platforms[pIdx].objectives[oIdx][field] = parseFloat(value)||0;
}

/* ── Save all & live refresh ── */
function saveAllChanges(cid) {
  renderMetricCards();
  renderSpendBars();
  renderKpiMini();
  renderInsights();
  renderKpiCards();
  refreshTeamChart();
  /* Re-open drawer to reflect updated aggregates */
  openDrawer(cid);
}

/* ── Add objective by name (from suggestion chip or input) ── */
function addObjByName(cid, pIdx, name) {
  const c=clients.find(x=>x.id===cid); if(!c) return;
  if(!c.platforms[pIdx].objectives) c.platforms[pIdx].objectives=[];
  if(c.platforms[pIdx].objectives.some(o=>o.name===name)) return; // no dupe
  c.platforms[pIdx].objectives.push({ name, targetResults:0, actualResults:0, targetSpend:0, actualSpend:0 });
  openDrawer(cid);
}

function addObjFromInput(cid, pIdx) {
  const inp=$id(`obj-inp-${cid}-${pIdx}`); if(!inp) return;
  const name=inp.value.trim(); if(!name) return;
  inp.value='';
  addObjByName(cid, pIdx, name);
}

function removeObjRow(cid, pIdx, oIdx) {
  const c=clients.find(x=>x.id===cid); if(!c) return;
  c.platforms[pIdx].objectives.splice(oIdx,1);
  openDrawer(cid);
}

/* ── Platform CRUD ── */
function addPlatform(cid) {
  const c=clients.find(x=>x.id===cid); if(!c) return;
  const name=prompt('Platform name (e.g. Meta, Google Ads, TikTok, Snapchat):','');
  if(!name?.trim()) return;
  c.platforms.push({ name:name.trim(), objectives:[] });
  openDrawer(cid);
}
function removePlatform(cid, pIdx) {
  const c=clients.find(x=>x.id===cid); if(!c) return;
  if(!confirm(`Remove platform "${c.platforms[pIdx].name}" and all its objectives?`)) return;
  c.platforms.splice(pIdx,1);
  openDrawer(cid);
}

/* ── Drawer edit/delete buttons ── */
function editActive()   { if(_activeCid){ closeDrawer(null,true); openEditModal(_activeCid); } }
function deleteActive() { if(_activeCid) deleteClient(_activeCid); }

function closeDrawer(e, force) {
  const ov=$id('cl-overlay'); if(!ov) return;
  if(force||e?.target===ov){ ov.classList.remove('open'); ov.setAttribute('aria-hidden','true'); _activeCid=null; }
}

/* ══════════════════════════════════════════════════════════════
   13. CLIENT CRUD
══════════════════════════════════════════════════════════════ */
let _editId=null;

function openNewClientModal() {
  _editId=null;
  setTxt('cf-title','New Client');
  const f=$id('cf-form'); if(f) f.reset();
  setVal('cf-eid','');
  const ov=$id('cf-overlay'); if(ov) ov.classList.add('open');
}

function openEditModal(cid) {
  _editId=cid;
  const c=clients.find(x=>x.id===cid); if(!c) return;
  setTxt('cf-title','Edit Client');
  setVal('cf-eid',      c.id);
  setVal('cf-name',     c.name);
  setVal('cf-industry', c.industry||'');
  setVal('cf-status',   c.status||'');
  setVal('cf-budget',   c.budget);
  setVal('cf-start',    c.start||'');
  setVal('cf-assigned', c.assigned.join(', '));
  setVal('cf-sat',      c.satisfaction||'');
  const ov=$id('cf-overlay'); if(ov) ov.classList.add('open');
}

function saveCF() {
  const name=getVal('cf-name').trim(); if(!name){ alert('Client name is required.'); return; }
  const industry=getVal('cf-industry').trim();
  const status=getVal('cf-status');
  const budget=parseFloat(getVal('cf-budget'))||0;
  const start=getVal('cf-start');
  const sat=getVal('cf-sat');
  const assigned=getVal('cf-assigned').split(',').map(s=>s.trim()).filter(Boolean);

  if(_editId){
    const c=clients.find(x=>x.id===_editId); if(!c) return;
    Object.assign(c,{name,industry,status:status||null,budget,start,assigned,satisfaction:sat||null});
  } else {
    const newId=`CL-${String(_clientCounter++).padStart(3,'0')}`;
    clients.push({id:newId,name,industry,status:status||null,budget,start,assigned,satisfaction:sat||null,platforms:[]});
    assigned.forEach(aid=>{ const m=members.find(x=>x.id===aid); if(m&&!m.clients.includes(newId)) m.clients.push(newId); });
  }
  closeCF();
  renderClientTable();
  renderKpiCards();
  renderMetricCards();
}

function closeCF() { const ov=$id('cf-overlay'); if(ov) ov.classList.remove('open'); }

function deleteClient(cid) {
  const c=clients.find(x=>x.id===cid); if(!c) return;
  if(!confirm(`Delete client "${c.name}"?\nThis cannot be undone.`)) return;
  clients.splice(clients.findIndex(x=>x.id===cid),1);
  members.forEach(m=>{ m.clients=m.clients.filter(id=>id!==cid); });
  closeDrawer(null,true);
  renderClientTable();
  renderKpiCards();
  renderMetricCards();
}

/* ══════════════════════════════════════════════════════════════
   14. KPI CARDS — with performance status badges
══════════════════════════════════════════════════════════════ */
function renderKpiCards() {
  const grid=$id('kpi-grid'); if(!grid) return;
  grid.innerHTML=members.map(m=>{
    const k=calcKpi(m.id);
    const col=MEMBER_COLORS[m.id]||'#378ADD';
    const lvlCls=m.level==='Senior'?'lvl-senior':m.level==='Mid-Level'?'lvl-mid':'lvl-junior';
    const statusBadgeHTML=kpiStatusBadge(k.total);
    return `
    <div class="kpi-card" onclick="openKpiModal('${m.id}')" role="button" tabindex="0" aria-label="View KPI detail for ${m.name}"
         onkeydown="if(event.key==='Enter')openKpiModal('${m.id}')">
      <div class="kc-hdr">
        ${avEl(m.color,m.av)}
        <div class="kc-info">
          <div class="kc-name">${m.name}</div>
          <div class="kc-lvl">${m.level}</div>
          ${statusBadgeHTML}
        </div>
        <span class="lvl-pill ${lvlCls}" style="font-size:10px;padding:3px 7px">${m.level}</span>
      </div>
      <div class="kc-big" style="color:${col}">${k.total}<span class="kc-unit">%</span></div>
      <div class="prog-trk" style="margin-bottom:8px"><div class="prog-fill pf-${m.color}" style="width:${k.total}%"></div></div>
      <div class="kc-split"><span>Section A (Results): ${pct(k.sectionA)}</span><span>Section B (Ops): ${pct(k.sectionB)}</span></div>
      <div class="kc-chips">${clients.filter(c=>m.clients.includes(c.id)).map(c=>`<span class="chip">${c.name}</span>`).join('')}</div>
    </div>`;
  }).join('');
}

/* ══════════════════════════════════════════════════════════════
   15. KPI MODAL
══════════════════════════════════════════════════════════════ */
let _openMid=null;

function openKpiModal(memberId) {
  _openMid=memberId;
  _renderKpiModal(memberId);
  const ov=$id('kpi-overlay'); if(ov) ov.classList.add('open');
}

function _renderKpiModal(memberId) {
  const m=members.find(x=>x.id===memberId);
  const k=calcKpi(memberId);
  const col=MEMBER_COLORS[memberId]||'#378ADD';
  const cfg=LEVEL_CFG[m.level];
  const noteKey=`${memberId}-${mkey(state.month,state.year)}`;
  const note=managerNotes[noteKey]||'';

  setTxt('kpi-modal-title',`${m.name} — Individual Performance`);

  const aRows=k.breakdown.map(({client:c,cTS,cTR,cAR,weight,rawRate,adjRate,contrib})=>{
    const cls=achCls(adjRate);
    return `<tr><td><strong>${c.name}</strong></td><td>${fmtS(cTS)}</td><td>${pctF(weight*100,1)}</td><td>${fmt(cAR)} / ${fmt(cTR)}</td><td class="muted">${pctF(rawRate*100,1)}</td><td class="${cls}-t"><strong>${pctF(adjRate*100,1)}</strong></td><td>${contrib.toFixed(1)} pts</td></tr>`;
  }).join('');

  const sc=opsScores[memberId]||{};
  const bRows=OPS_LABELS.map((label,i)=>{
    let tot=0,cnt=0;
    m.clients.forEach(cid=>{ if(sc[cid]){ tot+=sc[cid][i]; cnt++; } });
    const avg=cnt>0?tot/cnt:0;
    const stars=[1,2,3,4,5].map(v=>`<button class="star-btn ${Math.round(avg)>=v?'on':''}" onclick="setOpsAll('${memberId}',${i},${v})" title="${v}/5" aria-label="Set ${label} to ${v} stars">★</button>`).join('');
    return `<div class="ops-row"><div class="ops-lbl">${label}</div><div class="ops-stars">${stars}<span class="ops-avg">${avg.toFixed(1)}/5</span></div></div>`;
  }).join('');

  const perClientOps=m.clients.map(cid=>{
    const cl=clients.find(x=>x.id===cid); if(!cl) return '';
    return `<div class="per-cl-ops"><div class="per-cl-name">${cl.name}</div>${OPS_LABELS.map((lbl,i)=>{
      const v=(sc[cid]||[])[i]||0;
      const stars=[1,2,3,4,5].map(sv=>`<button class="star-btn star-sm ${v>=sv?'on':''}" onclick="setOpsClient('${memberId}','${cid}',${i},${sv})" title="${lbl} ${sv}/5">★</button>`).join('');
      return `<div class="pc-row"><span class="pc-lbl muted">${lbl}</span><span style="display:flex;align-items:center;gap:1px">${stars}<span class="muted" style="font-size:10px;margin-left:4px">${v}/5</span></span></div>`;
    }).join('')}</div>`;
  }).join('');

  setHTML('kpi-modal-body',`
    <div class="lvl-banner ${cfg.bannerCls}"><strong>${m.level} — ${cfg.label}</strong>Threshold: ${Math.round(cfg.fullAt*100)}% of target = 100% of Section A points.</div>
    <div class="grid-3 mb-2">
      <div class="metric-mini"><div class="sum-lbl">Total KPI Score</div><div style="font-size:22px;font-weight:700;color:${col}">${pct(k.total)}</div>${kpiStatusBadge(k.total)}</div>
      <div class="metric-mini"><div class="sum-lbl">Section A — Results (70%)</div><div style="font-size:22px;font-weight:700">${pct(k.sectionA)}</div><div class="sum-sub">Spend-weighted, level-adjusted</div></div>
      <div class="metric-mini"><div class="sum-lbl">Section B — Ops (30%)</div><div style="font-size:22px;font-weight:700">${pct(k.sectionB)}</div><div class="sum-sub">Manager-graded</div></div>
    </div>
    <div class="prog-trk mb-2" style="height:10px"><div class="prog-fill" style="width:${k.total}%;background:${col}"></div></div>

    <div class="modal-sec">Section A — Client Results & Spend<span class="sub">(70% weight · all spend in ${APP.sym})</span></div>
    <div style="overflow-x:auto;margin-bottom:1rem">
      <table><thead><tr><th>Client</th><th>Target Spend</th><th>Weight</th><th>Results Actual/Target</th><th>Raw Rate</th><th>Adj. Rate (${m.level})</th><th>KPI Points</th></tr></thead><tbody>${aRows}</tbody></table>
    </div>
    <div class="info-box mb-2">Formula: Adj. Rate = min(Actual ÷ Target ÷ ${cfg.fullAt}, 1.0) · Points = Weight × Adj. Rate × 70</div>

    <div class="modal-sec">Section B — Operational Matrix<span class="sub">(30% weight · click stars to grade · applies to all clients)</span></div>
    <div style="margin-bottom:1rem">${bRows}</div>
    <div class="info-box mb-2">Averaged across all assigned clients. Use per-client scoring below for granular control.</div>

    <div class="modal-sec">Per-Client Detailed Ops Scoring</div>
    <div class="mb-2">${perClientOps}</div>

    <div class="modal-sec">Manager's Monthly Evaluation Notes<span class="sub">(${MONTHS[state.month-1]} ${state.year} · auto-saves)</span></div>
    <textarea class="mgr-notes" id="mgr-notes-${memberId}" placeholder="Write evaluation notes for ${m.name} this month…" oninput="saveNote('${memberId}')">${note}</textarea>
    <div class="info-box mt-1">Notes stored per member per month throughout the session.</div>
  `);
}

function setOpsAll(memberId, idx, val) {
  const m=members.find(x=>x.id===memberId); if(!m) return;
  if(!opsScores[memberId]) opsScores[memberId]={};
  m.clients.forEach(cid=>{ if(!opsScores[memberId][cid]) opsScores[memberId][cid]=[3,3,3,3,3,3]; opsScores[memberId][cid][idx]=val; });
  _renderKpiModal(memberId); renderKpiCards(); renderMetricCards(); refreshTeamChart();
}

function setOpsClient(memberId, cid, idx, val) {
  if(!opsScores[memberId]) opsScores[memberId]={};
  if(!opsScores[memberId][cid]) opsScores[memberId][cid]=[3,3,3,3,3,3];
  opsScores[memberId][cid][idx]=val;
  _renderKpiModal(memberId); renderKpiCards(); renderMetricCards(); refreshTeamChart();
}

function saveNote(memberId) {
  const key=`${memberId}-${mkey(state.month,state.year)}`;
  const el=$id(`mgr-notes-${memberId}`); if(el) managerNotes[key]=el.value;
}

function closeKpiModal(e, force) {
  const ov=$id('kpi-overlay'); if(!ov) return;
  if(force||e?.target===ov){ ov.classList.remove('open'); _openMid=null; }
}

/* ══════════════════════════════════════════════════════════════
   16. TEAM DASHBOARD
══════════════════════════════════════════════════════════════ */
function renderTeamMetrics() {
  let totAS=0,totAR=0,totTR=0;
  clients.forEach(c=>{ const ct=clientTotals(c); totAS+=ct.aS; totAR+=ct.aR; totTR+=ct.tR; });
  const avg=Math.round(members.reduce((s,m)=>s+calcKpi(m.id).total,0)/members.length);
  const sat=clients.filter(c=>c.satisfaction==='Satisfied').length;
  setHTML('t-spend',       fmtS(totAS));
  setHTML('t-results',     fmt(totAR));
  setHTML('t-results-sub', `vs ${fmt(totTR)} target`);
  setHTML('t-kpi-avg',     pct(avg));
  setHTML('t-sat',         `${sat} / ${clients.length}`);
}

/* ══════════════════════════════════════════════════════════════
   17. CHARTS
══════════════════════════════════════════════════════════════ */
const charts={};
function destroyChart(k){ if(charts[k]){ charts[k].destroy(); delete charts[k]; } }
const GC='rgba(136,135,128,.1)', TC='#888780';

function initDashCharts() {
  destroyChart('trend');
  const ctx=$id('trendChart'); if(!ctx) return;
  charts.trend=new Chart(ctx,{type:'line',data:{labels:['Jan','Feb','Mar','Apr','May','Jun'],datasets:[{label:`Total Spend (${APP.sym})`,data:[140000,155000,168000,180000,191000,194320],borderColor:'#378ADD',backgroundColor:'rgba(55,138,221,.07)',fill:true,tension:.4,pointRadius:5,pointBackgroundColor:'#378ADD',pointBorderColor:'#fff',pointBorderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{ticks:{callback:v=>`${(v/1000).toFixed(0)}k`,color:TC},grid:{color:GC}},x:{ticks:{color:TC},grid:{display:false}}}}});
}

function initTeamCharts() {
  destroyChart('team'); destroyChart('results'); destroyChart('growth');
  const tCtx=$id('teamChart');
  if(tCtx) charts.team=new Chart(tCtx,{type:'bar',data:{labels:members.map(m=>m.name),datasets:[{label:'KPI %',data:members.map(m=>calcKpi(m.id).total),backgroundColor:['#7F77DD','#1D9E75','#D85A30','#378ADD'],borderRadius:6,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{min:0,max:100,ticks:{callback:v=>v+'%',color:TC},grid:{color:GC}},x:{ticks:{color:TC},grid:{display:false}}}}});

  const rCtx=$id('resultsChart');
  if(rCtx){
    let totR=0,totT=0;
    clients.forEach(c=>{ const ct=clientTotals(c); totR+=ct.aR; totT+=ct.tR; });
    charts.results=new Chart(rCtx,{type:'doughnut',data:{labels:['Achieved','Remaining'],datasets:[{data:[totR,Math.max(totT-totR,0)],backgroundColor:['#1D9E75','rgba(136,135,128,.15)'],borderWidth:0,hoverOffset:4}]},options:{responsive:true,maintainAspectRatio:false,cutout:'72%',plugins:{legend:{labels:{color:TC,font:{size:11},usePointStyle:true}}},layout:{padding:8}}});
  }

  const gCtx=$id('growthChart');
  if(gCtx) charts.growth=new Chart(gCtx,{type:'line',data:{labels:['Apr','May','Jun'],datasets:[{label:'Hassan',data:[82,85,88],borderColor:'#7F77DD',tension:.4,pointRadius:5,pointBackgroundColor:'#7F77DD',pointBorderColor:'#fff',pointBorderWidth:2,borderDash:[]},{label:'Dalia',data:[80,83,85],borderColor:'#1D9E75',tension:.4,pointRadius:5,pointBackgroundColor:'#1D9E75',pointBorderColor:'#fff',pointBorderWidth:2,borderDash:[5,4]},{label:'Engy',data:[72,76,79],borderColor:'#D85A30',tension:.4,pointRadius:5,pointBackgroundColor:'#D85A30',pointBorderColor:'#fff',pointBorderWidth:2,borderDash:[2,3]},{label:'Ahmed',data:[65,69,73],borderColor:'#378ADD',tension:.4,pointRadius:5,pointBackgroundColor:'#378ADD',pointBorderColor:'#fff',pointBorderWidth:2,borderDash:[8,4]}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:TC,font:{size:11},usePointStyle:true}}},scales:{y:{min:60,max:100,ticks:{callback:v=>v+'%',color:TC},grid:{color:GC}},x:{ticks:{color:TC},grid:{display:false}}}}});
}

function refreshTeamChart() {
  if(!charts.team) return;
  charts.team.data.datasets[0].data=members.map(m=>calcKpi(m.id).total);
  charts.team.update();
}

/* ══════════════════════════════════════════════════════════════
   18. INTEGRATIONS
══════════════════════════════════════════════════════════════ */
let _tokShown=false;
function toggleToken(){
  _tokShown=!_tokShown;
  setHTML('token-val',_tokShown?APP.token:'sk_live_••••••••••••••••••••••••••••');
  setTxt('btn-tok-tog',_tokShown?'Hide':'Reveal');
}
function copyText(text,btnId){
  navigator.clipboard.writeText(text).then(()=>{
    const b=$id(btnId); if(!b) return;
    const o=b.textContent; b.textContent='✓ Copied!';
    setTimeout(()=>{ b.textContent=o; },2000);
  }).catch(()=>alert('Copy failed — please copy manually.'));
}
function simulateWebhook(){
  const cid=getVal('sim-client');
  const spend=parseFloat(getVal('sim-spend'))||0;
  const results=parseInt(getVal('sim-results'),10)||0;
  const c=clients.find(x=>x.id===cid);
  if(c?.platforms[0]?.objectives[0]){
    c.platforms[0].objectives[0].actualSpend=spend;
    c.platforms[0].objectives[0].actualResults=results;
  }
  setHTML('wh-response',`<div class="resp-ok">✓ <div><strong>Payload received for ${c?.name||cid}</strong><br>Spend → ${fmtS(spend)}, Results → ${fmt(results)}. KPIs recalculated live.</div></div>`);
  renderMetricCards(); renderSpendBars(); renderKpiMini(); renderInsights(); renderKpiCards(); refreshTeamChart();
}

/* ══════════════════════════════════════════════════════════════
   19. DARK MODE
══════════════════════════════════════════════════════════════ */
function toggleDark(){
  document.documentElement.classList.toggle('dark');
  const btn=$id('dark-btn');
  if(btn) btn.innerHTML=document.documentElement.classList.contains('dark')
    ?`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
    :`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
}

/* ══════════════════════════════════════════════════════════════
   20. INIT
══════════════════════════════════════════════════════════════ */
function init(){
  document.querySelectorAll('.nav-item[data-page]').forEach(el=>{
    el.addEventListener('click',()=>nav(el.dataset.page));
  });
  setTxt('period-tag',`${MONTHS[state.month-1]} ${state.year}`);
  renderDashboard();
  renderClientTable();
  renderKpiCards();
  setTimeout(initDashCharts,60);
}

document.addEventListener('DOMContentLoaded',init);
