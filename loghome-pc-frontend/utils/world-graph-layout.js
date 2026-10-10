// Deterministic SVG layout; local-grid collision keeps each animation step bounded.
export function graphPositions(nodes) {
  return nodes.map((node,index)=>{const angle=index*2.399963229728653,radius=nodes.length<2?0:Math.min(285,70*Math.sqrt(index+1));return{id:node.id,x:500+Math.cos(angle)*radius,y:350+Math.sin(angle)*radius,vx:0,vy:0}})
}
export function graphStep(points, links, pinned, iteration = 0) {
  const byId=new Map(points.map(point=>[point.id,point])),cells=new Map(),forces=new Map(points.map(point=>[point.id,{x:(500-point.x)*.0008,y:(350-point.y)*.0008}]))
  for(const point of points){const key=`${Math.floor(point.x/100)}:${Math.floor(point.y/100)}`;if(!cells.has(key))cells.set(key,[]);cells.get(key).push(point)}
  for(const point of points){const cx=Math.floor(point.x/100),cy=Math.floor(point.y/100)
    for(let x=cx-1;x<=cx+1;x++)for(let y=cy-1;y<=cy+1;y++)for(const other of cells.get(`${x}:${y}`)||[]){if(point.id>=other.id)continue;let dx=point.x-other.x,dy=point.y-other.y;if(!dx&&!dy)dx=.5;const distance=Math.max(1,Math.hypot(dx,dy)),strength=Math.min(4,Math.max(0,170-distance)*.025);const a=forces.get(point.id),b=forces.get(other.id);a.x+=dx/distance*strength;a.y+=dy/distance*strength;b.x-=dx/distance*strength;b.y-=dy/distance*strength}}
  for(const link of links){const a=byId.get(link.source),b=byId.get(link.target);if(!a||!b||a===b)continue;const dx=b.x-a.x,dy=b.y-a.y,distance=Math.max(1,Math.hypot(dx,dy)),force=(distance-230)*.006;const fa=forces.get(a.id),fb=forces.get(b.id);fa.x+=dx/distance*force;fa.y+=dy/distance*force;fb.x-=dx/distance*force;fb.y-=dy/distance*force}
  const cooling=Math.max(.15,1-iteration/240)
  for(const point of points){if(point.id===pinned){point.vx=point.vy=0;continue}const force=forces.get(point.id);point.vx=(point.vx+force.x*cooling)*.8;point.vy=(point.vy+force.y*cooling)*.8;point.x=Math.max(45,Math.min(955,point.x+point.vx));point.y=Math.max(45,Math.min(655,point.y+point.vy))}
  return points
}
export function graphEdge(source,target) {
  if(!source||!target)return{path:'',x:0,y:0}
  if(source.id===target.id)return{path:`M ${source.x-12} ${source.y-20} C ${source.x-65} ${source.y-105}, ${source.x+65} ${source.y-105}, ${source.x+12} ${source.y-20}`,x:source.x,y:source.y-75}
  const dx=target.x-source.x,dy=target.y-source.y,d=Math.max(1,Math.hypot(dx,dy)),sx=source.x+dx/d*28,sy=source.y+dy/d*28,tx=target.x-dx/d*32,ty=target.y-dy/d*32,cx=(sx+tx)/2-dy*.14,cy=(sy+ty)/2+dx*.14
  return{path:`M ${sx} ${sy} Q ${cx} ${cy} ${tx} ${ty}`,x:(sx+2*cx+tx)/4,y:(sy+2*cy+ty)/4}
}
