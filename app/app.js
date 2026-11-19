import { readProgress, saveProgress, exportProgress, importProgress } from './progress.js';
import { renderPlatinumRoadmap } from './roadmap.js';
const $ = selector => document.querySelector(selector);
const escapeText = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const state = readProgress();
const filters = { kind: 'all', grade: 'all', status: 'all', search: '' };
let trophies = [];
let selectedId = 28;
const isShielded = trophy => state.spoilers && trophy.kind === 'story' && !state.earned.has(trophy.name);
let toastTimeout;
function notify(message) {
  clearTimeout(toastTimeout);
  $('#toast').textContent = message;
  $('#toast').classList.add('visible');
  toastTimeout = setTimeout(() => $('#toast').classList.remove('visible'), 4200);
}
function persistProgress() { const saved = saveProgress(state); $('#save-state').textContent = saved ? '● Saved on this device' : '⚠ Storage unavailable · export a backup'; }
function updateProgressHeader() {
  const earned = state.earned.size;
  $('#earned-count').textContent = earned;
  $('#percent').textContent = Math.round(earned / 55 * 100) + '%';
  $('#progress-fill').style.width = earned / 55 * 100 + '%';
  $('.progress-track').setAttribute('aria-valuenow', earned);
  $('#grade-counts').innerHTML = ['platinum','gold','silver','bronze'].map(grade => {
    const group = trophies.filter(t => t.grade === grade);
    return `<div class="grade-stat ${grade}"><span class="grade-icon">♜</span><div><strong>${group.filter(t => state.earned.has(t.name)).length}<small> / ${group.length}</small></strong><span>${grade}</span></div></div>`;
  }).join('');
}
function filteredTrophies() {
  return trophies.filter(t => {
    const searchable = isShielded(t) ? 'hidden story trophy story' : `${t.name} ${t.description} ${t.guide}`;
    return (filters.kind === 'all' || t.kind === filters.kind) && (filters.grade === 'all' || t.grade === filters.grade) && (filters.status === 'all' || state.earned.has(t.name) === (filters.status === 'earned')) && searchable.toLowerCase().includes(filters.search.toLowerCase());
  }).sort((a,b) => (a.id === 1 ? -1 : b.id === 1 ? 1 : a.id === 28 ? -1 : b.id === 28 ? 1 : a.id - b.id));
}
function renderTrophyChecklist() {
  const visible = filteredTrophies();
  $('#result-count').textContent = visible.length;
  $('#trophy-list').innerHTML = visible.map(t => {
    const shielded = isShielded(t), earned = state.earned.has(t.name);
    return `<article class="trophy-row ${selectedId === t.id ? 'selected' : ''} ${earned ? 'earned' : ''}"><input class="earn-checkbox" type="checkbox" data-earn="${t.id}" ${earned?'checked':''} aria-label="Mark ${shielded?'hidden story trophy':escapeText(t.name)} earned"><button class="trophy-open" data-open="${t.id}"><span class="trophy-name">${shielded ? 'Hidden story trophy' : escapeText(t.name)} ${t.missable?'<span class="badge">MISSABLE</span>':''}</span><span class="trophy-description">${shielded?'Protected until earned · reveal with Spoiler shield':escapeText(t.description)}</span></button><span class="grade-label ${t.grade}"><span>♜</span> ${t.grade}</span><span class="row-arrow">↗</span></article>`;
  }).join('') || `<div class="empty-state"><strong>${filters.kind === 'online' ? 'All Leonida. No online trophies.' : 'No trophies match this view.'}</strong><p>${filters.kind === 'online' ? 'Every one of the 55 trophies can be earned offline.' : 'Try another filter or clear your search.'}</p><button id="clear-filters">Clear filters</button></div>`;
}
function renderTrophyGuide() {
  const t = trophies.find(t => t.id === selectedId) || trophies[0];
  const shielded = isShielded(t);
  const sources = t.sources.map(s => `<a href="${escapeText(s.url)}" target="_blank" rel="noopener noreferrer">${escapeText(s.name)} <span>↗</span></a>`).join('');
  const paragraphs = t.guide.match(/[^.!?]+(?:[.!?]+|$)/g) || [t.guide];
  const split = t.id === 28 ? [paragraphs.slice(0,1).join(''), paragraphs.slice(1,4).join(''), paragraphs.slice(4).join('')] : [paragraphs.slice(0,2).join(''), paragraphs.slice(2).join('')];
  $('#guide-panel').innerHTML = `<div class="guide-top"><span>FIELD NOTES / ${String(t.id).padStart(2,'0')}</span><span class="grade-label ${t.grade}">♜ ${t.grade}</span></div><div class="guide-body"><span class="guide-category">${t.missable?'⚠ THE ONLY MISSABLE':t.kind.toUpperCase() + (t.hidden?' / HIDDEN ON PS5':'')}</span><h2>${shielded?'Hidden story trophy':escapeText(t.name)}</h2><p class="official-description">${shielded?'Earn this trophy or turn off Spoiler shield to reveal its details.':escapeText(t.description)}</p>${shielded?'<div class="guide-warning">Your story stays yours.<br>Names, requirements and guide notes are protected.</div>':`${t.missable?'<div class="guide-warning"><b>CHAPTER 1 · DO NOT LEAVE WITHOUT IT</b><span>18 meditation spots. One disappearing opportunity.</span></div>':''}<h3>The field guide</h3>${split.filter(Boolean).map(p=>`<p class="guide-copy">${escapeText(p.trim())}</p>`).join('')}<div class="sources"><span class="tiny">SOURCES / FOLLOW TO OPEN</span>${sources}</div>`}<button class="complete-button" data-toggle="${t.id}">${state.earned.has(t.name)?'✓ Earned · mark as unearned':'+ Mark trophy as earned'}</button></div>`;
}
function renderAll() { updateProgressHeader(); renderTrophyChecklist(); renderTrophyGuide(); }
function setEarned(id) { const t = trophies.find(t=>t.id===id); if (!t) return; state.earned.has(t.name) ? state.earned.delete(t.name) : state.earned.add(t.name); persistProgress(); renderAll(); }
function applyRoute() {
  const route = location.hash.slice(1);
  const roadmap = route === 'roadmap';
  document.body.classList.toggle('guide-focused', route.startsWith('trophy-'));
  $('#checklist-view').hidden = roadmap; $('#roadmap-view').hidden = !roadmap;
  document.querySelectorAll('[data-nav]').forEach(el => el.classList.toggle('active',el.dataset.nav === (roadmap?'roadmap':'checklist')));
  if (route.startsWith('trophy-')) { window.scrollTo(0,0); const id = Number(route.slice(7)); if(trophies.some(t=>t.id===id)) selectedId=id; }
  renderTrophyChecklist(); renderTrophyGuide();
}
document.addEventListener('click', event => {
  const open = event.target.closest('[data-open]'); if(open) { selectedId=Number(open.dataset.open); const hash='#trophy-'+selectedId; if(location.hash===hash) applyRoute(); else location.hash=hash; }
  const toggle = event.target.closest('[data-toggle]'); if(toggle) setEarned(Number(toggle.dataset.toggle));
  const kind = event.target.closest('[data-kind]'); if(kind) { filters.kind=kind.dataset.kind; document.querySelectorAll('[data-kind]').forEach(b=>b.classList.toggle('active',b===kind)); renderTrophyChecklist(); }
  if(event.target.id==='clear-filters') { Object.assign(filters,{kind:'all',grade:'all',status:'all',search:''}); $('#search').value=''; $('#grade').value='all'; $('#status').value='all'; document.querySelectorAll('[data-kind]').forEach(b=>b.classList.toggle('active',b.dataset.kind==='all'));renderTrophyChecklist(); }
});
$('#trophy-list').addEventListener('change',event=>{if(event.target.dataset.earn)setEarned(Number(event.target.dataset.earn));});
$('#search').addEventListener('input',event=>{filters.search=event.target.value;renderTrophyChecklist();});
for(const key of ['grade','status']) $('#'+key).addEventListener('change',event=>{filters[key]=event.target.value;renderTrophyChecklist();});
$('#spoilers').checked=state.spoilers;
$('#spoilers').addEventListener('change',event=>{state.spoilers=event.target.checked;persistProgress();renderAll();});
$('#export').addEventListener('click',()=>{exportProgress(state);notify('Progress exported. Keep the file as your backup.');});
$('#import-button').addEventListener('click',()=>$('#import-file').click());
$('#import-file').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;try{const value=await importProgress(file,trophies);state.earned=value.earned;if(value.spoilers!==undefined)state.spoilers=value.spoilers;$('#spoilers').checked=state.spoilers;persistProgress();renderAll();notify('Progress imported successfully.');}catch(error){notify(error.message);}event.target.value='';});
window.addEventListener('hashchange',applyRoute);
try {
  const response=await fetch('data/trophies.json');if(!response.ok)throw new Error('Trophy data could not be loaded.');
  trophies=(await response.json()).trophies;
  state.earned=new Set([...state.earned].filter(name=>trophies.some(t=>t.name===name)));
  $('#roadmap-view').innerHTML=renderPlatinumRoadmap(); renderAll(); applyRoute();
} catch(error) { $('#trophy-list').textContent=error.message+' Serve the app folder with node serve.ts.'; }
