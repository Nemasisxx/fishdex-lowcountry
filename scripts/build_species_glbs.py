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
def make(name,p):
 L,H,D=p['length'],p['height'],p['depth'];C=p['color'];fin=[max(0,int(v*.76)) for v in C[:3]]+[255]
 scene=trimesh.Scene()
 def add(m,key):scene.add_geometry(m,geom_name=key)
 add(uv_sphere([L*.43,H*.51,D*.56],[0,0,0],C),'body')
 add(uv_sphere([L*.30,H*.15,D*.47],[.03,-H*.24,0],[207,212,190,255]),'belly')
 add(uv_sphere([L*.17,H*.30,D*.49],[L*.31,H*.035,0],C),'head')
 add(plate([[-L*.37,0,0],[-L*.67,H*.36,0],[-L*.58,0,0],[-L*.67,-H*.36,0]],fin),'tail')
 add(plate([[-L*.22,H*.34,0],[-L*.14,H*.8,0],[L*.11,H*.47,0],[L*.21,H*.29,0]],fin),'dorsal')
 add(plate([[-L*.20,-H*.30,0],[-L*.09,-H*.62,0],[L*.12,-H*.31,0]],fin),'anal')
 for side in [-1,1]:
  add(uv_sphere([.07,.07,.035],[L*.32,H*.13,side*D*.50],[20,28,29,255]),'eye'+str(side))
  add(uv_sphere([.024,.024,.014],[L*.34,H*.15,side*(D*.50+.03)],[246,249,239,255]),'glint'+str(side))
  add(plate([[L*.12,-H*.08,side*D*.45],[-L*.15,-H*.38,side*D*.5],[L*.17,-H*.22,side*D*.45]],fin,.02),'pectoral'+str(side))
 if p.get('bands'):
  for i in range(5):
   x=-L*.3+i*L*.14
   add(uv_sphere([L*.028,H*.40,D*.565],[x,0,0],[48,65,66,255]),'band'+str(i))
 if p.get('stripe'):
  for side in [-1,1]:add(uv_sphere([L*.36,.024,.014],[0,H*.08,side*D*.56],[39,57,54,255]),'lateral'+str(side))
 if p.get('spots'):
  for side in [-1,1]:
   for i in range(26 if name=='spotted-seatrout' else 5):
    x=-L*.30+(i*0.61803398875%1)*L*.65
    y=H*(-.17+(i*0.41421356237%1)*.48)
    r=(x/(L*.44))**2+(y/(H*.52))**2
    if r>=.9:continue
    z=side*D*.57*math.sqrt(1-r)
    add(uv_sphere([.027,.027,.012],[x,y,z],[45,60,48,255]),'spot'+str(side)+'_'+str(i))
 if p.get('flat'):
  # Flounder eyes migrate to the upper-facing side.
  add(uv_sphere([.09,.09,.035],[L*.28,H*.20,D*.23],[24,30,22,255]),'upper-eye')
  add(uv_sphere([.09,.09,.035],[L*.15,H*.31,D*.23],[24,30,22,255]),'upper-eye-2')
  add(plate([[-L*.39,-H*.38,0],[-L*.33,-H*.55,0],[L*.33,-H*.48,0],[L*.40,-H*.32,0]],fin),'long-anal')
 out=os.path.join(OUT,name+'.glb');data=scene.export(file_type='glb')
 with open(out,'wb') as f:f.write(data)
 print(name,len(data),'bytes')
for name,p in SPECIES.items():make(name,p)
