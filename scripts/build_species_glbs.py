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
def make(name,p):
 L,H,D=p['length'],p['height'],p['depth'];C=p['color'];fin=[max(0,int(v*.8)) for v in C[:3]]+[255]
 scene=trimesh.Scene()
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
