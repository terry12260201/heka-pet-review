import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const $ = id => document.getElementById(id);

/* ---------------- 狀態：本機（這台瀏覽器）＋ 共用（status.json） ---------------- */
const LS_KEY = 'heka_jrt_review_v3';
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
// 需求的審查狀態：自己瀏覽器的標記 > 共用 status.json > 預設「待確認」
function statusOf(r){ return state.statuses[r.id] || (shared.statuses[r.id] && shared.statuses[r.id].status) || 'pending'; }
function noteOf(r){ const s = shared.statuses[r.id]; return s && s.note ? s.note : ''; }
const PACK_BY = Object.fromEntries(PACK.map(p => [p.en, p]));
const REQ_BY = Object.fromEntries(REQS.map(r => [r.id, r]));
const GROUP_BY = Object.fromEntries(GROUPS.map(g => [g.k, g]));
const CAT_BY = Object.fromEntries(CATS.map(c => [c.k, c.zh]));
// V02（Beagle）的舊連結：#clip=那些名字 → 導到 v02-beagle/
const V02_NAMES = /^(Walk_AIVideo_Loop|Trot_AIVideo_Loop|Run_AIVideo_Loop|Eat_AIVideo|Drink_AIVideo|BodyShake_AIVideo|BodyShake_Loop|Body_Shake|Pet_.*|Belly_Up_.*|Sniff_.*|Head_Tilt_.*|Head_Nod|Play_Bow|Paw_Ball|Spin_.*|Stretch_F|Lick_Hand|Sleep_Roll|Tail_Wag_Fast|Ear_Sad_Back|Beg_Play|Hungry_Beg|Sick_Lie)$/;
function legacyRedirect(){
  const m = location.hash.match(/clip=([^&]+)/);
  if (m && V02_NAMES.test(decodeURIComponent(m[1]))) { location.replace('v02-beagle/' + location.hash); return true; }
  return false;
}
legacyRedirect();
addEventListener('hashchange', () => {
  if (legacyRedirect()) return;
  const r = hashParam('req'), c = hashParam('clip');
  if (REQ_BY[r]) openReq(r); else if (actions[c]) playClip(c);
});

/* ---------------- 3D 檢視器（深炭舞台） ---------------- */
const stage = $('stage');
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
stage.appendChild(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x282627);
const camera = new THREE.PerspectiveCamera(40, 1, 0.01, 50);
camera.position.set(0.95, 0.5, 1.2);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.22, 0);
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

let dogMat = null;
const texLoader = new THREE.TextureLoader(), coatCache = {};
new GLTFLoader().load('jrterrier.glb', (g) => {
  scene.add(g.scene);
  g.scene.traverse(o => { if (o.isMesh && !dogMat) { dogMat = o.material; coatCache[1] = dogMat.map; } });
  mixer = new THREE.AnimationMixer(g.scene);
  for (const cl of g.animations) actions[cl.name] = mixer.clipAction(cl);
  // 網址加 #clip=動畫名 可以直接開到那一支（方便貼連結給同事）
  const want = hashParam('clip'), wantReq = hashParam('req');
  if (REQ_BY[wantReq]) { openReq(wantReq); return; }
  playClip(actions[want] ? want : 'Idle_1');
}, undefined, () => { $('nowplaying').innerHTML = '<b>模型載入失敗</b><small>重新整理再試一次；還是不行請回報。</small>'; });

function hashParam(k){ const m = location.hash.match(new RegExp(k + '=([^&]+)')); return m ? decodeURIComponent(m[1]) : ''; }

let currentReq = '';
function openReq(id){
  const r = REQ_BY[id]; if (!r) return;
  currentReq = id;
  if (r.clips.length && mixer) { playClip(r.clips[0], id); return; }
  if (current && actions[current]) actions[current].fadeOut(0.2);
  current = null;
  $('nowplaying').innerHTML = `<b>${r.zh}</b><code>素材包沒有這支</code><small>${r.gap || r.desc}｜到「生產線」看製作進度。</small>`;
  markActive();
}
function markActive(){
  document.querySelectorAll('.rr-row').forEach(el => el.classList.toggle('is-active', el.dataset.id ? el.dataset.id === currentReq : el.dataset.en === current));
  document.querySelectorAll('.rr-clip').forEach(el => el.classList.toggle('is-on', el.dataset.en === current && el.dataset.req === currentReq));
}
function playClip(name, reqId){
  if (!mixer || !actions[name]) return;
  currentReq = reqId || '';
  if (current) actions[current].fadeOut(0.2);
  const a = actions[name];
  a.reset();
  a.setLoop(looping ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
  a.clampWhenFinished = true;
  a.fadeIn(0.2).play();
  current = name; playing = true;
  mixer.timeScale = +speedSel.value;
  playBtn.textContent = '暫停';
  const p = PACK_BY[name], r = REQ_BY[currentReq];
  const sub = r ? `需求：${r.zh}｜${r.desc}` : (p && p.reqs.length ? '對應需求：' + p.reqs.map(id => REQ_BY[id].zh).join('、') : '目前沒有對應的需求');
  $('nowplaying').innerHTML = `<b>${p ? p.zh : name}</b><code>${name}</code><small>${sub}</small>`;
  markActive();
  cmpBtn.style.display = 'none';
  showCompare(false);
}
function showCompare(on){
  cmpWrap.classList.toggle('on', on);
  cmpBtn.textContent = on ? '回 3D 預覽' : '對照 AI 影片';
  if (on){ cmpVideo.play().catch(() => {}); }
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
$('coatSel').onchange = (e) => {
  const k = e.target.value; if (!dogMat) return;
  const apply = (tex) => { dogMat.map = tex; dogMat.needsUpdate = true; };
  if (coatCache[k]) return apply(coatCache[k]);
  texLoader.load(`textures/albedo${k}.jpg`, (tex) => {
    tex.flipY = false; tex.colorSpace = THREE.SRGBColorSpace; coatCache[k] = tex; apply(tex);
  });
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
  const n = {clips: REQS.length, line: (shared.queue || []).length};
  $('tabs').innerHTML = TABS.map(([k,l]) =>
    `<button class="rr-tab" role="tab" type="button" data-k="${k}" aria-selected="${tab===k}" aria-controls="p-${k}">${l}${n[k] ? `<i>${n[k]}</i>` : ''}</button>`).join('');
  $('tabs').querySelectorAll('.rr-tab').forEach(b => b.onclick = () => setTab(b.dataset.k));
  TABS.forEach(([k]) => $('p-' + k).hidden = (k !== tab));
  document.querySelectorAll('.ig-nav__link').forEach(a => a.classList.toggle('is-active', a.dataset.go === tab));
}
function setTab(k){ if (TABS.some(t => t[0] === k)) { tab = k; renderTabs(); } }
document.querySelectorAll('.ig-nav__link').forEach(a => a.onclick = (e) => { e.preventDefault(); setTab(a.dataset.go); });
$('askBtn').onclick = () => { setTab('how'); copySpell(1); };

/* ---------------- 動畫：需求對照／素材包 ---------------- */
const filters = {mode:'req', a:'ALL', b:'ALL', q:''};
const MODES = [['req', `需求對照 ${REQS.length}`], ['pack', `素材包全部 ${PACK.length}`]];
function filterDefs(){
  if (filters.mode === 'req') return [
    [['ALL','全部覆蓋'],['ok','素材包現成'],['part','部分可用'],['gap','素材包沒有']],
    [['ALL','全部來源'],['plan','企劃'],['user','南瓜指定'],['idea','Claude 建議']]];
  return [
    [['ALL','全部分類']].concat(CATS.map(c => [c.k, c.zh])),
    [['ALL','全部'],['yes','可直接用'],['maybe','看情境'],['no','照護不建議'],['used','有對應需求']]];
}
function renderFilters(){
  $('modes').innerHTML = MODES.map(([v,l]) => `<button class="rr-chip" type="button" aria-pressed="${filters.mode===v}" data-mode="${v}">${l}</button>`).join('');
  $('modes').querySelectorAll('[data-mode]').forEach(b => b.onclick = () => { filters.mode = b.dataset.mode; filters.a = filters.b = 'ALL'; renderFilters(); renderList(); });
  const [A, B] = filterDefs();
  $('filters').innerHTML =
    A.map(([v,l]) => `<button class="rr-chip" type="button" aria-pressed="${filters.a===v}" data-k="a" data-v="${v}">${l}</button>`).join('') +
    '<span style="width:6px"></span>' +
    B.map(([v,l]) => `<button class="rr-chip" type="button" aria-pressed="${filters.b===v}" data-k="b" data-v="${v}">${l}</button>`).join('');
  $('filters').querySelectorAll('.rr-chip').forEach(b => b.onclick = () => { filters[b.dataset.k] = b.dataset.v; renderFilters(); renderList(); });
}
$('q').oninput = (e) => { filters.q = e.target.value.trim(); renderList(); };

function renderStats(){
  const n = c => REQS.filter(r => r.cover === c).length;
  $('stats').innerHTML =
    `<div class="rr-stat"><b>${REQS.length}</b><span>項需求</span></div>` +
    `<div class="rr-stat"><b>${n('ok')}</b><span>素材包現成</span></div>` +
    `<div class="rr-stat"><b>${n('part')}</b><span>部分可用</span></div>` +
    `<div class="rr-stat"><b>${n('gap')}</b><span>素材包沒有</span></div>`;
}
const esc = s => String(s).replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
function emptyBox(){
  $('cliplist').innerHTML = `<div class="rr-empty">找不到符合的項目。<br><button class="ig-btn ig-btn--ghost ig-btn--sm" type="button" id="clearBtn" style="margin-top:12px">清除搜尋與篩選</button></div>`;
  $('clearBtn').onclick = () => { filters.a = filters.b = 'ALL'; filters.q = ''; $('q').value = ''; renderFilters(); renderList(); };
}
function reqRow(r){
  const st = statusOf(r);
  const tags = `<span class="rr-tagx ${r.cover}">${COVER_LABEL[r.cover]}</span>` + (r.src !== 'plan' ? `<span class="rr-tagx ${r.src}">${SRC_LABEL[r.src]}</span>` : `<span class="rr-tagx">企劃・待 Jira 核對</span>`);
  const thumb = r.clips.length ? `thumbs/${r.clips[0]}.png` : 'thumbs/_gap.png';
  const clips = r.clips.map(en => `<button class="rr-clip" type="button" data-en="${en}" data-req="${r.id}" title="${esc(PACK_BY[en].zh)}">${esc(PACK_BY[en].zh)}</button>`).join('');
  const sel = `<select class="rr-status s-${st}" data-id="${r.id}" aria-label="${esc(r.zh)} 的狀態">` +
    STATUS_OPTS.map(([v,l]) => `<option value="${v}" ${v===st?'selected':''}>${l}</option>`).join('') + `</select>`;
  return `<div class="rr-row ${r.cover==='gap'?'is-gap':''}" data-id="${r.id}" tabindex="0" role="button" aria-label="看 ${esc(r.zh)}">
    <img src="${thumb}" alt="" loading="lazy" width="76" height="76">
    <div>
      <h3>${esc(r.zh)}${tags}</h3>
      <p>${esc(r.desc)}</p>
      ${r.gap ? `<p class="rr-gapnote">缺：${esc(r.gap)}</p>` : ''}
      ${noteOf(r) ? `<p class="rr-note">${esc(noteOf(r))}</p>` : ''}
      ${clips ? `<div class="rr-clips">${clips}</div>` : ''}
    </div>
    ${sel}
  </div>`;
}
function packRow(p){
  const reqs = p.reqs.map(id => REQ_BY[id].zh).join('、');
  return `<div class="rr-row" data-en="${p.en}" tabindex="0" role="button" aria-label="播放 ${esc(p.zh)}">
    <img src="thumbs/${p.en}.png" alt="" loading="lazy" width="76" height="76">
    <div>
      <h3>${esc(p.zh)}<span class="rr-tagx">${CAT_BY[p.cat]}</span>${p.use==='no' ? '<span class="rr-tagx no">照護情境不建議</span>' : p.use==='maybe' ? '<span class="rr-tagx">看情境</span>' : ''}${p.extra ? '<span class="rr-tagx user">移植</span>' : ''}</h3>
      <code>${p.en} · ${p.frames} 格</code>
      <p>${reqs ? '用在：' + esc(reqs) : '目前沒有對應的需求'}</p>
    </div>
  </div>`;
}
function renderList(){
  const q = filters.q.toLowerCase();
  if (filters.mode === 'req'){
    const rows = REQS.filter(r => (filters.a === 'ALL' || r.cover === filters.a) && (filters.b === 'ALL' || r.src === filters.b) &&
      (!q || r.zh.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q) || r.clips.some(c => c.toLowerCase().includes(q) || PACK_BY[c].zh.includes(q))));
    if (!rows.length) return emptyBox();
    let html = '';
    for (const g of GROUPS){
      const rs = rows.filter(r => r.g === g.k); if (!rs.length) continue;
      html += `<h3 class="rr-group">${g.zh}<small>${g.desc}</small></h3>` + rs.map(reqRow).join('');
    }
    $('cliplist').innerHTML = html;
  } else {
    const rows = PACK.filter(p => (filters.a === 'ALL' || p.cat === filters.a) &&
      (filters.b === 'ALL' || (filters.b === 'used' ? p.reqs.length > 0 : p.use === filters.b)) &&
      (!q || p.en.toLowerCase().includes(q) || p.zh.includes(q)));
    if (!rows.length) return emptyBox();
    $('cliplist').innerHTML = (filters.b === 'no' || filters.a === 'fight' ? `<p class="rr-sub">${NOT_FOR_CARE}</p>` : '') + rows.map(packRow).join('');
  }
  $('cliplist').querySelectorAll('.rr-row').forEach(el => {
    const go = () => {
      if (el.dataset.id) openReq(el.dataset.id); else playClip(el.dataset.en);
      if (innerWidth < 1024) document.querySelector('.rr-stage').scrollIntoView({behavior:'smooth', block:'start'});
    };
    el.onclick = (e) => { if (!e.target.closest('select') && !e.target.closest('.rr-clip')) go(); };
    el.onkeydown = (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target === el) { e.preventDefault(); go(); } };
  });
  $('cliplist').querySelectorAll('.rr-clip').forEach(b => b.onclick = () => playClip(b.dataset.en, b.dataset.req));
  $('cliplist').querySelectorAll('select').forEach(s => s.onchange = () => {
    state.statuses[s.dataset.id] = s.value; saveState(); s.className = 'rr-status s-' + s.value;
  });
  markActive();
}

/* ---------------- 生產線 ---------------- */
function renderLine(){
  const q = shared.queue || [];
  $('queue').innerHTML = q.length ? q.map(it => {
    const at = STAGES.findIndex(s => s[0] === it.stage);
    return `<div class="rr-card rr-qi">
      <div><h3>${esc(it.zh)}</h3><p>${esc(it.info || '')}${it.note ? '｜' + esc(it.note) : ''}</p></div>
      ${it.play ? `<button class="ig-btn ig-btn--ghost ig-btn--sm" type="button" data-req="${it.en}">看目前可用的</button>` : ''}
      <div class="rr-steps">${STAGES.map((s, i) => `<div class="rr-step ${i < at ? 'done' : i === at ? 'now' : ''}">${s[1]}</div>`).join('')}</div>
    </div>`;
  }).join('') : `<div class="rr-empty">目前沒有要補的動作。</div>`;
  $('queue').querySelectorAll('[data-req]').forEach(b => b.onclick = () => { setTab('clips'); openReq(b.dataset.req); });
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
  a.download = 'heka_jrterrier_review_state.json'; a.click();
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
  $('sharedinfo').textContent = `共用進度更新於 ${j.updated || '—'}，由 Claude 維護。${j.source_note || ''}`;
  renderAll();
}).catch(() => { $('sharedinfo').textContent = '讀不到共用進度（直接開檔案時會這樣），下面顯示的是預設值。'; });
