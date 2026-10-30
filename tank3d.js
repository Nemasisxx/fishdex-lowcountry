import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';
const host=document.getElementById('tank-canvas');
const scene=new THREE.Scene();scene.background=new THREE.Color(0x238eb2);scene.fog=new THREE.FogExp2(0x2398b5,.021);
const camera=new THREE.PerspectiveCamera(48,1,.1,100);camera.position.set(0,1,17);camera.lookAt(0,0,0);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor(0x238eb2);host.append(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xf4ffff,0x4e929c,3.2));
const sun=new THREE.DirectionalLight(0xffffff,3.2);sun.position.set(-4,9,7);scene.add(sun);
const tank=new THREE.Group();scene.add(tank);
const sand=new THREE.Mesh(new THREE.BoxGeometry(14,.25,8),new THREE.MeshStandardMaterial({color:0xd9c79e,roughness:.92}));sand.position.y=-3.45;tank.add(sand);
const back=new THREE.Mesh(new THREE.PlaneGeometry(14,7),new THREE.MeshPhongMaterial({color:0x2ab1cf,transparent:true,opacity:.16,side:THREE.DoubleSide}));back.position.z=-4;tank.add(back);
const gravel=new THREE.Group();tank.add(gravel);
for(let i=0;i<190;i++){const m=new THREE.Mesh(new THREE.IcosahedronGeometry(.05+Math.random()*.13,0),new THREE.MeshStandardMaterial({color:[0xe3d7b7,0x9caa9c,0xc6b28a][i%3],roughness:1}));m.position.set((Math.random()-.5)*13.7,-3.28,(Math.random()-.5)*7.6);gravel.add(m)}
const plants=new THREE.Group();tank.add(plants);
for(let i=0;i<42;i++){const clump=new THREE.Group();clump.position.set((Math.random()-.5)*13,-3.28,(Math.random()-.5)*7);
 for(let j=0;j<4;j++){const h=.7+Math.random()*2;const blade=new THREE.Mesh(new THREE.ConeGeometry(.075,h,5),new THREE.MeshStandardMaterial({color:[0x248f75,0x3bc48b,0x71cb7d][j%3],side:THREE.DoubleSide}));blade.position.set((j-1.5)*.15,h/2,0);blade.rotation.z=(j-1.5)*.17;clump.add(blade)}plants.add(clump)}
const bubbles=[];
for(let i=0;i<85;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.035+Math.random()*.06,8,8),new THREE.MeshPhongMaterial({color:0xc5faff,transparent:true,opacity:.48}));m.position.set((Math.random()-.5)*13,-3+Math.random()*6.3,(Math.random()-.5)*7);scene.add(m);bubbles.push({mesh:m,speed:.008+Math.random()*.018})}
const mat=(color,side=THREE.FrontSide)=>new THREE.MeshStandardMaterial({color,metalness:.12,roughness:.65,side});
function fishProfile(s){
 const n=s.name.toLowerCase(),id=s.id;
 const p={length:2.35,height:.72,depth:.48,color:0x90aeb3,belly:0xc4d5d1,tail:0x7b9da5,kind:'fish'};
 if(/shark|hammerhead|bonnethead/.test(n))Object.assign(p,{length:3.2,height:.55,depth:.54,color:0x829aa6,tail:0x718d9b,kind:'shark'});
 else if(/eel/.test(n))Object.assign(p,{length:3.8,height:.19,depth:.23,color:0x776f49,kind:'eel'});
 else if(/flounder/.test(n))Object.assign(p,{length:2.1,height:.85,depth:.16,color:0x93794e,kind:'flat'});
 else if(/ray|stingray/.test(n))Object.assign(p,{length:1.9,height:.19,depth:2.2,color:0x877963,kind:'ray'});
 else if(/puffer/.test(n))Object.assign(p,{length:1.4,height:1.05,depth:.95,color:0xd7c589,kind:'round'});
 else if(/sunfish|bluegill|crappie|spadefish|sheepshead|triggerfish|tripletail|permit|pompano/.test(n))Object.assign(p,{length:1.85,height:1.2,depth:.38,color:0x93a6a3,kind:'deep'});
 else if(/tuna|mackerel|wahoo|bonito|mahi|marlin|sailfish|barracuda/.test(n))Object.assign(p,{length:3.15,height:.56,depth:.45,color:0x427eab,kind:'fast'});
 else if(/catfish|bullhead/.test(n))Object.assign(p,{length:2.7,height:.65,depth:.72,color:0x8e9478,kind:'catfish'});
 else if(/bass|grouper|snapper|drum|croaker|redfish/.test(n))Object.assign(p,{length:2.45,height:.85,depth:.62,color:0x9d9d82,kind:'robust'});
 if(/red drum|red snapper/.test(n))p.color=0xb76a45;
 if(/bluefish|bluegill|blue catfish|blue marlin/.test(n))p.color=0x407f9e;
 if(/yellow|golden|pompano|mahi/.test(n))p.color=0xb7ae5a;
 if(/black|bullhead|bowfin/.test(n))p.color=0x566e67;
 if(/spotted|speckled|seatrout/.test(n))p.color=0x899b85;
 if(/striped|sheepshead/.test(n))p.color=0x7e9296;
 if(/great white/.test(n))p.color=0x8497a0;
 p.id=id;return p;
}
function fin(points,color,opacity=1){
 const shape=new THREE.Shape();shape.moveTo(points[0][0],points[0][1]);points.slice(1).forEach(p=>shape.lineTo(p[0],p[1]));shape.closePath();
 return new THREE.Mesh(new THREE.ShapeGeometry(shape),new THREE.MeshStandardMaterial({color,side:THREE.DoubleSide,transparent:opacity<1,opacity,roughness:.6}));
}
function makeFish(s){
 const p=fishProfile(s),root=new THREE.Group(),bodyGroup=new THREE.Group();root.add(bodyGroup);
 const bodyGeometry=new THREE.SphereGeometry(1,48,32);
 const body=new THREE.Mesh(bodyGeometry,new THREE.MeshPhysicalMaterial({color:p.color,metalness:.16,roughness:.43,clearcoat:.42,clearcoatRoughness:.35}));
 body.scale.set(p.length*.45,p.height*.53,p.depth*.65);bodyGroup.add(body);
 const lateral=new THREE.Group();bodyGroup.add(lateral);
 // Subtle 3D scale plates and reflective flank markings on both sides.
 for(const side of [-1,1])for(let row=-2;row<=2;row++)for(let col=-8;col<=8;col++){
  const nx=col/10,ny=row/6,dist=nx*nx+ny*ny;if(dist>.84)continue;
  const plate=new THREE.Mesh(new THREE.SphereGeometry(1,6,5),new THREE.MeshStandardMaterial({color:p.color,roughness:.56,metalness:.18,transparent:true,opacity:.42}));
  plate.scale.set(.092,.058,.012);
  plate.position.set(nx*p.length*.43,ny*p.height*.52,side*p.depth*.65*Math.sqrt(1-dist));
  lateral.add(plate);
 }
 const mouth=new THREE.Mesh(new THREE.TorusGeometry(Math.max(.055,p.height*.115),.012,6,16,Math.PI),mat(0x394b50));
 mouth.rotation.y=Math.PI/2;mouth.position.set(p.length*.48,-p.height*.10,0);bodyGroup.add(mouth);
 for(const side of [-1,1]){
  const gill=new THREE.Mesh(new THREE.TorusGeometry(p.height*.21,.009,5,20,Math.PI*.82),mat(0x4a6566));
  gill.rotation.y=Math.PI/2;gill.position.set(p.length*.19,-.01,side*p.depth*.49);bodyGroup.add(gill);
 }
 const underside=new THREE.Mesh(new THREE.SphereGeometry(1,20,12),mat(p.belly));underside.scale.set(p.length*.34,p.height*.22,p.depth*.57);underside.position.y=-p.height*.21;bodyGroup.add(underside);
 const headX=p.length*.32,tailX=-p.length*.46;
 const snout=new THREE.Mesh(new THREE.ConeGeometry(p.height*.24,p.length*.32,18),mat(p.color));snout.rotation.z=-Math.PI/2;snout.position.x=headX;snout.scale.z=p.depth/Math.max(p.height,.15);bodyGroup.add(snout);
 const eyeRadius=Math.max(.035,Math.min(.10,p.height*.12));
 for(const side of [-1,1]){const eye=new THREE.Mesh(new THREE.SphereGeometry(eyeRadius,12,12),mat(0x0c1920));eye.position.set(p.length*.27,p.height*.12,side*(p.depth*.55+.025));bodyGroup.add(eye);
 const glint=new THREE.Mesh(new THREE.SphereGeometry(eyeRadius*.3,8,8),mat(0xffffff));glint.position.set(eye.position.x+.015,eye.position.y+.025,eye.position.z+side*eyeRadius*.75);bodyGroup.add(glint)}
 const tailPivot=new THREE.Group();tailPivot.position.x=tailX;bodyGroup.add(tailPivot);
 const tailHeight=p.kind==='shark'?p.height*1.3:p.kind==='eel'?p.height*.8:p.height*.85;
 const tail=fin([[0,0],[-p.length*.27,tailHeight*.65],[-p.length*.18,0],[-p.length*.27,-tailHeight*.65]],p.tail);tailPivot.add(tail);
 const tailRib=new THREE.Mesh(new THREE.CylinderGeometry(.016,.026,p.length*.20,8),mat(p.tail));tailRib.rotation.z=Math.PI/2;tailRib.position.x=-p.length*.08;tailPivot.add(tailRib);
 if(p.kind!=='ray'&&p.kind!=='eel'){
 const dorsal=fin([[-p.length*.18,p.height*.39],[-p.length*.11,p.height*.89],[p.length*.10,p.height*.51],[p.length*.2,p.height*.35]],p.tail);bodyGroup.add(dorsal);
 const lower=fin([[-p.length*.22,-p.height*.32],[-p.length*.12,-p.height*.68],[p.length*.04,-p.height*.38]],p.tail,.92);bodyGroup.add(lower);
 for(const side of [-1,1]){const pec=fin([[0,0],[-p.length*.16,-p.height*.43],[p.length*.10,-p.height*.17]],p.tail,.85);pec.position.set(p.length*.14,-p.height*.08,side*p.depth*.61);pec.rotation.y=side*.35;bodyGroup.add(pec)}
 }
 if(p.kind==='ray'){body.scale.set(p.length*.35,p.height*.65,p.depth*.5);const wings=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),mat(p.color,THREE.DoubleSide));wings.scale.set(p.length*.45,p.height*.3,p.depth*.58);bodyGroup.add(wings);tail.scale.set(1.8,.2,1)}
 if(/spotted|speckled|trout|croaker|grouper|snapper|flounder|sunfish|bass|puffer/.test(s.name.toLowerCase())){
  const dots=new THREE.Group();bodyGroup.add(dots);
  for(const side of [-1,1])for(let i=0;i<45;i++){
   const x=(Math.sin(i*29.7)*.8),y=Math.cos(i*13.4)*.66;
   if(x*x+y*y>.83)continue;
   const dot=new THREE.Mesh(new THREE.SphereGeometry(.018+(i%3)*.007,6,6),mat(0x374c45));
   dot.position.set(x*p.length*.42,y*p.height*.47,side*p.depth*.66*Math.sqrt(1-x*x-y*y));dots.add(dot);
  }
 }
 if(p.kind==='catfish'){for(const side of [-1,1]){const whisker=fin([[p.length*.42,-.04],[p.length*.66,-.17],[p.length*.47,-.12]],p.tail);whisker.position.z=side*p.depth*.3;bodyGroup.add(whisker)}}
 if(p.kind==='fast'||p.kind==='shark')bodyGroup.scale.set(1,.9,1);
 if(p.kind==='shark'){
  const upper=fin([[-p.length*.13,p.height*.34],[-p.length*.05,p.height*1.25],[p.length*.12,p.height*.34]],p.tail);
  bodyGroup.add(upper);
 }
 if(p.kind==='eel'){tail.scale.set(1.4,.65,1);body.scale.y=.6}
 if(p.kind==='flat'){bodyGroup.rotation.x=.19;body.scale.z=.34}
 if(p.kind==='round'){body.scale.set(p.length*.40,p.height*.65,p.depth*.65)}
 if(p.kind==='deep'){body.scale.y*=1.12}
 const stripe=/sheepshead|striped bass|tiger shark/.test(s.name.toLowerCase());
 if(stripe)for(let k=0;k<4;k++){const band=new THREE.Mesh(new THREE.TorusGeometry(p.height*.29,.023,6,28),mat(0x314b56));band.rotation.y=Math.PI/2;band.position.x=-p.length*.2+k*p.length*.13;band.scale.set(1,p.height/.72,p.depth/.48);bodyGroup.add(band)}
 return {root,tailPivot,bodyGroup,profile:p};
}
const glbLoader=new GLTFLoader();
const assetMap={'red drum':'red-drum','redfish':'red-drum','spotted seatrout':'spotted-seatrout','speckled trout':'spotted-seatrout','sheepshead':'sheepshead','southern flounder':'flounder','summer flounder':'flounder','flounder':'flounder','snook':'snook','common snook':'snook'};
let swimmers=[],generation=0;
function clearFish(){swimmers.forEach(o=>scene.remove(o.root));swimmers=[]}
window.renderFishTank3D=function(fish){
 ++generation;clearFish();
 fish.slice(0,5).forEach((s,i)=>{const o=makeFish(s);const key=assetMap[s.name.toLowerCase()];if(key){const current=generation;glbLoader.load('models/'+key+'.glb',gltf=>{if(current!==generation)return;const model=gltf.scene;model.rotation.y=0;o.bodyGroup.clear();o.bodyGroup.add(model);o.tailPivot=new THREE.Group();const tail=model.getObjectByName('tail');if(tail){const parent=tail.parent;const world=new THREE.Vector3();tail.getWorldPosition(world);parent.remove(tail);o.tailPivot.position.copy(world);tail.position.sub(world);o.tailPivot.add(tail);o.bodyGroup.add(o.tailPivot)}o.loadedGLB=true},()=>{},()=>{})} o.root.position.set(-4+i*2.2,1.65-(i%3)*1.15,-2+(i%3)*1.5);o.baseY=o.root.position.y;o.phase=i*1.8;o.speed=.012+i*.003;o.direction=i%2?1:-1;o.root.rotation.y=o.direction===1?0:Math.PI;scene.add(o.root);swimmers.push(o)});
};
let frame=0;
function animate(){
 requestAnimationFrame(animate);
 if(document.getElementById('tab-fishtank').hidden)return;
 frame++;
 swimmers.forEach(o=>{o.root.position.x+=o.speed*o.direction;if(o.root.position.x>5.6)o.direction=-1;if(o.root.position.x< -5.6)o.direction=1;
 const target=o.direction===1?0:Math.PI;let diff=((target-o.root.rotation.y+Math.PI*3)%(Math.PI*2))-Math.PI;o.root.rotation.y+=diff*.035;
 o.root.position.y=o.baseY+Math.sin(frame*.018+o.phase)*.25;
 o.root.position.z+=Math.sin(frame*.012+o.phase)*.006;
 o.tailPivot.rotation.y=Math.sin(frame*.22+o.phase)*.65;
 o.bodyGroup.rotation.y=Math.sin(frame*.22+o.phase)*.075;
 o.root.rotation.z=Math.sin(frame*.017+o.phase)*.035;
 });
 bubbles.forEach(b=>{b.mesh.position.y+=b.speed;if(b.mesh.position.y>3.4)b.mesh.position.y=-3.25});
 const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);const pr=renderer.getPixelRatio();if(renderer.domElement.width!==Math.round(w*pr)||renderer.domElement.height!==Math.round(h*pr)){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
 renderer.render(scene,camera);
}
window.resetFishTankView=()=>{camera.position.set(0,1,17);camera.lookAt(0,0,0);swimmers.forEach((o,i)=>o.root.position.x=-4+i*2.2)};
window.setFishTankOptions=({bubbles:showBubbles,plants:showPlants})=>{if(typeof showBubbles==='boolean')bubbles.forEach(b=>b.mesh.visible=showBubbles);if(typeof showPlants==='boolean')plants.visible=showPlants};
animate();if(window.pendingFishTank)window.renderFishTank3D(window.pendingFishTank);
