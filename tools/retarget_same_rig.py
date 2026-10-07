"""同一套骨架（骨頭名稱相同）的兩隻角色之間搬動畫：只搬「相對靜止姿勢的差量」。
旋轉：q_new = q_rest_目標 · q_rest_來源⁻¹ · q_動畫   （Blender pose basis 是右乘在 rest 上）
平移：t_new = t_rest_目標 + (t_動畫 − t_rest_來源) × 比例（比例＝兩隻 Spine_base 高度比；多數骨頭差量為 0）
縮放：s_new = s_rest_目標 × s_動畫 ÷ s_rest_來源
用法：python3 retarget_same_rig.py <來源.glb> <來源動畫名> <目標.glb> <新動畫名> --out <輸出.glb>
"""
import json, struct, argparse, numpy as np
def read(p):
    b=open(p,'rb').read(); jl=struct.unpack_from('<I',b,12)[0]; j=json.loads(b[20:20+jl]); o=20+jl
    bl=struct.unpack_from('<I',b,o)[0]; return j, bytearray(b[o+8:o+8+bl])
def write(p,j,bb):
    js=json.dumps(j,ensure_ascii=False,separators=(',',':')).encode(); js+=b' '*((4-len(js)%4)%4)
    bb=bytes(bb)+b'\0'*((4-len(bb)%4)%4)
    with open(p,'wb') as f:
        f.write(struct.pack('<III',0x46546C67,2,12+8+len(js)+8+len(bb)))
        f.write(struct.pack('<II',len(js),0x4E4F534A)); f.write(js); f.write(struct.pack('<II',len(bb),0x004E4942)); f.write(bb)
NC={'SCALAR':1,'VEC3':3,'VEC4':4}
def acc(j,bb,i):
    a=j['accessors'][i]; assert a['componentType']==5126
    bv=j['bufferViews'][a['bufferView']]; o=bv.get('byteOffset',0)+a.get('byteOffset',0)
    return np.frombuffer(bytes(bb[o:o+a['count']*NC[a['type']]*4]),dtype='<f4').reshape(a['count'],NC[a['type']]).copy()
def add(j,bb,arr,typ):
    arr=np.ascontiguousarray(arr,dtype='<f4')
    while len(bb)%4: bb.append(0)
    j['bufferViews'].append({'buffer':0,'byteOffset':len(bb),'byteLength':arr.nbytes}); bb.extend(arr.tobytes())
    a={'bufferView':len(j['bufferViews'])-1,'componentType':5126,'count':len(arr),'type':typ}
    if typ=='SCALAR': a['min']=[float(arr.min())]; a['max']=[float(arr.max())]
    j['accessors'].append(a); return len(j['accessors'])-1
def qmul(a,b):  # xyzw
    x1,y1,z1,w1=a.T; x2,y2,z2,w2=b.T
    return np.stack([w1*x2+x1*w2+y1*z2-z1*y2, w1*y2-x1*z2+y1*w2+z1*x2, w1*z2+x1*y2-y1*x2+z1*w2, w1*w2-x1*x2-y1*y2-z1*z2],-1)
def qinv(q): return q*np.array([-1,-1,-1,1])
ap=argparse.ArgumentParser(); ap.add_argument('src'); ap.add_argument('anim'); ap.add_argument('dst'); ap.add_argument('name'); ap.add_argument('--out',required=True)
A=ap.parse_args()
sj,sb=read(A.src); dj,db=read(A.dst)
an=next(x for x in sj['animations'] if x['name']==A.anim)
sn={i:n.get('name') for i,n in enumerate(sj['nodes'])}; dn={n.get('name'):i for i,n in enumerate(dj['nodes'])}
rest=lambda n,k,d: np.array(n.get(k,d),dtype=float)
def h(j,name): return np.linalg.norm(rest(j['nodes'][[n.get('name') for n in j['nodes']].index(name)],'translation',[0,0,0]))
ratio=h(dj,'Spine_base')/h(sj,'Spine_base')
new={'name':A.name,'channels':[],'samplers':[]}; tcache={}
for ch in an['channels']:
    smp=an['samplers'][ch['sampler']]; nm=sn[ch['target']['node']]; path=ch['target']['path']
    if nm not in dn: continue
    S=sj['nodes'][ch['target']['node']]; D=dj['nodes'][dn[nm]]
    v=acc(sj,sb,smp['output'])
    if path=='rotation':
        qs=rest(S,'rotation',[0,0,0,1]); qd=rest(D,'rotation',[0,0,0,1])
        out=qmul(np.broadcast_to(qd,(len(v),4)), qmul(np.broadcast_to(qinv(qs),(len(v),4)), v)); out/=np.linalg.norm(out,axis=1,keepdims=True); typ='VEC4'
    elif path=='translation':
        out=rest(D,'translation',[0,0,0])+(v-rest(S,'translation',[0,0,0]))*ratio; typ='VEC3'
    elif path=='scale':
        out=rest(D,'scale',[1,1,1])*v/rest(S,'scale',[1,1,1]); typ='VEC3'
    else: continue
    if smp['input'] not in tcache: tcache[smp['input']]=add(dj,db,acc(sj,sb,smp['input']),'SCALAR')
    new['samplers'].append({'input':tcache[smp['input']],'output':add(dj,db,out,typ),'interpolation':smp.get('interpolation','LINEAR')})
    new['channels'].append({'sampler':len(new['samplers'])-1,'target':{'node':dn[nm],'path':path}})
dj['animations']=[x for x in dj['animations'] if x['name']!=A.name]+[new]
dj['animations'].sort(key=lambda x:x['name']); dj['buffers'][0]['byteLength']=len(db)
write(A.out,dj,db); print(f'OK {A.name}: {len(new["channels"])} 通道，高度比 {ratio:.3f}，目標共 {len(dj["animations"])} 支')
