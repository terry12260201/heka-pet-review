import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const $ = id => document.getElementById(id);

/* ---------------- 狀態：本機（這台瀏覽器）＋ 共用（status.json） ---------------- */
const LS_KEY = 'heka_beagle_review_v1';          // 沿用 V01 的 key，舊的標記不會不見
function loadState(){ try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch(e){ return {}; } }
const state = Object.assign({statuses:{}, miles:{}}, loadState());
let shared = {statuses:{}, miles:{}, queue:[]};
let toastTimer = null;
function toast(msg){
  const el = $('toast'); el.textContent = msg; el.classList.add('on');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('on'), 1800);
}
function saveState(){
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); toast('已儲存在這台瀏覽器'); }
  catch(e){ toast('這個瀏覽器不能儲存，重新整理後會還原'); }
}
function statusOf(c){
  return state.statuses[c.en] || (shared.statuses[c.en] && shared.statuses[c.en].status) || (c.tier==='REF' ? 'ref' : 'done');
}
function noteOf(c){ const s = shared.statuses[c.en]; return s && s.note ? s.note : ''; }

/* ---------------- 3D 檢視器（深炭舞台） ---------------- */
const stage = $('stage');
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
stage.appendChild(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x282627);
const camera = new THREE.PerspectiveCamera(40, 1, 0.01, 50);
camera.position.set(1.15, 0.6, 1.45);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.28, 0);
controls.enableDamping = true;
scene.add(new THREE.HemisphereLight(0xffffff, 0x3a3839, 1.15));
const sun = new THREE.DirectionalLight(0xffffff, 2.2);
sun.position.set(2, 3, 2);
scene.add(sun);
scene.add(new THREE.GridHelper(4, 20, 0x4a4849, 0x353334));

let mixer = null, actions = {}, current = null, looping = true, playing = true;
const clock = new THREE.Clock();
const playBtn = $('playBtn'), loopBtn = $('loopBtn'), speedSel = $('speedSel'), seek = $('seek');
const cmpBtn = $('cmpBtn'), cmpWrap = $('cmpwrap'), cmpVideo = $('cmpvideo');

new GLTFLoader().load('beagle.glb', (g) => {
  scene.add(g.scene);
  mixer = new THREE.AnimationMixer(g.scene);
  for (const cl of g.animations) actions[cl.name] = mixer.clipAction(cl);
  // 網址加 #clip=動畫名 可以直接開到那一支（方便貼連結給同事）
  const want = hashParam('clip');
  playClip(actions[want] ? want : 'Idle_1');
}, undefined, () => { $('nowplaying').innerHTML = '<b>模型載入失敗</b><small>重新整理再試一次；還是不行請回報。</small>'; });

function hashParam(k){ const m = location.hash.match(new RegExp(k + '=([^&]+)')); return m ? decodeURIComponent(m[1]) : ''; }

function playClip(name){
  if (!mixer || !actions[name]) return;
  if (current) actions[current].fadeOut(0.2);
  const a = actions[name];
  a.reset();
  a.setLoop(looping ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
  a.clampWhenFinished = true;
  a.fadeIn(0.2).play();
  current = name; playing = true;
  mixer.timeScale = +speedSel.value;
  playBtn.textContent = '暫停';
  const c = CLIPS.find(x => x.en === name);
  $('nowplaying').innerHTML = `<b>${c ? c.zh : name}</b><code>${name}</code>${c ? `<small>${c.desc}</small>` : ''}`;
  document.querySelectorAll('.rr-row').forEach(el => el.classList.toggle('is-active', el.dataset.en === name));
  cmpBtn.style.display = (c && c.compare) ? 'inline-flex' : 'none';
  showCompare(false);
}
function showCompare(on){
  cmpWrap.classList.toggle('on', on);
  cmpBtn.textContent = on ? '回 3D 預覽' : '對照 AI 影片';
  if (on){ const c = CLIPS.find(x => x.en === current); cmpVideo.src = c.compare; cmpVideo.play().catch(() => {}); }
  else cmpVideo.pause();
}
cmpBtn.onclick = () => showCompare(!cmpWrap.classList.contains('on'));
playBtn.onclick = () => {
  playing = !playing;
  if (mixer) mixer.timeScale = playing ? +speedSel.value : 0;
  playBtn.textContent = playing ? '暫停' : '播放';
};
$('restartBtn').onclick = () => {
  if (!current) return;
  const a = actions[current]; a.reset(); a.play(); playing = true;
  mixer.timeScale = +speedSel.value; playBtn.textContent = '暫停';
};
loopBtn.onclick = () => {
  looping = !looping;
  loopBtn.textContent = looping ? '循環：開' : '循環：關';
  loopBtn.setAttribute('aria-pressed', String(looping));
  if (current) actions[current].setLoop(looping ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
};
speedSel.onchange = () => { if (mixer && playing) mixer.timeScale = +speedSel.value; };
let scrubbing = false;
seek.oninput = () => {
  scrubbing = true;
  if (current) { const a = actions[current]; a.time = (seek.value / 1000) * a.getClip().duration; a.paused = false; }
  if (mixer) mixer.update(0);
  scrubbing = false;
};
function resize(){
  const w = stage.clientWidth, h = stage.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(stage);
(function loop(){
  requestAnimationFrame(loop);
  const dt = clock.getDelta();
  if (mixer) mixer.update(dt);
  controls.update();
  if (current){
    const a = actions[current], d = a.getClip().duration, t = a.time % (d || 1);
    if (!scrubbing) seek.value = Math.round((t / d) * 1000);
    $('timelabel').textContent = t.toFixed(2) + ' / ' + d.toFixed(2) + 's';
  }
  renderer.render(scene, camera);
})();

/* ---------------- 分頁 ---------------- */
const TABS = [['clips','動畫'],['line','生產線'],['files','下載'],['how','怎麼用']];
let tab = 'clips';
function renderTabs(){
  const n = {clips: CLIPS.length, line: (shared.queue || []).length};
  $('tabs').innerHTML = TABS.map(([k,l]) =>
    `<button class="rr-tab" role="tab" type="button" data-k="${k}" aria-selected="${tab===k}" aria-controls="p-${k}">${l}${n[k] ? `<i>${n[k]}</i>` : ''}</button>`).join('');
  $('tabs').querySelectorAll('.rr-tab').forEach(b => b.onclick = () => setTab(b.dataset.k));
  TABS.forEach(([k]) => $('p-' + k).hidden = (k !== tab));
  document.querySelectorAll('.ig-nav__link').forEach(a => a.classList.toggle('is-active', a.dataset.go === tab));
}
function setTab(k){ if (TABS.some(t => t[0] === k)) { tab = k; renderTabs(); } }
document.querySelectorAll('.ig-nav__link').forEach(a => a.onclick = (e) => { e.preventDefault(); setTab(a.dataset.go); });
$('askBtn').onclick = () => { setTab('how'); copySpell(0); };

/* ---------------- 動畫清單 ---------------- */
const filters = {tier:'ALL', status:'ALL', q:''};
const F_TIERS = [['ALL','全部'],['P0','P0 核心'],['P1','P1 補強']];
const F_STATUS = [['ALL','所有狀態'],['done','待 QA'],['qa','QA 通過'],['rework','修改中']];
function renderFilters(){
  $('filters').innerHTML =
    F_TIERS.map(([v,l]) => `<button class="rr-chip" type="button" aria-pressed="${filters.tier===v}" data-k="tier" data-v="${v}">${l}</button>`).join('') +
    '<span style="width:6px"></span>' +
    F_STATUS.map(([v,l]) => `<button class="rr-chip" type="button" aria-pressed="${filters.status===v}" data-k="status" data-v="${v}">${l}</button>`).join('');
  $('filters').querySelectorAll('.rr-chip').forEach(b => b.onclick = () => { filters[b.dataset.k] = b.dataset.v; renderFilters(); renderList(); });
}
$('q').oninput = (e) => { filters.q = e.target.value.trim(); renderList(); };

function renderStats(){
  const real = CLIPS.filter(c => c.tier !== 'REF');
  const n = s => real.filter(c => statusOf(c) === s).length;
  $('stats').innerHTML =
    `<div class="rr-stat"><b>${real.length}</b><span>支動畫</span></div>` +
    `<div class="rr-stat"><b>${n('done')}</b><span>待 QA</span></div>` +
    `<div class="rr-stat"><b>${n('qa') + n('confirmed')}</b><span>已通過</span></div>` +
    `<div class="rr-stat"><b>${n('rework')}</b><span>修改中</span></div>`;
}
function renderList(){
  const q = filters.q.toLowerCase();
  const rows = CLIPS.filter(c => {
    if (filters.tier !== 'ALL' && c.tier !== filters.tier) return false;
    if (filters.status !== 'ALL' && (c.tier === 'REF' || (filters.status === 'qa' ? !['qa','confirmed'].includes(statusOf(c)) : statusOf(c) !== filters.status))) return false;
    if (q && !(c.en.toLowerCase().includes(q) || c.zh.toLowerCase().includes(q))) return false;
    return true;
  });
  if (!rows.length){
    $('cliplist').innerHTML = `<div class="rr-empty">找不到符合的動畫。<br><button class="ig-btn ig-btn--ghost ig-btn--sm" type="button" id="clearBtn" style="margin-top:12px">清除搜尋與篩選</button></div>`;
    $('clearBtn').onclick = () => { filters.tier = 'ALL'; filters.status = 'ALL'; filters.q = ''; $('q').value = ''; renderFilters(); renderList(); };
    return;
  }
  $('cliplist').innerHTML = rows.map(c => {
    const st = statusOf(c);
    const sel = c.tier === 'REF' ? `<span class="rr-tagx">參考基準</span>`
      : `<select class="rr-status s-${st}" data-en="${c.en}" aria-label="${c.zh} 的 QA 狀態">` +
        STATUS_OPTS.map(([v,l]) => `<option value="${v}" ${v===st?'selected':''}>${l.replace('·','，')}</option>`).join('') + `</select>`;
    return `<div class="rr-row ${current===c.en?'is-active':''}" data-en="${c.en}" tabindex="0" role="button" aria-label="播放 ${c.zh}">
      <img src="thumbs/${c.en}.png" alt="" loading="lazy" width="76" height="76">
      <div>
        <h3>${c.zh}${c.tier !== 'REF' ? `<span class="rr-tagx">${c.tier}</span>` : ''}${c.method==='video' ? '<span class="rr-tagx video">照 AI 影片</span>' : ''}</h3>
        <code>${c.en} · ${c.frames} 格</code>
        <p>${c.desc}</p>
        ${noteOf(c) ? `<p class="rr-note">${noteOf(c)}</p>` : ''}
      </div>
      ${sel}
    </div>`;
  }).join('');
  $('cliplist').querySelectorAll('.rr-row').forEach(el => {
    const go = () => { playClip(el.dataset.en); if (innerWidth < 1024) document.querySelector('.rr-stage').scrollIntoView({behavior:'smooth', block:'start'}); };
    el.onclick = (e) => { if (!e.target.closest('select')) go(); };
    el.onkeydown = (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target === el) { e.preventDefault(); go(); } };
  });
  $('cliplist').querySelectorAll('select').forEach(s => s.onchange = () => {
    state.statuses[s.dataset.en] = s.value; saveState();
    s.className = 'rr-status s-' + s.value; renderStats();
  });
}

/* ---------------- 生產線 ---------------- */
function renderLine(){
  const q = shared.queue || [];
  $('queue').innerHTML = q.length ? q.map(it => {
    const at = STAGES.findIndex(s => s[0] === it.stage);
    const can = actions[it.en] || CLIPS.some(c => c.en === it.en);
    return `<div class="rr-card rr-qi">
      <div><h3>${it.zh}</h3><p>${it.info || ''}${it.note ? '｜' + it.note : ''}</p></div>
      ${can ? `<button class="ig-btn ig-btn--ghost ig-btn--sm" type="button" data-play="${it.en}">看預覽</button>` : ''}
      <div class="rr-steps">${STAGES.map((s, i) => `<div class="rr-step ${i < at ? 'done' : i === at ? 'now' : ''}">${s[1]}</div>`).join('')}</div>
    </div>`;
  }).join('') : `<div class="rr-empty">目前沒有製作中的動畫。</div>`;
  $('queue').querySelectorAll('[data-play]').forEach(b => b.onclick = () => { setTab('clips'); playClip(b.dataset.play); });
  $('chars').innerHTML = CHARACTERS.map(c =>
    `<div class="rr-card rr-char ${c.status}"><b>${c.name}</b><span>${c.note}</span></div>`).join('');
}
function renderMiles(){
  $('miles').innerHTML = MILESTONES.map((m, i) => {
    const done = state.miles[i] !== undefined ? state.miles[i] : (shared.miles[i] !== undefined ? shared.miles[i] : DEFAULT_MILES[i]);
    return `<label class="${done?'done':''}"><input type="checkbox" data-i="${i}" ${done?'checked':''}><span>${m}</span></label>`;
  }).join('');
  $('miles').querySelectorAll('input').forEach(cb => cb.onchange = () => { state.miles[cb.dataset.i] = cb.checked; saveState(); renderMiles(); });
}

/* ---------------- 下載、咒語、匯出入 ---------------- */
$('downloads').innerHTML = DOWNLOADS.map(d =>
  `<a class="rr-card" href="${d.file}" download><b>${d.label}</b><span>${d.who}｜${d.note}</span></a>`).join('');
$('spells').innerHTML = SPELLS.map((s, i) =>
  `<div class="rr-card rr-spell"><b>${s.t}</b><p>${s.s}</p><button class="ig-btn ig-btn--ink ig-btn--sm" type="button" data-i="${i}">複製</button></div>`).join('');
function copySpell(i){
  const txt = SPELLS[i].s;
  (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(
    () => toast('已複製，貼給 Claude Code'), () => toast('複製失敗，請手動選取文字'));
}
document.querySelectorAll('#spells button').forEach(b => b.onclick = () => copySpell(+b.dataset.i));
$('exportBtn').onclick = () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], {type:'application/json'}));
  a.download = 'heka_beagle_review_state.json'; a.click();
};
$('importBtn').onclick = () => $('importFile').click();
$('importFile').onchange = (e) => {
  const f = e.target.files[0]; if (!f) return;
  f.text().then(t => {
    try { Object.assign(state, JSON.parse(t)); saveState(); renderAll(); } catch(err){ toast('這個檔不是狀態 JSON，沒有匯入'); }
  });
};

function renderAll(){ renderTabs(); renderStats(); renderFilters(); renderList(); renderLine(); renderMiles(); }
if (hashParam('tab')) tab = TABS.some(t => t[0] === hashParam('tab')) ? hashParam('tab') : tab;
renderAll(); resize();
fetch('status.json', {cache:'no-store'}).then(r => r.json()).then(j => {
  shared = Object.assign({statuses:{}, miles:{}, queue:[]}, j);
  $('sharedinfo').textContent = `共用進度更新於 ${j.updated || '—'}，由 Claude 維護。要改請跟 Claude 說。`;
  renderAll();
}).catch(() => { $('sharedinfo').textContent = '讀不到共用進度（直接開檔案時會這樣），下面顯示的是預設值。'; });
