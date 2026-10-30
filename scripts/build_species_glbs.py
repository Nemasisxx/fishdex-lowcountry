"""Build five lightweight species-specific glTF binary fish assets. Requires trimesh and numpy."""
import os, math, numpy as np, trimesh
from trimesh.transformations import rotation_matrix
OUT='models';os.makedirs(OUT,exist_ok=True)
SPECIES={
 'red-drum':dict(length=2.65,height=.88,depth=.48,color=[177,108,72,255],spots=True,tail='fork'),
 'spotted-seatrout':dict(length=2.9,height=.64,depth=.36,color=[144,162,139,255],spots=True,tail='fork'),
 'sheepshead':dict(length=2.0,height=1.3,depth=.46,color=[151,164,163,255],bands=True,tail='fork'),
 'flounder':dict(length=2.15,height=.85,depth=.19,color=[148,123,84,255],flat=True,tail='round'),
 'snook':dict(length=3.0,height=.73,depth=.39,color=[163,184,163,255],stripe=True,tail='fork'),
}
def uv_sphere(scale,offset,color):
 m=trimesh.creation.icosphere(subdivisions=3,radius=1);m.apply_scale(scale);m.apply_translation(offset);m.visual.vertex_colors=np.tile(np.array(color,dtype=np.uint8),(len(m.vertices),1));return m
def plate(points,color,thickness=.035):
 points=np.array(points,float)
 # flat triangulated fan, with thickness on z axis
 vertices=np.concatenate([points+np.array([0,0,thickness]),points-np.array([0,0,thickness])])
 n=len(points);faces=[]
 for i in range(1,n-1):faces.extend([[0,i,i+1],[n,n+i+1,n+i]])
 for i in range(n):j=(i+1)%n;faces.extend([[i,j,n+j],[i,n+j,n+i]])
 mesh=trimesh.Trimesh(vertices=vertices,faces=faces,process=False)
 mesh.visual.vertex_colors=np.tile(np.array(color,dtype=np.uint8),(len(vertices),1))
 return mesh
def body_mesh(L,H,D,C):
 # Continuous tapered silhouette, not overlapping oval spheres.
 stations=[(-.52,.035,.08),(-.44,.23,.30),(-.31,.65,.72),(-.14,.92,.96),(.05,1,1),(.24,.83,.88),(.38,.55,.65),(.47,.29,.38),(.53,.10,.12)]
 verts=[];faces=[];n=24
 for x,h,d in stations:
  for k in range(n):
   a=2*math.pi*k/n
   verts.append([x*L,math.sin(a)*H*.5*h,math.cos(a)*D*.5*d])
 for i in range(len(stations)-1):
  for k in range(n):
   a=i*n+k;b=i*n+(k+1)%n;c=(i+1)*n+k;d=(i+1)*n+(k+1)%n
   faces.extend([[a,c,b],[b,c,d]])
 faces.extend([[0,k+1,k] for k in range(1,n-1)])
 offset=(len(stations)-1)*n
 faces.extend([[offset,offset+k,offset+k+1] for k in range(1,n-1)])
 m=trimesh.Trimesh(vertices=np.array(verts),faces=faces,process=False)
 colors=[]
 for v in verts:
  t=(v[1]/(H*.5)+1)/2
  factor=.72+.35*t
  colors.append([min(255,int(c*factor)) for c in C[:3]]+[255])
 m.visual.vertex_colors=np.array(colors,dtype=np.uint8)
 return m
def red_drum_body(L,H,D):
 # Higher-density longitudinal mesh with smooth continuous anatomy and metallic color gradation.
 stations=100;radial=48;vertices=[];colors=[];faces=[]
 for i in range(stations):
  u=i/(stations-1);x=(-.52+1.05*u)*L
  # Peduncle at tail; deep shoulders behind head; wedge-shaped snout.
  if u<.13: profile=.14+.65*u/.13
  elif u<.38: profile=.79+.21*(u-.13)/.25
  elif u<.72: profile=1-.25*(u-.38)/.34
  else: profile=max(.045,.75*(1-(u-.72)/.28)**.72)
  for j in range(radial):
   a=2*math.pi*j/radial; y=math.sin(a)*H*.5*profile;z=math.cos(a)*D*.5*profile
   vertices.append([x,y,z])
   upper=(math.sin(a)+1)/2
   # Copper back, pearly silver-gold belly; subtle banding and scales.
   base=np.array([205,181,138])*(1-upper)+np.array([118,115,91])*upper
   glimmer=6*math.sin(i*1.9+j*.65)+3*math.sin(i*3.3-j*1.1)
   base=np.clip(base+glimmer,0,255)
   colors.append([*base.astype(int),255])
 for i in range(stations-1):
  for j in range(radial):
   a=i*radial+j;b=i*radial+(j+1)%radial;c=(i+1)*radial+j;d=(i+1)*radial+(j+1)%radial
   faces.extend([[a,c,b],[b,c,d]])
 m=trimesh.Trimesh(vertices=vertices,faces=faces,process=False)
 m.visual.vertex_colors=np.array(colors,dtype=np.uint8)
 return m
def add_red_drum(scene,p):
 L,H,D=p['length'],p['height'],p['depth']
 def add(m,n):scene.add_geometry(m,geom_name=n)
 add(red_drum_body(L,H,D),'body')
 fin=[142,111,81,255]
 # Strong forked caudal fin attached at narrow peduncle.
 add(plate([[-L*.51,0,0],[-L*.70,H*.40,0],[-L*.65,H*.11,0],[-L*.65,-H*.11,0],[-L*.70,-H*.40,0]],fin,.014),'tail')
 add(plate([[-L*.30,H*.27,0],[-L*.23,H*.64,0],[-L*.11,H*.52,0],[L*.02,H*.51,0],[L*.18,H*.33,0]],fin,.012),'spiny-dorsal')
 add(plate([[L*.06,H*.30,0],[L*.19,H*.46,0],[L*.31,H*.22,0]],fin,.012),'soft-dorsal')
 add(plate([[-L*.21,-H*.28,0],[-L*.12,-H*.50,0],[L*.08,-H*.33,0]],fin,.012),'anal')
 for side in [-1,1]:
  add(uv_sphere([.054,.054,.018],[L*.355,H*.10,side*D*.29],[22,24,20,255]),'eye'+str(side))
  add(uv_sphere([.018,.018,.008],[L*.367,H*.114,side*D*.305],[245,245,230,255]),'eye-highlight'+str(side))
  add(plate([[L*.14,-H*.06,side*D*.34],[-L*.13,-H*.38,side*D*.34],[L*.12,-H*.27,side*D*.34]],fin,.012),'pectoral'+str(side))
  # Signature black ocellated spot at upper caudal peduncle.
  add(uv_sphere([.075,.064,.011],[-L*.39,H*.13,side*D*.15],[28,31,25,255]),'tail-spot'+str(side))
  add(uv_sphere([.023,.018,.009],[-L*.38,H*.15,side*D*.163],[88,81,65,255]),'spot-glint'+str(side))
  # Gill line, small mouth, and lateral-line ridge.
  add(uv_sphere([.012,H*.29,.009],[L*.24,-H*.01,side*D*.30],[92,84,68,255]),'gill'+str(side))
  add(uv_sphere([L*.23,.009,.008],[-L*.03,H*.02,side*D*.42],[167,151,116,255]),'lateral-line'+str(side))
 add(plate([[L*.48,-H*.08,0],[L*.55,-H*.10,0],[L*.50,-H*.13,0]],[85,69,59,255],.009),'mouth')
def make(name,p):
 L,H,D=p['length'],p['height'],p['depth'];C=p['color'];fin=[max(0,int(v*.8)) for v in C[:3]]+[255]
 scene=trimesh.Scene()
 if name=='red-drum':
  add_red_drum(scene,p)
  out=os.path.join(OUT,name+'.glb');data=scene.export(file_type='glb')
  with open(out,'wb') as f:f.write(data)
  print(name,len(data),'bytes');return
 def add(m,key):scene.add_geometry(m,geom_name=key)
 add(body_mesh(L,H,D,C),'body')
 # Tail peduncle connects the caudal fin directly to the body.
 add(plate([[-L*.51,0,0],[-L*.70,H*.42,0],[-L*.62,H*.09,0],[-L*.62,-H*.09,0],[-L*.70,-H*.42,0]],fin),'tail')
 add(plate([[-L*.30,H*.25,0],[-L*.18,H*.72,0],[-L*.07,H*.52,0],[L*.05,H*.57,0],[L*.20,H*.33,0]],fin),'dorsal')
 add(plate([[-L*.28,-H*.25,0],[-L*.18,-H*.54,0],[L*.10,-H*.34,0]],fin),'anal')
 for side in [-1,1]:
  add(uv_sphere([.056,.056,.027],[L*.365,H*.10,side*D*.26],[15,25,27,255]),'eye'+str(side))
  add(uv_sphere([.018,.018,.009],[L*.38,H*.12,side*D*.28],[248,249,241,255]),'glint'+str(side))
  add(plate([[L*.10,-H*.09,side*D*.32],[-L*.17,-H*.40,side*D*.33],[L*.12,-H*.24,side*D*.33]],fin,.014),'pectoral'+str(side))
 if p.get('bands'):
  for i in range(5):
   x=-L*.32+i*L*.145
   add(uv_sphere([L*.026,H*.35,D*.45],[x,0,0],[48,65,66,255]),'band'+str(i))
 if p.get('stripe'):
  for side in [-1,1]:add(uv_sphere([L*.35,.018,.014],[0,H*.07,side*D*.39],[39,57,54,255]),'lateral'+str(side))
 if p.get('spots'):
  for side in [-1,1]:
   for i in range(32 if name=='spotted-seatrout' else 5):
    x=-L*.28+(i*.61803398875%1)*L*.57
    y=H*(-.12+(i*.41421356237%1)*.37)
    r=(x/(L*.47))**2+(y/(H*.5))**2
    if r>=.8:continue
    z=side*D*.47*math.sqrt(1-r)
    add(uv_sphere([.020,.020,.008],[x,y,z],[45,60,48,255]),'spot'+str(side)+'_'+str(i))
 if p.get('flat'):
  for i,(x,y) in enumerate([(.30,.17),(.19,.27)]):
   add(uv_sphere([.07,.07,.022],[L*x,H*y,D*.26],[24,30,22,255]),'upper-eye'+str(i))
  add(plate([[-L*.39,-H*.35,0],[-L*.32,-H*.53,0],[L*.31,-H*.43,0],[L*.41,-H*.25,0]],fin),'long-anal')
 out=os.path.join(OUT,name+'.glb');data=scene.export(file_type='glb')
 with open(out,'wb') as f:f.write(data)
 print(name,len(data),'bytes')
for name,p in SPECIES.items():make(name,p)
