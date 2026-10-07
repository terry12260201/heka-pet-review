import bpy, sys, os, math, mathutils
import os
SP=os.environ.get('JRT_WORK','work')  # 工作資料夾：放 tex/albedo1.jpg、tex/normal.png，輸出 glb／blend／thumbs
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
only=args
bpy.ops.wm.open_mainfile(filepath=SP+'/Cartoon_JRTerrier_HEKA.blend')
s=bpy.context.scene; s.render.engine='BLENDER_EEVEE_NEXT' if 'BLENDER_EEVEE_NEXT' in [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items] else 'BLENDER_EEVEE'
s.render.resolution_x=600; s.render.resolution_y=420; s.render.film_transparent=True; s.render.image_settings.file_format='PNG'; s.render.image_settings.color_mode='RGBA'
arm=bpy.data.objects['Arm_JRTerrier']
cam_data=bpy.data.cameras.new('cam'); cam_data.lens=50; cam=bpy.data.objects.new('cam',cam_data); s.collection.objects.link(cam); s.camera=cam
tgt=mathutils.Vector((0,0,0.2))
cam.location=tgt+mathutils.Vector((-1.25,-1.55,0.75))
cam.rotation_euler=(tgt-cam.location).to_track_quat('-Z','Y').to_euler()
w=bpy.data.worlds.new('w'); s.world=w; w.use_nodes=True; w.node_tree.nodes['Background'].inputs[0].default_value=(0.55,0.55,0.58,1); w.node_tree.nodes['Background'].inputs[1].default_value=1.0
sun=bpy.data.lights.new('sun','SUN'); sun.energy=3.5; so=bpy.data.objects.new('sun',sun); so.rotation_euler=(math.radians(50),0,math.radians(-30)); s.collection.objects.link(so)
os.makedirs(SP+'/thumbs',exist_ok=True)
acts=[a for a in bpy.data.actions if (not only or a.name in only)]
for a in acts:
    arm.animation_data.action=a
    f0,f1=a.frame_range; f=int(round(f0+(f1-f0)*0.5))
    s.frame_set(f)
    s.render.filepath=f'{SP}/thumbs/{a.name}.png'
    bpy.ops.render.render(write_still=True)
print('DONE',len(acts))
