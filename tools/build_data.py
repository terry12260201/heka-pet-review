import json, csv, sys, os, datetime
sys.path.insert(0, os.path.dirname(__file__))
import pack_dict as P, reqs as Q
SP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1]
info = json.load(open(os.path.join(os.path.dirname(__file__), 'pack_actions.json')))  # Blender 讀 FBX 得到的動畫名與格數
pack = []
for name, f0, f1 in info['actions']:
    zh, cat, use = P.describe(name)
    pack.append(dict(en=name, zh=zh, cat=cat, use=use, frames=f'{f0}-{f1}', loop=('loop' in name.lower() or name.endswith('_IP') or name.startswith('Idle') and '_start' not in name and '_end' not in name)))
pack.append(dict(en='BodyShake_FromBeagle', zh='全身抖毛（移植自 Beagle GPT 版）', cat='idle', use='yes', frames='0-120', loop=True, extra=True))
names = {p['en'] for p in pack}
used = {}
for r in Q.R:
    for c in r['clips']:
        assert c in names, (r['id'], c)
        used.setdefault(c, []).append(r['id'])
for p in pack: p['reqs'] = used.get(p['en'], [])
data = {'GROUPS': [dict(k=k, zh=z, desc=d) for k, z, d in Q.GROUPS], 'REQS': Q.R, 'PACK': pack,
        'CATS': [dict(k=k, zh=v) for k, v in P.CAT.items()], 'NOT_FOR_CARE': Q.NOT_FOR_CARE}
js = '// 由 tools/build_data.py 產生，改需求請改 tools/reqs.py 再重跑。\n'
for k, v in data.items(): js += f'const {k} = {json.dumps(v, ensure_ascii=False, indent=1)};\n'
js += open(os.path.join(os.path.dirname(__file__), 'data_static.js')).read()
open(OUT + '/data.js', 'w').write(js)
# 盤點 CSV（需求對照＋素材包）
SRC = {'plan': '企劃（待 Jira 核對）', 'user': '南瓜指定補充', 'idea': 'Claude 建議補充'}
COV = {'ok': '素材包現成', 'part': '部分可用', 'gap': '素材包沒有'}
G = {k: z for k, z, _ in Q.GROUPS}
with open(OUT + '/downloads/JRTerrier_動作需求對照.csv', 'w', newline='', encoding='utf-8-sig') as f:
    w = csv.writer(f); w.writerow(['分組', '需求', '來源', '素材包覆蓋', '可用動畫', '說明', '缺什麼'])
    for r in Q.R: w.writerow([G[r['g']], r['zh'], SRC[r['src']], COV[r['cover']], '、'.join(r['clips']), r['desc'], r['gap']])
CAT = P.CAT; USE = {'yes': '可直接用', 'maybe': '看情境', 'no': '照護情境不建議'}
with open(OUT + '/downloads/JRTerrier_素材包動畫清單.csv', 'w', newline='', encoding='utf-8-sig') as f:
    w = csv.writer(f); w.writerow(['動畫名', '中文', '分類', '照護情境', '格數', '對應需求'])
    for p in pack: w.writerow([p['en'], p['zh'], CAT[p['cat']], USE[p['use']], p['frames'], '、'.join(p['reqs'])])
print('pack', len(pack), 'reqs', len(Q.R), {c: sum(r['cover'] == c for r in Q.R) for c in COV}, {s: sum(r['src'] == s for r in Q.R) for s in SRC})
