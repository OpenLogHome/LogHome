const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const babel = require('@babel/core');
const compiler = require('vue-template-compiler');
const THREE = require('three');
const root = path.resolve(__dirname, '..');
const cache = new Map();
const document = { createElement: () => ({ getContext: () => ({ fillRect() {}, save() {}, restore() {} }) }) };
function load(file) {
  if (cache.has(file)) return cache.get(file);
  let source = fs.readFileSync(path.join(root, file), 'utf8');
  if (file.endsWith('.vue')) {
    source = compiler.parseComponent(source).script.content;
    source += '\nexport { createRuntime, createMaterialLibrary, createGeometryLibrary, buildTerrain, buildStageForStatus };';
  }
  const exports = {};
  vm.runInNewContext(babel.transformSync(source, { configFile: false, babelrc: false,
    plugins: [require('@babel/plugin-transform-modules-commonjs')] }).code,
  { exports, document, console, require(spec) {
    if (spec === 'three') return THREE;
    let next = spec.startsWith('~/') ? spec.slice(2) : path.posix.join(path.posix.dirname(file), spec);
    if (!path.extname(next)) next += '.js';
    return load(next);
  } }, { filename: file });
  cache.set(file, exports);
  return exports;
}
const themes = load('components/social/tree/sceneThemes.js');
const scene = load('components/social/tree/TreeScene.vue');
const corners = box => [box.min.x, box.max.x].flatMap(x =>
  [box.min.y, box.max.y].flatMap(y => [box.min.z, box.max.z].map(z => new THREE.Vector3(x, y, z))));
let frames = 0, previousClipping = 0;
for (const key of Object.keys(themes.SCENE_THEMES)) {
  for (const night of [false, true]) {
    const runtime = scene.createRuntime();
    runtime.world = new THREE.Group();
    runtime.themeKey = key;
    runtime.isNight = night;
    runtime.themeDefinition = themes.getSceneThemeDefinition(key, night);
    runtime.materials = scene.createMaterialLibrary(runtime.resources, runtime.themeDefinition);
    runtime.geometries = scene.createGeometryLibrary(runtime.resources);
    scene.buildTerrain(runtime);
    for (const status of ['未种植', '种植', '开花', '结果', '收获']) {
      const stage = scene.buildStageForStatus(runtime, status);
      runtime.world.add(stage.root);
      const bounds = [runtime.terrain, stage.root].map(object => new THREE.Box3().setFromObject(object));
      const points = bounds.flatMap(corners);
      for (const aspect of [0.55, 0.8, 1, 1.65, 2.4]) {
        const preferred = themes.getCameraFraming(aspect, key, night);
        const framing = themes.fitSceneCamera(preferred, aspect, bounds);
        const camera = new THREE.PerspectiveCamera(framing.fov, aspect, .1, Math.max(60, framing.radius + 30));
        const target = new THREE.Vector3(0, framing.targetY, 0);
        for (const phi of [0.82, 0.93, 1.02, 1.13, 1.24]) {
          camera.position.setFromSpherical(new THREE.Spherical(framing.radius, phi, 0)).add(target);
          camera.lookAt(target); camera.updateMatrixWorld();
          for (let theta = 0; theta < Math.PI * 2; theta += Math.PI / 8) {
            for (const point of points) {
              const projected = point.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), theta).project(camera);
              assert.ok(Math.abs(projected.x) < .92 && Math.abs(projected.y) < .92 && projected.z < 1,
                `${key}/${status}/${night}/${aspect}: clipped scene ${projected.toArray()}`);
            }
          }
        }
        camera.position.setFromSpherical(new THREE.Spherical(preferred.radius, preferred.phi, 0))
          .add(new THREE.Vector3(0, preferred.targetY, 0));
        camera.lookAt(new THREE.Vector3(0, preferred.targetY, 0));camera.updateMatrixWorld();
        if (points.some(point => Math.abs(point.clone().project(camera).y) > 1)) previousClipping++;
        frames++;
      }
      runtime.world.remove(stage.root);
    }
    for (const resource of [...runtime.resources.textures, ...runtime.resources.materials, ...runtime.resources.geometries]) resource.dispose();
  }
}
assert.ok(previousClipping > 0, 'Regression fixture must reproduce the original clipping');
const initial = themes.getCameraFraming(1);
assert.equal(themes.fitSceneCamera(initial, 1, []), initial);
const centered = themes.fitSceneCamera(initial, 1, [{ min: { x: -2, y: -2, z: -2 }, max: { x: 2, y: 2, z: 2 } }]);
assert.equal(centered.targetY, 0);
console.log(`PASS ${frames} scene frames: six themes, day/night, five stages, five aspect ratios and full drag rotation; reproduced ${previousClipping} previously clipped frames`);
