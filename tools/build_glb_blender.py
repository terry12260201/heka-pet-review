import bpy, json, math
import os
SP=os.environ.get('JRT_WORK','work')  # 工作資料夾：放 tex/albedo1.jpg、tex/normal.png，輸出 glb／blend／thumbs
FBX=os.environ['JRT_FBX']  # 素材包 Cartoon_JRTerrier/FBX/Anim/Cartoon_JRTerrier_anim_IP.fbx
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.fbx(filepath=FBX)
arm=next(o for o in bpy.data.objects if o.type=='ARMATURE'); mesh=next(o for o in bpy.data.objects if o.type=='MESH')
info={'arm':arm.name,'mesh':mesh.name,'arm_scale':list(arm.scale),'arm_rot':list(arm.rotation_euler),'dims':list(mesh.dimensions)}
for a in bpy.data.actions:
    a.name=a.name.split('|')[-1]; a.use_fake_user=True
# material
mat=mesh.data.materials[0]; mat.use_nodes=True; nt=mat.node_tree
bsdf=next(n for n in nt.nodes if n.type=='BSDF_PRINCIPLED')
for n in list(nt.nodes):
    if n.type=='TEX_IMAGE': nt.nodes.remove(n)
ti=nt.nodes.new('ShaderNodeTexImage'); ti.image=bpy.data.images.load(SP+'/tex/albedo1.jpg'); nt.links.new(ti.outputs['Color'],bsdf.inputs['Base Color'])
tn=nt.nodes.new('ShaderNodeTexImage'); tn.image=bpy.data.images.load(SP+'/tex/normal.png'); tn.image.colorspace_settings.name='Non-Color'
nm=nt.nodes.new('ShaderNodeNormalMap'); nt.links.new(tn.outputs['Color'],nm.inputs['Color']); nt.links.new(nm.outputs['Normal'],bsdf.inputs['Normal'])
bsdf.inputs['Metallic'].default_value=0; bsdf.inputs['Alpha'].default_value=1.0; mat.surface_render_method='DITHERED'; bsdf.inputs['Roughness'].default_value=0.75
# world bbox at rest
bpy.context.view_layer.update()
import mathutils
ws=[mesh.matrix_world@mathutils.Vector(c) for c in mesh.bound_box]
info['world_min']=[min(v[i] for v in ws) for i in range(3)]; info['world_max']=[max(v[i] for v in ws) for i in range(3)]
info['actions']=sorted([(a.name,int(a.frame_range[0]),int(a.frame_range[1])) for a in bpy.data.actions])
arm.animation_data_create(); arm.animation_data.action=bpy.data.actions['Idle_1']
for o in bpy.data.objects: o.select_set(o in (arm,mesh))
bpy.context.view_layer.objects.active=arm
bpy.ops.export_scene.gltf(filepath=SP+'/jrterrier.glb',export_format='GLB',use_selection=True,export_animation_mode='ACTIONS',export_force_sampling=True,export_image_format='JPEG',export_cameras=False,export_lights=False)
bpy.ops.wm.save_as_mainfile(filepath=SP+'/Cartoon_JRTerrier_HEKA.blend',compress=True)
json.dump(info,open(SP+'/build_info.json','w'),indent=1)
