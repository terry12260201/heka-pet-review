// 產生 status.json 的初版（生產線看板＝所有「部分可用／素材包沒有」的需求）。已存在的人工狀態會保留。
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/../data.js', 'utf8');
const { GROUPS, REQS, COVER_LABEL, SRC_LABEL } = new Function(src + ';return {GROUPS,REQS,COVER_LABEL,SRC_LABEL};')();
const G = Object.fromEntries(GROUPS.map(g => [g.k, g.zh]));
const old = fs.existsSync('status.json') ? JSON.parse(fs.readFileSync('status.json', 'utf8')) : {};
const keep = Object.fromEntries((old.queue || []).map(x => [x.en, x]));
const q = REQS.filter(r => r.cover !== 'ok').map(r => ({
  en: r.id, zh: r.zh, play: r.clips[0] || '',
  stage: keep[r.id] ? keep[r.id].stage : (r.id === 'user_shake' ? 'qa' : 'need'),
  info: G[r.g] + '・' + COVER_LABEL[r.cover] + (r.src !== 'plan' && !['user','idea'].includes(r.g) ? '・' + SRC_LABEL[r.src] : ''),
  note: keep[r.id] && keep[r.id].note ? keep[r.id].note : (r.id === 'user_shake' ? '已從 Beagle 移植，可預覽，等人眼驗收' : r.gap)
}));
const order = { qa: 0, fit: 1, video: 2, need: 3, pass: 4 };
q.sort((a, b) => order[a.stage] - order[b.stage]);
const s = Object.assign({ statuses: {}, miles: {} }, old, {
  updated: process.argv[2] || old.updated, updated_by: 'Claude',
  source_note: '需求暫以 HEKA 寵物企劃整理；Jira FOOT-27 尚未讀到，拿到後更新。', queue: q });
fs.writeFileSync('status.json', JSON.stringify(s, null, 2) + '\n');
console.log('queue', q.length);
