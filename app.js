import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/* ---------------- 狀態持久化 ---------------- */
const LS_KEY = 'heka_beagle_review_v1';
function loadState(){
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch(e){ return {}; }
}
const state = Object.assign({statuses:{}, miles:{}}, loadState());
let toastTimer = null;
function toast(msg){
  let el = document.getElementById('savetoast');
  if (!el){
    el = document.createElement('div'); el.id = 'savetoast';
    el.style.cssText = 'position:fixed;bottom:18px;right:18px;background:var(--okbg);color:var(--ok);'+
      'border:1px solid var(--ok);border-radius:8px;padding:8px 16px;font-size:.85rem;z-index:99;'+
      'transition:opacity .3s;pointer-events:none';
    document.body.appendChild(el);
  }
  el.textContent = msg; el.style.opacity = '1';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.style.opacity = '0', 1800);
}
function saveState(){
  localStorage.setItem(LS_KEY, JSON.stringify(state));
  toast('✓ 已儲存（存在這台瀏覽器）');
}
/* 共用狀態：repo 裡的 status.json（Claude 更新、大家看得到）。本機改的會蓋在上面。 */
let shared = {statuses:{}, miles:{}};
function statusOf(c){
  return state.statuses[c.en] || (shared.statuses[c.en] && shared.statuses[c.en].status) || (c.tier==='REF' ? 'ref' : 'done');
}
function noteOf(c){ const s = shared.statuses[c.en]; return s && s.note ? s.note : ''; }

/* ---------------- 3D 檢視器 ---------------- */
const stage = document.getElementById('stage');
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
stage.appendChild(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1d1812);
const camera = new THREE.PerspectiveCamera(40, 1, 0.01, 50);
camera.position.set(1.15, 0.6, 1.45);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.28, 0);
controls.enableDamping = true;

scene.add(new THREE.HemisphereLight(0xfff4e0, 0x40331d, 1.1));
const sun = new THREE.DirectionalLight(0xffffff, 2.2);
sun.position.set(2, 3, 2);
scene.add(sun);
const grid = new THREE.GridHelper(4, 20, 0x4a4033, 0x2e2820);
scene.add(grid);

let mixer = null, actions = {}, current = null, looping = true, playing = true;
const clock = new THREE.Clock();

new GLTFLoader().load('beagle.glb', (g) => {
  scene.add(g.scene);
  mixer = new THREE.AnimationMixer(g.scene);
  for (const cl of g.animations) actions[cl.name] = mixer.clipAction(cl);
  // 網址加 #clip=動畫名 可以直接開到那一支（方便貼連結給同事）
  const want = decodeURIComponent((location.hash.match(/clip=([^&]+)/) || [])[1] || '');
  playClip(actions[want] ? want : 'Idle_1');
});

function playClip(name){
  if (!mixer || !actions[name]) return;
  if (current) actions[current].fadeOut(0.2);
  const a = actions[name];
  a.reset();
  a.setLoop(looping ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
  a.clampWhenFinished = true;
  a.fadeIn(0.2).play();
  current = name;
  playing = true;
  playBtn.textContent = '⏸ 暫停';
  const c = CLIPS.find(x => x.en === name);
  document.getElementById('nowplaying').innerHTML =
    `Arm_Beagle|${name}<small>${c ? c.zh + '｜' + c.desc : ''}</small>`;
  document.querySelectorAll('.clip').forEach(el =>
    el.classList.toggle('active', el.dataset.en === name));
  cmpBtn.style.display = (c && c.compare) ? 'inline-block' : 'none';
  showCompare(false);
}

/* 對照影片（AI 影片｜Blender｜疊圖） */
const cmpBtn = document.getElementById('cmpBtn');
const cmpWrap = document.getElementById('cmpwrap'), cmpVideo = document.getElementById('cmpvideo');
function showCompare(on){
  cmpWrap.classList.toggle('on', on);
  cmpBtn.textContent = on ? '🧊 回 3D 預覽' : '🎞 對照 AI 影片';
  if (on){ const c = CLIPS.find(x => x.en === current); cmpVideo.src = c.compare; cmpVideo.play(); }
  else cmpVideo.pause();
}
cmpBtn.onclick = () => showCompare(!cmpWrap.classList.contains('on'));

/* 控制列 */
const playBtn = document.getElementById('playBtn');
playBtn.onclick = () => {
  playing = !playing;
  if (mixer) mixer.timeScale = playing ? +speedSel.value : 0;
  playBtn.textContent = playing ? '⏸ 暫停' : '▶ 播放';
};
document.getElementById('restartBtn').onclick = () => {
  if (current) { const a = actions[current]; a.reset(); a.play(); playing = true;
    mixer.timeScale = +speedSel.value; playBtn.textContent = '⏸ 暫停'; }
};
const loopBtn = document.getElementById('loopBtn');
loopBtn.onclick = () => {
  looping = !looping;
  loopBtn.textContent = looping ? '🔁 循環：開' : '➡ 循環：關';
  loopBtn.classList.toggle('off', !looping);
  if (current) { const a = actions[current];
    a.setLoop(looping ? THREE.LoopRepeat : THREE.LoopOnce, Infinity); }
};
const speedSel = document.getElementById('speedSel');
speedSel.onchange = () => { if (mixer && playing) mixer.timeScale = +speedSel.value; };
const seek = document.getElementById('seek');
let scrubbing = false;
seek.oninput = () => {
  scrubbing = true;
  if (current) { const a = actions[current];
    a.time = (seek.value / 1000) * a.getClip().duration; a.paused = false; }
  if (mixer) mixer.update(0);
  scrubbing = false;
};

function resize(){
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(stage);

(function loop(){
  requestAnimationFrame(loop);
  const dt = clock.getDelta();
  if (mixer) mixer.update(dt); // timeScale 控制暫停與速度
  controls.update();
  if (current){
    const a = actions[current], d = a.getClip().duration;
    const t = a.time % (d || 1);
    if (!scrubbing) seek.value = Math.round((t / d) * 1000);
    document.getElementById('timelabel').textContent = t.toFixed(2) + ' / ' + d.toFixed(2) + 's';
  }
  renderer.render(scene, camera);
})();

/* ---------------- 清單、篩選、狀態 ---------------- */
const filters = {tier:'ALL', status:'ALL', q:''};
const F_TIERS = [['ALL','全部'],['P0','P0 核心'],['P1','P1 補強'],['REF','參考']];
const F_STATUS = [['ALL','全部狀態'],['done','待QA'],['qa','QA通過'],['confirmed','確認'],['rework','修改中'],['cancelled','取消']];

function renderFilters(){
  const el = document.getElementById('filters');
  el.innerHTML =
    F_TIERS.map(([v,l]) =>
      `<button class="chip ${filters.tier===v?'on':''}" data-k="tier" data-v="${v}">${l}</button>`).join('') +
    '<span style="width:8px"></span>' +
    F_STATUS.map(([v,l]) =>
      `<button class="chip ${filters.status===v?'on':''}" data-k="status" data-v="${v}">${l}</button>`).join('') +
    `<input type="search" id="q" placeholder="搜尋名稱…" value="${filters.q}">`;
  el.querySelectorAll('.chip').forEach(b => b.onclick = () => {
    filters[b.dataset.k] = b.dataset.v; renderFilters(); renderList();
  });
  el.querySelector('#q').oninput = (e) => { filters.q = e.target.value; renderList(); };
}

function renderCards(){
  const real = CLIPS.filter(c => c.tier !== 'REF');
  const n = s => real.filter(c => statusOf(c) === s).length;
  document.getElementById('cards').innerHTML = `
    <div class="card"><div class="n">${real.length}</div><div class="l">缺口動畫</div></div>
    <div class="card"><div class="n">${n('done')}</div><div class="l">待 QA</div></div>
    <div class="card"><div class="n">${n('qa') + n('confirmed')}</div><div class="l">通過／確認</div></div>
    <div class="card"><div class="n">${n('rework')}</div><div class="l">修改中</div></div>
    <div class="card"><div class="n">${n('cancelled')}</div><div class="l">取消</div></div>`;
}

function renderList(){
  const box = document.getElementById('cliplist');
  const q = filters.q.toLowerCase();
  box.innerHTML = CLIPS.filter(c => {
    if (filters.tier !== 'ALL' && c.tier !== filters.tier) return false;
    if (filters.status !== 'ALL' && (c.tier === 'REF' || statusOf(c) !== filters.status)) return false;
    if (q && !(c.en.toLowerCase().includes(q) || c.zh.includes(filters.q))) return false;
    return true;
  }).map(c => {
    const st = statusOf(c);
    const sel = c.tier === 'REF'
      ? `<span class="tier REF">參考基準</span>`
      : `<select class="s-${st}" data-en="${c.en}">` +
        STATUS_OPTS.map(([v,l]) => `<option value="${v}" ${v===st?'selected':''}>${l}</option>`).join('') +
        `</select>`;
    return `<div class="clip ${current===c.en?'active':''}" data-en="${c.en}">
      <img src="thumbs/${c.en}.png" alt="${c.zh}" loading="lazy">
      <div class="meta">
        <div class="en">${c.id ? String(c.id).padStart(2,'0')+' ' : ''}${c.en}<span class="tier ${c.tier}">${c.tier}</span>${c.method==='video' ? '<span class="badge-video">AI 影片對位</span>' : ''}</div>
        <div class="zh"><b>${c.zh}</b>｜${c.desc}<span style="color:var(--mut)">｜${c.frames}f</span></div>
        ${noteOf(c) ? `<div class="note">📝 ${noteOf(c)}</div>` : ''}
      </div>
      ${sel}
    </div>`;
  }).join('');
  box.querySelectorAll('.clip').forEach(el => {
    el.onclick = (e) => { if (e.target.tagName !== 'SELECT' && e.target.tagName !== 'OPTION') playClip(el.dataset.en); };
  });
  box.querySelectorAll('select').forEach(s => {
    s.onchange = () => {
      state.statuses[s.dataset.en] = s.value; saveState();
      s.className = 's-' + s.value; renderCards();
    };
  });
}

function renderMiles(){
  const el = document.getElementById('miles');
  el.innerHTML = MILESTONES.map((m, i) => {
    const done = state.miles[i] !== undefined ? state.miles[i] : (shared.miles[i] !== undefined ? shared.miles[i] : DEFAULT_MILES[i]);
    return `<label class="${done?'done':''}"><input type="checkbox" data-i="${i}" ${done?'checked':''}><span>${m}</span></label>`;
  }).join('');
  el.querySelectorAll('input').forEach(cb => {
    cb.onchange = () => { state.miles[cb.dataset.i] = cb.checked; saveState(); renderMiles(); };
  });
}

/* 匯出／匯入 */
document.getElementById('exportBtn').onclick = () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'heka_beagle_review_state.json';
  a.click();
};
document.getElementById('importBtn').onclick = () => document.getElementById('importFile').click();
document.getElementById('importFile').onchange = (e) => {
  const f = e.target.files[0]; if (!f) return;
  f.text().then(t => {
    try { Object.assign(state, JSON.parse(t)); saveState();
      renderCards(); renderList(); renderMiles(); } catch(err){ alert('JSON 格式錯誤'); }
  });
};

/* 角色、下載、咒語 */
document.getElementById('chars').innerHTML = CHARACTERS.map(c =>
  `<div class="char ${c.status}"><span style="font-size:1.3rem">${c.icon}</span><div><b>${c.name}</b><small>${c.note}</small></div></div>`).join('');
document.getElementById('downloads').innerHTML = DOWNLOADS.map(d =>
  `<a href="${d.file}" download><span>⬇ ${d.label}</span><small>${d.note}</small></a>`).join('');
document.getElementById('spells').innerHTML = SPELLS.map((s, i) =>
  `<div class="spell"><div class="h"><span>${s.t}</span><button data-i="${i}">複製</button></div><p>${s.s}</p></div>`).join('');
document.querySelectorAll('#spells button').forEach(b => b.onclick = () => {
  const txt = SPELLS[b.dataset.i].s;
  (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(
    () => toast('✓ 已複製，貼給 Claude Code'), () => toast('複製失敗，請手動選取文字'));
});

renderFilters(); renderCards(); renderList(); renderMiles(); resize();
fetch('status.json', {cache:'no-store'}).then(r => r.json()).then(j => {
  shared = Object.assign({statuses:{}, miles:{}}, j);
  document.getElementById('sharedinfo').textContent = `共用狀態更新於 ${j.updated || '—'}（${j.updated_by || ''}）`;
  renderCards(); renderList(); renderMiles();
}).catch(() => { document.getElementById('sharedinfo').textContent = '讀不到 status.json（本機直接開檔時正常），顯示預設狀態'; });
