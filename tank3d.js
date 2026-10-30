import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';
const host=document.getElementById('tank-canvas');
const scene=new THREE.Scene();scene.background=new THREE.Color(0x06394e);scene.fog=new THREE.FogExp2(0x06394e,.055);
const camera=new THREE.PerspectiveCamera(46,1,.1,100);camera.position.set(0,2.2,16);camera.lookAt(0,0,0);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;host.append(renderer.domElement);
scene.add(new THREE.HemisphereLight(0x98ecff,0x12353a,2.4));
const light=new THREE.DirectionalLight(0xc2faff,2.2);light.position.set(-3,8,6);scene.add(light);
const box=new THREE.Group();scene.add(box);
function wall(w,h,color,opacity){return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshPhongMaterial({color,transparent:true,opacity,side:THREE.DoubleSide,shininess:110,depthWrite:false}))}
const back=wall(13,7,0x08718c,.22);back.position.z=-3.6;box.add(back);
for(const x of [-6.5,6.5]){const side=wall(7,7,0x38c5e1,.13);side.rotation.y=Math.PI/2;side.position.set(x,0,0);box.add(side)}
const floor=new THREE.Mesh(new THREE.BoxGeometry(13,.22,7.4),new THREE.MeshStandardMaterial({color:0x9b9877,roughness:.92}));floor.position.y=-3.55;box.add(floor);
const gravel=new THREE.Group();box.add(gravel);
for(let i=0;i<150;i++){const stone=new THREE.Mesh(new THREE.IcosahedronGeometry(.055+Math.random()*.10,0),new THREE.MeshStandardMaterial({color:[0x8b9b92,0xc1a77b,0x576b65][i%3],roughness:1}));stone.position.set((Math.random()-.5)*12.5,-3.38,(Math.random()-.5)*7);gravel.add(stone)}
for(let i=0;i<23;i++){const plant=new THREE.Group();const x=(Math.random()-.5)*11.8,z=(Math.random()-.5)*5.9;
 for(let j=0;j<4;j++){const h=.8+Math.random()*1.5;const blade=new THREE.Mesh(new THREE.ConeGeometry(.09,h,5),new THREE.MeshStandardMaterial({color:[0x2e9878,0x37b58b,0x177e75][j%3],side:THREE.DoubleSide}));blade.position.set((j-1.5)*.13,-3.35+h/2,z);blade.rotation.z=(j-1.5)*.19;plant.add(blade)}
 plant.position.x=x;box.add(plant)}
const bubbles=[];
for(let i=0;i<38;i++){const mesh=new THREE.Mesh(new THREE.SphereGeometry(.035+Math.random()*.055,8,8),new THREE.MeshPhongMaterial({color:0xa3f2ff,transparent:true,opacity:.34}));mesh.position.set((Math.random()-.5)*12,-3.2+Math.random()*6.5,(Math.random()-.5)*6);scene.add(mesh);bubbles.push({mesh,speed:.006+Math.random()*.012})}
let swimmers=[],generation=0;
function clearFish(){swimmers.forEach(o=>{scene.remove(o.mesh);o.mesh.geometry.dispose();o.mesh.material.map?.dispose();o.mesh.material.dispose()});swimmers=[]}
window.renderFishTank3D=function(fish){
 const token=++generation;clearFish();
 fish.slice(0,5).forEach((s,i)=>{
  const img=new Image();img.crossOrigin='anonymous';FishDexArt.attach(s,img);
  img.onload=()=>{if(token!==generation)return;
   const tex=new THREE.Texture(img);tex.needsUpdate=true;tex.colorSpace=THREE.SRGBColorSpace;
   const ratio=Math.max(.8,Math.min(3.8,img.naturalWidth/img.naturalHeight));
   const width=Math.min(3.6,1.45*ratio),height=width/ratio;
   const mesh=new THREE.Mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({map:tex,transparent:true,side:THREE.DoubleSide,depthWrite:false,alphaTest:.08}));
   mesh.position.set(-5.7+i*.65,1.7-i*.8,-2+i*.8);
   mesh.userData={i,baseY:mesh.position.y,speed:.0045+i*.0013,direction:i%2?1:-1,phase:i*1.7};
   scene.add(mesh);swimmers.push({mesh,s});
  };
 });
};
let frame=0;
function animate(){
 requestAnimationFrame(animate);
 if(document.getElementById('tab-fishtank').hidden)return;
 frame++;
 swimmers.forEach(({mesh})=>{const d=mesh.userData;mesh.position.x+=d.speed*d.direction;
  if(mesh.position.x>6.2){d.direction=-1}else if(mesh.position.x< -6.2){d.direction=1}
  mesh.position.y=d.baseY+Math.sin(frame*.018+d.phase)*.23;
  mesh.rotation.y=(d.direction===1?0:Math.PI)+Math.sin(frame*.018+d.phase)*.11;
  mesh.rotation.z=Math.sin(frame*.022+d.phase)*.025;
 });
 bubbles.forEach(b=>{b.mesh.position.y+=b.speed;if(b.mesh.position.y>3.4)b.mesh.position.y=-3.35});
 const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);if(renderer.domElement.width!==Math.round(w*renderer.getPixelRatio())||renderer.domElement.height!==Math.round(h*renderer.getPixelRatio())){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
 renderer.render(scene,camera);
}
animate();
if(window.pendingFishTank)window.renderFishTank3D(window.pendingFishTank);
