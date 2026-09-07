"""Original Life Counter character sculpts. Run with Blender 4.5 --background --python.
All surfaces authored here; no downloaded character meshes or texture dependencies.
"""
import bpy, bmesh, math, json, os
from mathutils import Vector
from math import sin, cos, pi, exp
OUT=os.path.dirname(os.path.abspath(__file__))
AGES=[1,8,16,25,45,65,85]
NAMES=['toddler','child','teen','young','middle','senior','elder']
HEIGHTS=[.84,1.23,1.60,1.72,1.70,1.65,1.56]

def material(name,color,roughness=.7):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=roughness
 return m

class Sculpt:
 def __init__(self):self.v=[];self.f=[];self.m=[];self.w=[]
 def surface(self,rows,mat,weight=1,wrap=True,cap=True):
  start=len(self.v);n=len(rows[0]);nr=len(rows)
  for row in rows:
   self.v.extend(row);self.w.extend([weight]*len(row))
  for j in range(nr-1):
   for k in range(n if wrap else n-1):
    self.f.append((start+j*n+k,start+j*n+(k+1)%n,start+(j+1)*n+(k+1)%n,start+(j+1)*n+k));self.m.append(mat)
  if cap and wrap:
   self.f.append(tuple(start+i for i in reversed(range(n))));self.m.append(mat)
   self.f.append(tuple(start+(nr-1)*n+i for i in range(n)));self.m.append(mat)
 def rings(self,rings,mat,n=24,weight=1):
  smooth=[]
  for j in range(len(rings)-1):
   a,b,c,d=[rings[max(0,min(len(rings)-1,k))] for k in [j-1,j,j+1,j+2]]
   for q in range(3):
    t=q/3
    val=[.5*(2*b[k]+(-a[k]+c[k])*t+(2*a[k]-5*b[k]+4*c[k]-d[k])*t*t+(-a[k]+3*b[k]-3*c[k]+d[k])*t*t*t) for k in range(5)]
    val[3]=max(.0001,val[3]);val[4]=max(.0001,val[4]);smooth.append(val)
  smooth.append(rings[-1])
  self.surface([[(x+rx*cos(t*2*pi/n),y+ry*sin(t*2*pi/n),z) for t in range(n)] for x,y,z,rx,ry in smooth],mat,weight)
 def oval(self,c,r,mat,n=20,lat=12,weight=1):
  self.surface([[(c[0]+r[0]*sin(pi*j/lat)*cos(2*pi*i/n),c[1]+r[1]*sin(pi*j/lat)*sin(2*pi*i/n),c[2]+r[2]*cos(pi*j/lat)) for i in range(n)] for j in range(lat+1)],mat,weight)
 def tube(self,pts,radii,mat,n=10,weight=1):
  rows=[]
  for j,p in enumerate(pts):
   tangent=Vector(pts[min(j+1,len(pts)-1)])-Vector(pts[max(0,j-1)]);tangent.normalize()
   axis=tangent.cross(Vector((0,1,0)))
   if axis.length<.01:axis=tangent.cross(Vector((1,0,0)))
   axis.normalize();other=tangent.cross(axis).normalized()
   rows.append([tuple(Vector(p)+radii[j]*(cos(i*2*pi/n)*axis+sin(i*2*pi/n)*other)) for i in range(n)])
  self.surface(rows,mat,weight)

def make_shape(stage,variant):
 s=Sculpt();age=AGES[stage];H=HEIGHTS[stage]*(.965 if variant==1 else 1)
 hh=H*[.285,.23,.185,.178,.18,.188,.204][stage]
 headz=H-hh*.49;neckz=H-hh*.96
 hw=hh*(.39 if variant==0 else .385);hd=hh*.365
 stoop=[0,0,0,0,.006,.035,.080][stage]
 belly=[.025,.006,0,.002,.018,.017,.008][stage]*H
 shoulder=H*[.155,.142,.128,.126,.137,.133,.130][stage]
 hipz=H*[.36,.43,.46,.47,.46,.45,.44][stage]
 hips=shoulder*(.77 if variant==0 else .84)
 # Face/head rings are sculpted jaw, chin, cheek, temple and cranial silhouettes.
 face=[(-.50,.04,.08),(-.465,.40,.52),(-.40,.66,.73),(-.29,.87,.85),(-.15,1.0,.95),(0,1.01,1),(.16,.98,.98),(.30,.90,.89),(.41,.73,.72),(.48,.43,.42),(.505,.025,.025)]
 rows=[]
 for rz,rx,ry in face:
  row=[]
  for k in range(40):
   t=k*2*pi/40;front=max(0,-sin(t));cheek=exp(-((rz+.10)/.14)**2)*.025*hh
   x=hw*rx*cos(t);y=hd*ry*sin(t)-stoop
   y-=front**5*cheek
   # Adult faces lengthen; older cheeks softly narrow without grotesque caricature.
   x*=1-(.035 if stage>4 else 0)*exp(-((rz+.2)/.18)**2)
   row.append((x,y,headz+hh*rz))
  rows.append(row)
 s.surface(rows,0)
 s.rings([(0,-stoop*.65,neckz-hh*.10,hw*.32,hd*.34),(0,-stoop*.85,neckz+hh*.04,hw*.36,hd*.37),(0,-stoop,neckz+hh*.20,hw*.42,hd*.40)],0)
 # Ears: shaped shell plus recessed concha and small tragus.
 for sign in [-1,1]:
  s.oval((sign*hw*.98,-stoop,headz-hh*.035),(hh*.075,hh*.047,hh*.118),0,n=16,lat=10)
  s.oval((sign*hw*1.035,-stoop-hh*.037,headz-hh*.035),(hh*.039,hh*.011,hh*.068),1,n=14,lat=8)
  s.oval((sign*hw*.996,-stoop-hh*.043,headz-hh*.062),(hh*.023,hh*.017,hh*.036),0,n=12,lat=8)
 # Soft protruding nose bridge and tip, individually modeled rather than a flat face.
 nz=headz-hh*.09
 s.rings([(0,-stoop-hd*.87,nz-hh*.095,hh*.025,hh*.026),(0,-stoop-hd*.99,nz-hh*.07,hh*.079,hh*.043),(0,-stoop-hd*1.10,nz-hh*.026,hh*.071,hh*.082),(0,-stoop-hd*1.05,nz+hh*.055,hh*.043,hh*.047),(0,-stoop-hd*.96,nz+hh*.16,hh*.028,hh*.027)],0,n=18)
 for sign in [-1,1]:
  s.oval((sign*hh*.047,-stoop-hd*1.085,nz-hh*.063),(hh*.020,hh*.007,hh*.009),1,n=12,lat=6)
 # Almond eyes framed with skin lids. The large iris carries two actual catchlight meshes.
 eyez=headz+hh*.053;eyex=hw*.43;eyef=-stoop-hd*.928
 for sign in [-1,1]:
  ex=sign*eyex
  s.oval((ex,eyef,eyez),(hh*.093,hh*.038,hh*.056),3,n=24,lat=12)
  s.oval((ex,eyef-hh*.035,eyez),(hh*.044,hh*.013,hh*.047),4,n=20,lat=10)
  s.oval((ex,eyef-hh*.047,eyez),(hh*.022,hh*.007,hh*.029),5,n=16,lat=8)
  s.oval((ex-hh*.013,eyef-hh*.052,eyez+hh*.017),(hh*.012,hh*.003,hh*.013),3,n=10,lat=6)
  for upper in [True,False]:
   pts=[]
   for k in range(13):
    t=pi*k/12;dx=-cos(t)*hh*.094;z=sin(t)*hh*(.055 if upper else -.052)
    pts.append((ex+dx,eyef-hh*.010-sin(t)*hh*.014,eyez+z))
   s.tube(pts,[hh*(.010 if upper else .007)]*13,0,n=6)
  pts=[(ex+hh*(-.098+.196*k/8),eyef+hh*.006,eyez+hh*(.108+.025*sin(pi*k/8))) for k in range(9)]
  s.tube(pts,[hh*(.007+.007*sin(pi*k/8)) for k in range(9)],2,n=6)
 # Closed gentle smile with separate lip volumes and corners.
 lipz=headz-hh*.267;lipy=-stoop-hd*.873
 pts=[(hh*(-.115+.23*k/14),lipy-hh*.009*sin(pi*k/14),lipz+hh*.030*(abs(k-7)/7)**2) for k in range(15)]
 s.tube(pts,[hh*(.0025+.004*sin(pi*k/14)) for k in range(15)],6,n=6)
 pts2=[(x,y+.001,z-hh*.016*sin(pi*k/14)) for k,(x,y,z) in enumerate(pts)]
 s.tube(pts2,[hh*(.001+.007*sin(pi*k/14)) for k in range(15)],7,n=6)
 # Subtle cheek blush is a thin fitted sculpt, same warm skin family.
 for sign in [-1,1]:
  s.oval((sign*hw*.64,-stoop-hd*.81,headz-hh*.115),(hh*.053,hh*.002,hh*.022),1,n=16,lat=8)
 # Fine age creases emerge through morphing; young targets keep them below the skin.
 mature=[0,0,0,0,.20,.65,1][stage]
 for sign in [-1,1]:
  for line in range(2):
   pts=[]
   for k in range(9):
    t=k/8;x=sign*(eyex+hh*(.085+.043*t));z=eyez-hh*(.028+line*.028)*t
    y=-stoop-hd*.84-hh*.010*mature
    pts.append((x,y,z))
   s.tube(pts,[hh*(.00015+.0025*mature)*sin(pi*(k+.5)/9) for k in range(9)],1,n=6)
 # Full hair cap: side-swept fringe for A; rounded, tucked bob for B.
 rows=[]
 for j in range(15):
  row=[]
  v=j/14
  for k in range(48):
   t=k*2*pi/48;front=max(0,-sin(t));back=max(0,sin(t))
   if variant==0:
    boundary=1.68-.42*front+.10*back+.13*front*cos(t)-[0,0,0,0,.04,.12,.22][stage]*front
   else:boundary=2.38-.99*front+.10*back+.14*front*cos(t)
   p=.018+(boundary-.018)*v
   wave=.012*sin(t*7+p*3)*sin(p)**2
   x=hw*(1.14+wave)*sin(p)*cos(t)
   y=-stoop+hd*(1.15+wave)*sin(p)*sin(t)
   z=headz+hh*.57*cos(p)+hh*.026+hh*.028*front*sin(p)*(-cos(t)*.4+.7)
   if variant==1 and v>.73 and front<.4:x*=1+.10*(v-.73)/.27
   row.append((x,y,z))
  rows.append(row)
 s.surface(rows,2)
 # Sculpted lock ridges follow the cap and break up a helmet silhouette.
 for lock in range(7):
  t0=-pi*.98+lock*pi*.148
  pts=[]
  for k in range(12):
   p=.23+k*.078;t=t0+.25*sin(p)
   pts.append((hw*1.15*sin(p)*cos(t),-stoop+hd*1.17*sin(p)*sin(t),headz+hh*.586*cos(p)+hh*.033))
  s.tube(pts,[hh*(.003+.007*sin(pi*k/11)) for k in range(12)],8,n=6)
 # Garment: custom knit torso with shoulders, waist shaping and a ribbed hem.
 torso=[(hipz,hips*.98,.090*H),(hipz+.025*H,hips*1.04,.103*H),(hipz+.10*H,hips*.97,.098*H),(hipz+.20*H,shoulder*.90,.092*H),(neckz-.115*H,shoulder,.087*H),(neckz-.055*H,shoulder*.84,.080*H),(neckz-.017*H,hw*.45,.058*H)]
 s.rings([(0,-stoop*.45*(z/H),z,x,y+belly*exp(-((z/H-.55)/.11)**2)) for z,x,y in torso],9,n=32,weight=.8)
 s.rings([(0,-stoop*.4,hipz+q*H,hips*r,.103*H) for q,r in [(0,1.015),(.007,1.04),(.021,1.04),(.026,1.01)]],10 if variant==0 else 12,n=32,weight=.65)
 s.rings([(0,-stoop*.75,neckz+q*H,hw*r,hh*.145) for q,r in [(-.031,.48),(-.022,.48),(-.010,.43),(-.012,.36)]],10,n=28)
 # A: cardigan placket and real buttons. B: contrasting dungaree bib, shoulder straps and pocket.
 if variant==0:
  pts=[(0,-(.10*H+belly*.7)-stoop*.30,z) for z in [hipz+.025*H,hipz+.10*H,hipz+.20*H,neckz-.08*H]]
  s.tube(pts,[.009*H]*4,10,n=8)
  for k in range(4):
   z=hipz+H*(.05+k*.055)
   s.oval((0,-(.112*H+belly*.75)-stoop*.30,z),(.010*H,.005*H,.010*H),11,n=12,lat=6)
 else:
  # Bib is a fitted front cloth panel, with thickness above the underlying knit.
  bib=[]
  for j in range(10):
   row=[];z=hipz+H*(.023+.221*j/9);width=hips*(.94-.20*j/9)
   for k in range(17):
    x=width*(-1+k/8); torso_rx=hips*(1.04-.07*j/9);torso_ry=(.105-.011*j/9)*H+belly*exp(-((z/H-.55)/.11)**2)
    y=-torso_ry*math.sqrt(max(.06,1-(x/torso_rx)**2))-stoop*.45*(z/H)-.004*H
    row.append((x,y,z))
   bib.append(row)
  s.surface(bib,12,weight=.8,wrap=False,cap=False)
  def garment_surface(z,x,front):
   for a,b in zip(torso,torso[1:]):
    if a[0]<=z<=b[0]:
     t=(z-a[0])/(b[0]-a[0]);rx=a[1]*(1-t)+b[1]*t;ry=a[2]*(1-t)+b[2]*t+belly*exp(-((z/H-.55)/.11)**2)
     return (-1 if front else 1)*(ry*math.sqrt(max(.03,1-(x/rx)**2))+.007*H)-stoop*.45*(z/H)
   return 0
  for sign in [-1,1]:
   strapx=sign*hips*.63;strap=[]
   for k in range(14):
    z=(hipz+.22*H)*(1-k/13)+(neckz-.041*H)*(k/13);strap.append((strapx,garment_surface(z,strapx,True),z))
   strap.append((strapx,-stoop*.45,neckz-.026*H))
   for k in range(20):
    z=(neckz-.041*H)*(1-k/19)+(hipz+.035*H)*(k/19);strap.append((strapx,garment_surface(z,strapx,False),z))
   s.tube(strap,[.012*H]*len(strap),12,n=10)
   s.oval((sign*hips*.63,-.112*H-stoop*.4,hipz+.235*H),(.008*H,.004*H,.008*H),11,n=12,lat=6)
  # Curved front pocket panel follows the bib.
  rows=[]
  for j in range(5):
   row=[]
   for k in range(9):
    x=(-1+k/4)*hips*.49;z=hipz+H*(.105+.071*j/4)+.008*H*(x/hips)**2
    y=-(.111*H+belly)*math.sqrt(max(.1,1-(x/(hips*1.01))**2))-stoop*.4-.005*H
    row.append((x,y,z))
   rows.append(row)
  s.surface(rows,13,weight=.8,wrap=False,cap=False)
 # Shaped arms/sleeves, detailed palm and five separated fingers.
 armz=neckz-.08*H;wristz=hipz+.015*H
 for sign in [-1,1]:
  ax=sign*shoulder*.88;wx=sign*shoulder*1.32
  s.rings([(ax,-stoop*.4,armz+.018*H,.008*H,.012*H),(ax+sign*.016*H,-stoop*.3,armz+.005*H,.040*H,.045*H),(sign*shoulder*1.10,0,armz-.035*H,.058*H,.060*H),(sign*shoulder*1.13,0,armz-.07*H,.060*H,.062*H),(sign*shoulder*1.22,-.007*H,(armz+wristz)/2,.050*H,.052*H),(wx,-.009*H,wristz+.035*H,.036*H,.040*H),(wx,-.009*H,wristz,.033*H,.036*H)],9,n=24,weight=.45)
  s.rings([(wx,-.009*H,wristz+q*H,.036*H,.040*H) for q in [-.006,.004,.018]],10,n=24,weight=.4)
  palmz=wristz-.041*H
  s.oval((wx,-.01*H,palmz),(.034*H,.027*H,.052*H),0,n=20,lat=12,weight=.3)
  for finger in range(4):
   fx=wx+(finger-1.5)*.015*H;length=[.035,.046,.048,.039][finger]*H
   pts=[(fx,-.012*H,palmz-.020*H),(fx+sign*.002*H,-.018*H,palmz-.040*H),(fx+sign*.001*H,-.025*H,palmz-.024*H-length)]
   s.tube(pts,[.009*H,.0085*H,.003*H],0,n=8,weight=.3)
  s.tube([(wx-sign*.026*H,-.01*H,palmz+.011*H),(wx-sign*.043*H,-.023*H,palmz-.010*H),(wx-sign*.041*H,-.030*H,palmz-.031*H)],[.012*H,.011*H,.004*H],0,n=10,weight=.3)
 # Trouser legs use tapered anatomical rings; grounded, sculpted sneakers.
 legx=hips*.53;kneez=hipz*.51
 for sign in [-1,1]:
  lx=sign*legx
  s.rings([(lx,0,.065*H,.046*H,.048*H),(lx,.007*H,.105*H,.048*H,.050*H),(lx,.013*H,kneez,.059*H,.063*H),(lx,.005*H,hipz*.77,.071*H,.079*H),(lx,0,hipz+.024*H,hips*.56,.088*H)],12,n=28,weight=0)
  # Foot axis runs along y. Ring loft has rounded toe, vamp and heel.
  rows=[]
  for y,rx,rz,zc in [(-.127,.015,.011,.031),(-.117,.048,.026,.031),(-.083,.056,.035,.041),(-.035,.049,.050,.052),(.010,.045,.050,.052),(.053,.043,.036,.041),(.063,.020,.022,.035)]:
   rows.append([(lx+rx*H*cos(k*2*pi/28),y*H,H*(zc+rz*sin(k*2*pi/28))) for k in range(28)])
  s.surface(rows,14,weight=0)
  # Ivory welt traces the sole's oval outline.
  s.rings([(lx,-.028*H,.009*H,.053*H,.090*H),(lx,-.028*H,.021*H,.056*H,.092*H),(lx,-.028*H,.028*H,.053*H,.090*H)],15,n=32,weight=0)
  for k in range(3):
   y=(-.063+k*.017)*H;z=(.077+k*.006)*H
   s.tube([(lx-.025*H,y,z),(lx,y-.003*H,z+.005*H),(lx+.025*H,y,z)],[.0035*H]*3,15,n=6,weight=0)
 return s

def build(variant):
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
 bpy.data.orphans_purge(do_recursive=True)
 palette=[('Skin',(.70,.405,.245)),('WarmDetail',(.64,.31,.23)),('Hair',(.15,.064,.035)),('EyesWhite',(.94,.90,.80)),('Iris',(.20,.105,.047)),('Pupil',(.024,.014,.01)),('Smile',(.35,.13,.085)),('Lip',(.65,.305,.22)),('HairRidge',(.19,.082,.046)),('Knit',(.81,.65,.43) if variant==0 else (.90,.79,.58)),('Ribbing',(.68,.45,.27) if variant==0 else (.83,.67,.43)),('Buttons',(.32,.20,.11)),('Trousers',(.30,.34,.245) if variant==0 else (.62,.285,.16)),('Pocket',(.68,.335,.20)),('Sneakers',(.70,.33,.19) if variant==0 else (.75,.50,.29)),('Soles',(.92,.85,.70))]
 mats=[material(n,c) for n,c in palette]
 base=make_shape(3,variant);mesh=bpy.data.meshes.new('HandSculptedHumanSurface');mesh.from_pydata(base.v,[],base.f);mesh.update()
 obj=bpy.data.objects.new('Character_'+('A' if variant==0 else 'B'),mesh);bpy.context.collection.objects.link(obj)
 for m in mats:mesh.materials.append(m)
 for p,idx in zip(mesh.polygons,base.m):p.material_index=idx;p.use_smooth=True
 bpy.context.view_layer.objects.active=obj;obj.select_set(True)
 bm=bmesh.new();bm.from_mesh(mesh);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(mesh);bm.free()
 obj.shape_key_add(name='Basis')
 for stage in range(7):
  shape=make_shape(stage,variant);assert len(shape.v)==len(base.v)
  key=obj.shape_key_add(name='age_'+str(AGES[stage]))
  for p,co in zip(key.data,shape.v):p.co=co
 obj['age_anchors']=AGES;obj['age_labels']=NAMES;obj['appearance_only']=True
 # Non-destructive smoothed normals; complete surface topology stays identical for all stages.
 arm=bpy.data.armatures.new('LifeRig');rig=bpy.data.objects.new('LifeRig',arm);bpy.context.collection.objects.link(rig)
 bpy.context.view_layer.objects.active=rig;obj.select_set(False);rig.select_set(True);bpy.ops.object.mode_set(mode='EDIT')
 root=arm.edit_bones.new('Root');root.head=(0,0,0);root.tail=(0,0,.1)
 breath=arm.edit_bones.new('Breath');breath.head=(0,0,0);breath.tail=(0,0,.6);breath.parent=root
 bpy.ops.object.mode_set(mode='OBJECT')
 g0=obj.vertex_groups.new(name='Root');g1=obj.vertex_groups.new(name='Breath')
 for i,w in enumerate(base.w):
  g0.add([i],1-w,'REPLACE');g1.add([i],w,'REPLACE')
 mod=obj.modifiers.new('Gentle skeletal breathing','ARMATURE');mod.object=rig;obj.parent=rig
 b=rig.pose.bones['Breath'];b.rotation_mode='XYZ'
 for frame,t in [(1,0),(31,1),(61,0),(91,-1),(121,0)]:
  b.scale=(1+t*.002,1+t*.005,1+t*.0018);b.rotation_euler=(0,t*.003,0)
  b.keyframe_insert(data_path='scale',frame=frame);b.keyframe_insert(data_path='rotation_euler',frame=frame)
 rig.animation_data.action.name='Idle_Breathe'
 scene=bpy.context.scene;scene.frame_start=1;scene.frame_end=121;scene.render.fps=30;scene.frame_set(1)
 obj.select_set(True);rig.select_set(True);bpy.context.view_layer.objects.active=obj
 asset='life-character-'+('a' if variant==0 else 'b')
 bpy.ops.export_scene.gltf(filepath=os.path.join(OUT,asset+'.glb'),export_format='GLB',use_selection=True,export_animations=True,export_morph=True,export_morph_normal=True,export_skins=True,export_extras=True,export_animation_mode='ACTIONS',export_force_sampling=True)
 bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,asset+'.blend'))
 # Render review frames. Orthographic scale is consistent, so life-stage growth is visible.
 scene.render.engine='CYCLES';scene.cycles.samples=32;scene.cycles.use_denoising=True
 scene.render.resolution_x=320;scene.render.resolution_y=420;scene.render.resolution_percentage=100
 scene.render.image_settings.file_format='PNG';scene.render.film_transparent=False
 scene.world.color=(.55,.55,.55)
 scene.world.use_nodes=True;scene.world.node_tree.nodes.get('Background').inputs[0].default_value=(.77,.70,.59,1);scene.world.node_tree.nodes.get('Background').inputs[1].default_value=.65
 scene.view_settings.view_transform='AgX'
 bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.008));floor=bpy.context.object;floor.name='StudioFloor';floor.data.materials.append(material('StudioCream',(.80,.75,.65)))
 for name,loc,power,size in [('Key',(-3,-4,6),450,5),('Fill',(3,-2,3),250,4),('Rim',(1,3,5),400,3)]:
  data=bpy.data.lights.new(name,'AREA');data.energy=power;data.shape='DISK';data.size=size;light=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(light);light.location=loc;light.rotation_euler=(Vector((0,0,.9))-light.location).to_track_quat('-Z','Y').to_euler()
 cd=bpy.data.cameras.new('Camera');cam=bpy.data.objects.new('Camera',cd);bpy.context.collection.objects.link(cam);scene.camera=cam;cd.type='ORTHO';cd.ortho_scale=2.0
 os.makedirs(os.path.join(OUT,'renders'),exist_ok=True)
 for stage in range(7):
  for k in obj.data.shape_keys.key_blocks:k.value=0
  obj.data.shape_keys.key_blocks['age_'+str(AGES[stage])].value=1
  grey=[0,0,0,0,.15,.55,.90][stage];hc=(.15,.064,.035) if variant==0 else (.20,.082,.046)
  for idx in [2,8]:
   c=tuple(hc[i]*(1-grey)+(.65,.62,.56)[i]*grey for i in range(3));mats[idx].node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value=(*c,1)
  for view,loc in [('front',(0,-5,1.12)),('side',(5,-.15,1.12)),('back',(0,5,1.12))]:
   cam.location=loc;cam.rotation_euler=(Vector((0,0,.86))-cam.location).to_track_quat('-Z','Y').to_euler()
   scene.render.filepath=os.path.join(OUT,'renders',f'{asset}-{AGES[stage]}-{view}.png');bpy.ops.render.render(write_still=True)
  if stage==3:
   cam.location=(0,-6,1.3);cam.rotation_euler=(Vector((0,0,.86))-cam.location).to_track_quat('-Z','Y').to_euler();scene.render.resolution_x=600;scene.render.resolution_y=760
   scene.render.film_transparent=True;floor.hide_render=True;scene.render.filepath=os.path.join(OUT,asset+'-poster.png');bpy.ops.render.render(write_still=True)
   scene.render.film_transparent=False;floor.hide_render=False;scene.render.resolution_x=320;scene.render.resolution_y=420
 return dict(id=asset,vertices=len(base.v),faces=len(base.f),heightMeters=HEIGHTS[3]*(.965 if variant else 1),bytes=os.path.getsize(os.path.join(OUT,asset+'.glb')))

results=[build(0),build(1)]
with open(os.path.join(OUT,'metadata.json'),'w') as f:json.dump({'generator':'Blender 4.5 / original parametric sculpt','characters':results,'ageAnchors':AGES,'ageLabels':NAMES,'morphTargets':['age_'+str(a) for a in AGES],'basisAge':25,'blendRule':'Set exactly the two bracketing age targets; weights sum to 1. Basis is age 25. All target values 0 also produces age 25.','animation':'Idle_Breathe','durationSeconds':4,'upAxis':'GLB +Y','frontAxis':'GLB +Z','hairMaterials':['Hair','HairRidge'],'hairColorsByAge':['#6c4835','#6c4835','#6c4835','#6c4835','#806454','#aaa297','#d4d0c6'],'appearanceOnly':True},f,indent=2)
print('DONE',json.dumps(results))
