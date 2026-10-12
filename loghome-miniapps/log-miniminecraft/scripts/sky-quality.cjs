// Sample clouds in continuous 3D direction space, with no longitude wrap or poles.
const cloudShader=`
  float logSkyHash(vec3 p) { return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
  float logSkyNoise(vec3 p) {
    vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(mix(logSkyHash(i),logSkyHash(i+vec3(1,0,0)),f.x),
                   mix(logSkyHash(i+vec3(0,1,0)),logSkyHash(i+vec3(1,1,0)),f.x),f.y),
               mix(mix(logSkyHash(i+vec3(0,0,1)),logSkyHash(i+vec3(1,0,1)),f.x),
                   mix(logSkyHash(i+vec3(0,1,1)),logSkyHash(i+vec3(1,1,1)),f.x),f.y),f.z);
  }
  float clouds(vec3 direction,float time,float speed,float density) {
    vec3 p=direction*4.0+vec3(time*speed*.015,0.0,time*speed*.0045);
    float value=0.0,amplitude=.5;
    for(int i=0;i<4;i++){value+=amplitude*logSkyNoise(p);p=p*2.0+vec3(17.0,31.0,11.0);amplitude*=.5;}
    return smoothstep(1.0-density*1.2,1.0-density*.3,value)*smoothstep(-.1,.18,direction.y);
  }
  `;
function patchSkyQuality(source){
  const start=source.indexOf('skyboxVertexShader=`'),end=source.indexOf('class DayNightCycle',start);
  if(start<0||end<0)throw Error('Sky shader boundary changed');
  let sky=source.slice(start,end);
  function replace(a,b){if(sky.split(a).length!==2)throw Error('Sky patch boundary changed: '+a.slice(0,60));sky=sky.replace(a,b)}
  // Local sphere position gives the same direction in main and reflection cameras,
  // independent of player/world translation. Do not normalize world coordinates.
  replace('vWorldPosition = worldPosition.xyz;', 'vWorldPosition = position;');
  const a=sky.indexOf('  float clouds(vec2 uv,'),b=sky.indexOf('  // 极光效果',a);
  if(a<0||b<0)throw Error('Cloud function boundary changed');
  sky=sky.slice(0,a)+cloudShader+sky.slice(b);
  const c=sky.indexOf('      float theta = atan(rayDir.z, rayDir.x);'),d=sky.indexOf('      // 云朵颜色',c);
  if(c<0||d<0)throw Error('Cloud projection boundary changed');
  sky=sky.slice(0,c)+'      float cloudValue = clouds(rayDir, uTime, uCloudSpeed, uCloudDensity);\n\n'+sky.slice(d);
  replace('uniform float uCloudDensity;', 'uniform float uCloudDensity;\n  uniform float logAdvancedSky;');
  replace('float cloudValue = clouds(rayDir, uTime, uCloudSpeed, uCloudDensity);', 'float cloudValue = clouds(rayDir, uTime, uCloudSpeed, logAdvancedSky>.5?uCloudDensity*.86:uCloudDensity);');
  replace('skyColor = mix(skyColor, cloudColor, cloudBlend);', `if(logAdvancedSky>.5){
        float sunward=clouds(normalize(rayDir+normalize(uSunPosition)*.08),uTime,uCloudSpeed,uCloudDensity*.86);
        float edgeLight=clamp((cloudValue-sunward)*3.0,-.25,.35);
        cloudColor=mix(vec3(.48,.57,.72),vec3(1.,.94,.83),clamp(.6+edgeLight,0.,1.));
        cloudBlend=clamp(cloudValue*1.5,0.,.9)*min(uSunIntensity,1.);
      }
      skyColor = mix(skyColor, cloudColor, cloudBlend);`);
  replace('gl_FragColor = vec4(skyColor, 1.0);','gl_FragColor = vec4(skyColor, 1.0);\n    #include <tonemapping_fragment>\n    #include <colorspace_fragment>');
  return source.slice(0,start)+sky+source.slice(end);
}
module.exports={patchSkyQuality};
