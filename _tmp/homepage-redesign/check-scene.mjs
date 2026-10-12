import assert from 'node:assert/strict'
import * as THREE from '../../loghome-pc-frontend/node_modules/three/build/three.module.js'
import { OBB } from '../../loghome-pc-frontend/node_modules/three/examples/jsm/math/OBB.js'
import { createHomeVoxelScene } from '../../loghome-pc-frontend/utils/homeVoxelScene.js'

globalThis.window = { devicePixelRatio: 1 }
globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => ({ fillRect() {}, createRadialGradient() { return { addColorStop() {} } } }) }) }
let scene
let camera
const renderer = {
  domElement: { setAttribute() {}, remove() {} }, shadowMap: {},
  setClearColor() {}, setPixelRatio() {}, setSize() {}, dispose() {}, forceContextLoss() {},
  render(value, view) { scene = value; camera = view; scene.updateMatrixWorld(true); camera.updateMatrixWorld(true) }
}
const world = createHomeVoxelScene({ clientWidth: 650, clientHeight: 590, appendChild() {} }, { renderer })
function bounds(mesh) {
  mesh.geometry.computeBoundingBox()
  return new OBB().fromBox3(mesh.geometry.boundingBox).applyMatrix4(mesh.matrixWorld)
}
let maxWristGap = 0
const collisions = []
const bookCollisions = []
const jointGaps = []
const hairCollisions = []
const clippedClouds = []
for (let frame = 0; frame <= 600; frame++) {
  const time = frame / 20
  world.tick(1 / 20, time)
  const table = scene.getObjectByName('desk-surface')
  const alex = scene.getObjectByName('Alex')
  for (const name of ['braid-tail', 'braid-strand']) {
    const hair = alex.getObjectByName(name)
    if (bounds(hair).intersectsOBB(bounds(alex.getObjectByName('torso')))) hairCollisions.push({time, name})
    for (const side of [-1, 1]) {
      for (const part of [`hand-${side}`, `elbow-joint-${side}`, `wrist-joint-${side}`]) {
        if (bounds(hair).intersectsOBB(bounds(alex.getObjectByName(part)))) hairCollisions.push({time, name, part})
      }
    }
  }
  scene.traverse(object => {
    if (object.name !== 'cloud') return
    object.traverse(mesh => {
      if (!mesh.isMesh) return
      for (const x of [-0.5, 0.5]) for (const y of [-0.5, 0.5]) for (const z of [-0.5, 0.5]) {
        const ndc = new THREE.Vector3(x,y,z).applyMatrix4(mesh.matrixWorld).project(camera)
        if (Math.abs(ndc.x) > 1 || Math.abs(ndc.y) > 1) clippedClouds.push(time)
      }
    })
  })
  for (const name of ['Steve', 'Alex']) {
    const person = scene.getObjectByName(name)
    if (bounds(person.getObjectByName('torso')).intersectsOBB(bounds(table))) collisions.push({time,name,part:'torso'})
    for (const side of [-1, 1]) {
      const forearm = person.getObjectByName(`arm-lower-${side}`)
      const hand = person.getObjectByName(`hand-${side}`)
      const upper = person.getObjectByName(`arm-upper-${side}`)
      const shoulder = person.getObjectByName(`shoulder-joint-${side}`)
      const bridge = person.getObjectByName(`shoulder-bridge-${side}`)
      const elbow = person.getObjectByName(`elbow-joint-${side}`)
      const wrist = person.getObjectByName(`wrist-joint-${side}`)
      const wristBridge = person.getObjectByName(`wrist-bridge-${side}`)
      const connections = [[person.getObjectByName('torso'),bridge], [bridge,shoulder], [shoulder,upper.children[0]], [upper.children[1],elbow], [elbow,forearm.children[0]], [forearm.children[0],wristBridge], [wristBridge,wrist], [wrist,hand]]
      connections.forEach(([a,b],index) => { if (!bounds(a).intersectsOBB(bounds(b))) jointGaps.push({time,name,side,index}) })
      for (const extra of [shoulder, elbow, wrist, wristBridge]) {
        if (bounds(extra).intersectsOBB(bounds(table))) collisions.push({time,name,part:extra.name})
        if (name === 'Steve') person.getObjectByName('held-book').traverseVisible(mesh => {
          if (mesh.isMesh && bounds(extra).intersectsOBB(bounds(mesh))) bookCollisions.push({time,side,part:extra.name})
        })
      }
      const end = forearm.localToWorld(new THREE.Vector3(0, -0.43, 0))
      const handPosition = hand.getWorldPosition(new THREE.Vector3())
      maxWristGap = Math.max(maxWristGap, end.distanceTo(handPosition))
      if (name === 'Steve') {
        person.getObjectByName('held-book').traverseVisible(mesh => {
          if (mesh.isMesh && (bounds(hand).intersectsOBB(bounds(mesh)) || bounds(forearm.children[0]).intersectsOBB(bounds(mesh)))) bookCollisions.push({ time, side, bookSize:mesh.scale.toArray(), hand:bounds(hand).intersectsOBB(bounds(mesh)), forearm:bounds(forearm.children[0]).intersectsOBB(bounds(mesh)) })
        })
      }
      if (bounds(hand).intersectsOBB(bounds(table))) collisions.push({time,name,part:`hand-${side}`})
      if (bounds(forearm.children[0]).intersectsOBB(bounds(table))) collisions.push({time,name,part:`forearm-${side}`})
    }
  }
}
function visibleMatrices() {
  const result = []
  scene.traverseVisible(object => { if (object.isMesh) result.push([...object.matrixWorld.elements]) })
  return result
}
world.tick(0, 0)
const first = visibleMatrices()
world.tick(0, 30)
const last = visibleMatrices()
assert.deepEqual(first, last, 'The visible scene must join seamlessly at the loop boundary')
console.log(JSON.stringify({framesChecked:601, maxWristGap, tableCollisions:collisions.slice(0,20), collisionCount:collisions.length, loopBoundary:'passed', bookCollisionCount:bookCollisions.length, firstBookCollisions:bookCollisions.slice(0,4), jointGaps:jointGaps.slice(0,4), jointGapCount:jointGaps.length, hairCollisions:hairCollisions.slice(0,4), hairCollisionCount:hairCollisions.length, clippedCloudCount:clippedClouds.length}, null, 2))
assert.ok(maxWristGap < 0.001, 'Hands must remain attached to forearms')
assert.equal(collisions.length, 0, 'Characters must not penetrate the table')
assert.equal(jointGaps.length, 0, 'Joint meshes must stay physically connected')
assert.equal(hairCollisions.length, 0, 'The braid must clear the torso and hands')
assert.equal(clippedClouds.length, 0, 'Clouds must remain inside the camera frame')
world.tick(0, 6)
const penStart = scene.getObjectByName('writing-quill').position.clone()
world.tick(0, 7.3)
const penEnd = scene.getObjectByName('writing-quill').position.clone()
world.tick(0, 8.6)
const nextLine = scene.getObjectByName('writing-quill').position.clone()
assert.ok(penEnd.x < penStart.x, 'Writing must advance toward Alex’s right (-X)')
assert.ok(nextLine.z < penStart.z, 'Next line must move toward Alex (-Z)')
console.log('Alex writing direction: passed')
assert.equal(bookCollisions.length, 0, 'Hands and forearms must not penetrate the book')
world.dispose()
