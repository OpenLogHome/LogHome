import * as THREE from 'three'

const LOOP_SECONDS = 30
const DOWN = new THREE.Vector3(0, -1, 0)
const smooth = (start, end, value) => THREE.MathUtils.smoothstep(value, start, end)

// A continuous timeline, including the return to the first frame.
export function sampleHomeChoreography(time) {
  const phase = ((time % LOOP_SECONDS) + LOOP_SECONDS) % LOOP_SECONDS
  return {
    phase,
    conversation: smooth(18, 20.2, phase) * (1 - smooth(25.8, 28.5, phase)),
    writing: smooth(3.5, 5.5, phase) * (1 - smooth(16.5, 18.5, phase)),
    pageTurn: smooth(1.1, 2.7, phase % 6)
  }
}

// All models, textures and articulated props are generated locally.
export function createHomeVoxelScene(host, options = {}) {
  const scene = new THREE.Scene()
  const renderer = options.renderer || new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
  renderer.setClearColor(0x000000, 0)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.15
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.domElement.setAttribute('aria-hidden', 'true')
  host.appendChild(renderer.domElement)

  const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 60)
  const world = new THREE.Group()
  scene.add(world)
  const geometries = new Set()
  const materials = new Set()
  const textures = new Set()
  const unit = new THREE.BoxGeometry(1, 1, 1)
  geometries.add(unit)
  const jointGeometry = new THREE.SphereGeometry(1, 8, 6)
  geometries.add(jointGeometry)
  const palette = new Map()
  function material(color) {
    if (!palette.has(color)) {
      const mat = new THREE.MeshLambertMaterial({ color })
      materials.add(mat)
      palette.set(color, mat)
    }
    return palette.get(color)
  }
  function box(parent, size, position, color) {
    const mesh = new THREE.Mesh(unit, typeof color === 'string' ? material(color) : color)
    mesh.scale.set(...size)
    mesh.position.set(...position)
    mesh.castShadow = true
    mesh.receiveShadow = true
    parent.add(mesh)
    return mesh
  }
  function joint(parent, radius, position, color, name) {
    const mesh = new THREE.Mesh(jointGeometry, typeof color === 'string' ? material(color) : color)
    mesh.name = name
    mesh.scale.setScalar(radius)
    mesh.position.set(...position)
    mesh.castShadow = mesh.receiveShadow = true
    parent.add(mesh)
    return mesh
  }
  function pixelTexture(colors, seed, draw) {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 16
    const ctx = canvas.getContext('2d')
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        ctx.fillStyle = colors[(x * 13 + y * 7 + seed + (x * y) % 11) % colors.length]
        ctx.fillRect(x, y, 1, 1)
      }
    }
    if (draw) draw(ctx)
    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = texture.minFilter = THREE.NearestFilter
    texture.colorSpace = THREE.SRGBColorSpace
    textures.add(texture)
    const mat = new THREE.MeshLambertMaterial({ map: texture })
    materials.add(mat)
    return mat
  }
  const grass = pixelTexture(['#85a958', '#8cae60', '#93b568', '#80a253'], 3)
  const earth = pixelTexture(['#967451', '#9e7c57', '#aa8861', '#ad8e69'], 7, ctx => {
    ctx.fillStyle = '#85a958'
    ctx.fillRect(0, 0, 16, 3)
    for (let x = 0; x < 16; x += 3) ctx.fillRect(x, 3, 2, 2)
  })
  const soil = pixelTexture(['#897056', '#91765b', '#9d8061'], 5)
  const stone = pixelTexture(['#c7bea6', '#bfb69e', '#d0c6b0'], 4)
  const bark = pixelTexture(['#88603b', '#9d7446', '#ad824e'], 2, ctx => {
    ctx.fillStyle = '#795435'
    for (let x = 1; x < 16; x += 4) ctx.fillRect(x, 0, 1, 16)
  })
  const planks = pixelTexture(['#b78b58', '#bd925e', '#c49b69'], 6, ctx => {
    ctx.fillStyle = '#9b754a'
    for (let y = 3; y < 16; y += 4) ctx.fillRect(0, y, 16, 1)
  })
  const leaves = pixelTexture(['#628444', '#6f944e', '#7c9f59', '#779a53'], 9)
  for (let x = -3; x <= 3; x++) {
    for (let z = -2; z <= 2; z++) {
      if (Math.abs(x) === 3 && Math.abs(z) === 2) continue
      const top = z === 1 && x >= -1 ? stone : grass
      box(world, [1, 0.65, 1], [x, -0.325, z], [earth, earth, top, soil, earth, earth])
      if (Math.abs(x) < 3 && Math.abs(z) < 2) box(world, [1, 0.3, 1], [x, -0.8, z], soil)
    }
  }
  // Recessed stone and roots on the underside of the floating island.
  box(world, [2.5, 0.18, 2.1], [-0.3, -1.04, 0], '#92836b')
  box(world, [0.32, 0.28, 0.28], [-2.15, -0.78, 0.25], bark)

  const tree = new THREE.Group()
  tree.position.set(-2.25, 0, -1.35)
  world.add(tree)
  box(tree, [0.57, 2.75, 0.57], [0, 1.375, 0], bark)
  box(tree, [0.75, 0.13, 0.72], [0, 0.065, 0], bark)
  box(tree, [2.35, 1.12, 2.1], [0, 2.89, 0], leaves)
  box(tree, [1.95, 1.1, 1.85], [0.08, 3.56, -0.06], leaves)
  box(tree, [1.14, 0.85, 1.1], [-0.18, 4.1, -0.1], leaves)
  box(tree, [0.9, 0.96, 1.35], [-1.33, 2.95, 0.08], leaves)
  box(tree, [0.88, 1.02, 1.3], [1.31, 3.09, -0.05], leaves)
  box(tree, [1.2, 0.86, 0.78], [-0.16, 3.12, 0.99], leaves)

  // A hollow shelf: the spines sit in front of its thin back panel.
  const shelf = new THREE.Group()
  shelf.position.set(0.1, 0, -1.75)
  world.add(shelf)
  box(shelf, [2.05, 1.65, 0.08], [0, 0.825, -0.22], '#82603e')
  for (const side of [-1, 1]) box(shelf, [0.12, 1.7, 0.64], [side * 1.02, 0.85, 0.05], planks)
  for (let row = 0; row < 3; row++) {
    box(shelf, [2.12, 0.1, 0.66], [0, row * 0.52 + 0.07, 0.05], planks)
    for (let i = 0; i < 9; i++) {
      const height = 0.29 + (i % 3) * 0.05
      const color = ['#ba7051', '#d9b572', '#658b7b', '#6c8fa2', '#a37b8c'][i % 5]
      const baseY = row * 0.52 + 0.12
      box(shelf, [0.15, height, 0.43], [-0.82 + i * 0.205, baseY + height / 2, 0.055], color)
      for (const offset of [0.06, height - 0.06]) {
        box(shelf, [0.115, 0.018, 0.006], [-0.82 + i * 0.205, baseY + offset, 0.273], '#e6d6b7')
      }
    }
  }
  box(shelf, [2.18, 0.13, 0.7], [0, 1.67, 0.05], planks)
  box(shelf, [0.44, 0.09, 0.33], [-0.5, 1.78, 0.05], '#729082')
  box(shelf, [0.4, 0.06, 0.3], [-0.47, 1.855, 0.05], '#c59262')

  const desk = new THREE.Group()
  desk.name = 'writing-desk'
  desk.position.set(1.34, 0, 0.62)
  world.add(desk)
  const deskTop = 1.19
  box(desk, [1.85, 0.14, 0.95], [0, deskTop - 0.07, 0], planks).name = 'desk-surface'
  for (const x of [-0.77, 0.77]) for (const z of [-0.33, 0.33]) {
    box(desk, [0.13, 1.05, 0.13], [x, 0.525, z], '#926b44')
  }
  box(desk, [1.55, 0.12, 0.08], [0, 0.35, 0.33], '#a0794d')
  box(desk, [1.62, 0.2, 0.05], [0, 1, 0.42], '#ad8352')
  box(desk, [0.18, 0.05, 0.045], [0, 1, 0.46], '#d1aa6b')
  const paper = new THREE.Group()
  paper.name = 'writing-paper'
  paper.position.set(1.2, deskTop + 0.012, 0.43)
  world.add(paper)
  box(paper, [0.7, 0.018, 0.56], [0, 0, 0], '#f8eacc')
  const ink = []
  for (let i = 0; i < 4; i++) {
    const line = box(paper, [0.001, 0.003, 0.012], [0.22, 0.0105, 0.12 - i * 0.07], '#827157')
    line.name = `ink-line-${i}`
    ink.push(line)
  }
  box(desk, [0.18, 0.19, 0.18], [-0.67, deskTop + 0.095, 0.11], '#425e62')
  box(desk, [0.095, 0.025, 0.095], [-0.67, deskTop + 0.202, 0.11], '#2d4247')
  box(desk, [0.39, 0.065, 0.35], [0.57, deskTop + 0.033, 0.22], '#b97b50')
  box(desk, [0.34, 0.045, 0.32], [0.57, deskTop + 0.088, 0.22], '#e8d8b5')
  box(desk, [0.39, 0.025, 0.35], [0.57, deskTop + 0.123, 0.22], '#b97b50')

  function createBook(parent) {
    const group = new THREE.Group()
    group.name = 'held-book'
    parent.add(group)
    for (const side of [-1, 1]) {
      const half = new THREE.Group()
      half.rotation.z = side * 0.055
      group.add(half)
      box(half, [0.43, 0.035, 0.53], [side * 0.215, 0, 0], '#9c6247')
      box(half, [0.4, 0.052, 0.48], [side * 0.212, 0.0435, 0], '#f8e9c9')
      for (let i = 0; i < 5; i++) box(half, [0.28, 0.003, 0.012], [side * 0.21, 0.071, -0.16 + i * 0.067], '#b8a07a')
      // Fine page edges, with small depth offsets to avoid coplanar flicker.
      for (let i = 0; i < 2; i++) box(half, [0.003, 0.004, 0.46], [side * 0.414, 0.036 + i * 0.018, 0], '#d8c49f')
    }
    box(group, [0.055, 0.07, 0.53], [0, 0.018, 0], '#855139')
    const pageHinge = new THREE.Group()
    pageHinge.position.set(0, 0.096, 0)
    group.add(pageHinge)
    box(pageHinge, [0.39, 0.006, 0.47], [0.195, 0, 0], '#fff0d1')
    for (let i = 0; i < 5; i++) {
      for (const side of [-1, 1]) box(pageHinge, [0.27, 0.002, 0.012], [0.2, side * 0.0045, -0.16 + i * 0.067], '#b5a07c')
    }
    return { group, pageHinge }
  }

  // Two-segment arms solve toward explicit contact points instead of swinging through props.
  const armUpper = 0.39
  const armLower = 0.43
  const direction = new THREE.Vector3()
  const pole = new THREE.Vector3()
  const elbow = new THREE.Vector3()
  const segmentDirection = new THREE.Vector3()
  function poseArm(arm, target) {
    direction.copy(target).sub(arm.shoulder)
    const distance = THREE.MathUtils.clamp(direction.length(), 0.08, armUpper + armLower - 0.001)
    direction.normalize()
    const along = (armUpper * armUpper - armLower * armLower + distance * distance) / (2 * distance)
    const bend = Math.sqrt(Math.max(0, armUpper * armUpper - along * along))
    pole.set(arm.side * 1.1, arm.elbowLift, -0.12)
    pole.addScaledVector(direction, -pole.dot(direction)).normalize()
    elbow.copy(arm.shoulder).addScaledVector(direction, along).addScaledVector(pole, bend)
    segmentDirection.copy(elbow).sub(arm.shoulder).normalize()
    arm.upper.position.copy(arm.shoulder)
    arm.upper.quaternion.setFromUnitVectors(DOWN, segmentDirection)
    segmentDirection.copy(target).sub(elbow).normalize()
    arm.lower.position.copy(elbow)
    arm.lower.quaternion.setFromUnitVectors(DOWN, segmentDirection)
    arm.elbowJoint.position.copy(elbow)
    arm.hand.position.copy(target)
    arm.hand.quaternion.copy(arm.lower.quaternion)
    arm.wristJoint.position.copy(target)
  }
  function character(isAlex, x, z) {
    const root = new THREE.Group()
    root.name = isAlex ? 'Alex' : 'Steve'
    root.position.set(x, 0, z)
    world.add(root)
    const skin = isAlex ? '#e8bc96' : '#b88768'
    const hair = isAlex ? '#bc7736' : '#493126'
    const shirt = pixelTexture(isAlex ? ['#77954f', '#7c9b53', '#819e57'] : ['#289eab', '#30a6b2', '#35abb6'], isAlex ? 5 : 2)
    const pants = isAlex ? '#706044' : '#4c4c80'
    box(root, [0.63, 0.74, 0.34], [0, 1.09, 0], shirt).name = 'torso'
    box(root, [0.16, 0.13, 0.008], [0, 1.395, 0.175], skin)
    box(root, [0.16, 0.38, 0.008], [0.1, 0.99, 0.175], isAlex ? '#6e8b47' : '#2794a2')
    box(root, [0.63, 0.075, 0.35], [0, 0.7575, 0], isAlex ? '#574a36' : '#43466f')
    const head = new THREE.Group()
    head.name = 'head'
    // Neck pivot is at the base of the head, so nodding never separates it from the body.
    head.position.y = 1.5
    root.add(head)
    box(root, [0.23, 0.17, 0.24], [0, 1.48, 0], skin).name = 'neck-joint'
    box(head, [0.66, 0.66, 0.66], [0, 0.33, 0], skin)
    box(head, [0.68, 0.15, 0.68], [0, 0.6, 0], hair)
    box(head, [0.68, 0.52, 0.075], [0, 0.325, -0.3025], hair)
    box(head, [0.18, 0.14, 0.016], [-0.24, 0.49, 0.338], hair)
    let braid = null
    if (isAlex) {
      box(head, [0.37, 0.12, 0.017], [0.13, 0.51, 0.339], '#c88039')
      for (const side of [-1, 1]) box(head, [0.026, 0.5, 0.66], [side * 0.343, 0.32, 0], hair)
      box(head, [0.125, 0.23, 0.028], [0.277, 0.165, 0.342], hair)
      // The braid rests on the chest. Only its upper strand follows the head.
      box(root, [0.105, 0.3, 0.075], [0.23, 1.22, 0.23], hair).name = 'braid-tail'
      box(root, [0.11, 0.05, 0.08], [0.23, 1.09, 0.23], '#6c8949')
      braid = box(root, [0.095, 0.2, 0.095], [0.23, 1.44, 0.25], hair)
      braid.name = 'braid-strand'
    } else {
      for (const side of [-1, 1]) {
        box(head, [0.03, 0.28, 0.67], [side * 0.342, 0.47, 0], hair)
        box(head, [0.032, 0.19, 0.18], [side * 0.343, 0.285, 0.24], hair)
        box(head, [0.064, 0.145, 0.02], [side * 0.31, 0.315, 0.34], hair)
      }
      box(head, [0.34, 0.13, 0.015], [0, 0.13, 0.338], '#684231')
      box(head, [0.15, 0.065, 0.017], [0, 0.155, 0.35], skin)
    }
    const eyes = []
    for (const side of [-1, 1]) {
      box(head, [0.18, 0.08, 0.012], [side * 0.17, 0.34, 0.338], '#f9eee0')
      eyes.push(box(head, [0.071, 0.08, 0.009], [side * 0.14, 0.34, 0.349], isAlex ? '#4e7650' : '#55558b'))
      box(head, [0.19, 0.025, 0.012], [side * 0.17, 0.41, 0.338], isAlex ? '#a66a37' : '#6a4936')
    }
    box(head, [0.115, 0.085, 0.027], [0, 0.235, 0.342], isAlex ? '#d59870' : '#9e6e51')
    const arms = []
    for (const side of [-1, 1]) {
      const width = isAlex ? 0.22 : 0.26
      const upper = new THREE.Group()
      const lower = new THREE.Group()
      upper.name = `arm-upper-${side}`
      lower.name = `arm-lower-${side}`
      root.add(upper, lower)
      box(root, [0.2, 0.22, 0.24], [side * 0.375, 1.41, 0], shirt).name = `shoulder-bridge-${side}`
      joint(root, width * 0.48, [side * 0.455, 1.43, 0], shirt, `shoulder-joint-${side}`)
      box(upper, [width, 0.3, 0.28], [0, -0.115, 0], shirt)
      box(upper, [width, 0.12, 0.27], [0, -0.325, 0], skin)
      box(lower, [width - 0.012, armLower - 0.07, 0.23], [0, -(armLower - 0.07) / 2, 0], skin)
      box(lower, [0.125, 0.14, 0.125], [0, -0.36, 0], skin).name = `wrist-bridge-${side}`
      const elbowJoint = joint(root, width * 0.48, [0, 0, 0], skin, `elbow-joint-${side}`)
      const wristJoint = joint(root, 0.076, [0, 0, 0], skin, `wrist-joint-${side}`)
      const hand = box(root, [width + 0.015, isAlex ? 0.17 : 0.25, 0.275], [0, 0, 0], skin)
      hand.name = `hand-${side}`
      arms.push({ upper, lower, hand, elbowJoint, wristJoint, side, elbowLift: isAlex ? 0.72 : -1.3, shoulder: new THREE.Vector3(side * 0.455, 1.43, 0) })
      // Shoes sit exactly on y = 0; breathing moves the head, never the feet.
      box(root, [0.29, 0.59, 0.31], [side * 0.165, 0.425, 0], pants)
      box(root, [0.3, 0.13, 0.36], [side * 0.165, 0.065, 0.025], '#454c45')
      box(root, [0.3, 0.028, 0.36], [side * 0.165, 0.014, 0.025], '#353d37')
    }
    return { root, head, arms, eyes, braid }
  }
  const steve = character(false, -1.05, 0.88)
  const alex = character(true, 1.53, -0.18)
  const heldBook = createBook(steve.root)
  const quill = new THREE.Group()
  quill.name = 'writing-quill'
  world.add(quill)
  // The origin is the nib; both the wrist target and the ink use this same point.
  box(quill, [0.026, 0.44, 0.026], [0, 0.22, 0], '#6a5038')
  box(quill, [0.019, 0.04, 0.019], [0, 0.02, 0], '#343b38')
  const feather = new THREE.Group()
  feather.position.y = 0.43
  quill.add(feather)
  for (let i = 0; i < 4; i++) box(feather, [0.105 - i * 0.014, 0.063, 0.023], [0.025, i * 0.052, 0], i % 2 ? '#f0dfbd' : '#fff1d1')

  for (const [x, z, color] of [[-2.7, 1.3, '#dba46d'], [2.75, -1.15, '#cf8872'], [1.25, 2.25, '#ead990'], [-1.4, -2.05, '#d28d76']]) {
    box(world, [0.04, 0.27, 0.04], [x, 0.135, z], '#608247')
    box(world, [0.14, 0.045, 0.07], [x + 0.05, 0.13, z], '#73934e')
    box(world, [0.18, 0.09, 0.17], [x, 0.305, z], color)
    box(world, [0.095, 0.026, 0.09], [x, 0.363, z], '#f1d27f')
  }
  box(world, [0.55, 0.44, 0.55], [-2.48, 0.22, 0.65], bark)
  box(world, [0.32, 0.055, 0.32], [-2.48, 0.4675, 0.65], '#5b5341')
  const lanternMaterial = new THREE.MeshLambertMaterial({ color: '#ffe4a4', emissive: '#ffd17b', emissiveIntensity: 1.25, toneMapped: false })
  materials.add(lanternMaterial)
  box(world, [0.23, 0.27, 0.23], [-2.48, 0.63, 0.65], lanternMaterial)
  for (const x of [-0.13, 0.13]) for (const z of [-0.13, 0.13]) box(world, [0.026, 0.29, 0.026], [-2.48 + x, 0.63, 0.65 + z], '#66563e')
  box(world, [0.34, 0.055, 0.34], [-2.48, 0.8025, 0.65], '#68583f')
  box(world, [0.055, 0.12, 0.055], [-2.48, 0.89, 0.65], '#68583f')
  const lanternLight = new THREE.PointLight('#ffc16a', 1.8, 2.6, 2)
  lanternLight.position.set(-2.48, 0.68, 0.65)
  world.add(lanternLight)
  const glowCanvas = document.createElement('canvas')
  glowCanvas.width = glowCanvas.height = 128
  const glowContext = glowCanvas.getContext('2d')
  const glowGradient = glowContext.createRadialGradient(64, 64, 2, 64, 64, 64)
  glowGradient.addColorStop(0, 'rgba(255, 215, 128, 0.7)')
  glowGradient.addColorStop(0.23, 'rgba(255, 196, 85, 0.32)')
  glowGradient.addColorStop(0.6, 'rgba(249, 183, 64, 0.08)')
  glowGradient.addColorStop(1, 'rgba(249, 183, 64, 0)')
  glowContext.fillStyle = glowGradient
  glowContext.fillRect(0, 0, 128, 128)
  const glowTexture = new THREE.CanvasTexture(glowCanvas)
  textures.add(glowTexture)
  const glowMaterial = new THREE.SpriteMaterial({ map: glowTexture, transparent: true, depthWrite: false, toneMapped: false, opacity: 0.55 })
  materials.add(glowMaterial)
  const glow = new THREE.Sprite(glowMaterial)
  glow.position.copy(lanternLight.position)
  glow.scale.set(1.12, 1.12, 1)
  world.add(glow)

  const particles = []
  for (let i = 0; i < 9; i++) {
    const angle = i / 9 * Math.PI * 2
    const cube = box(world, [0.035, 0.035, 0.035], [Math.sin(angle) * 3.15, 1.6 + (i % 3) * 0.62, Math.cos(angle) * 2.25], '#d9b866')
    cube.castShadow = false
    particles.push(cube)
  }
  const clouds = []
  for (const [x, y, z] of [[-3.6, 4.62, 0.1], [2.7, 4.05, -2.4]]) {
    const cloud = new THREE.Group()
    cloud.name = 'cloud'
    cloud.position.set(x, y, z)
    world.add(cloud)
    const base = box(cloud, [1.02, 0.19, 0.42], [0, 0, 0], '#fff8e9')
    const top = box(cloud, [0.5, 0.22, 0.42], [-0.12, 0.205, 0], '#fff8e9')
    base.castShadow = top.castShadow = false
    clouds.push(cloud)
  }
  function bubble(color, x, z) {
    const group = new THREE.Group()
    group.position.set(x, 2.75, z)
    world.add(group)
    box(group, [0.64, 0.37, 0.09], [0, 0, 0], color)
    box(group, [0.1, 0.1, 0.09], [-0.15, -0.235, 0], color)
    const dots = []
    for (let i = 0; i < 3; i++) dots.push(box(group, [0.055, 0.055, 0.014], [-0.145 + i * 0.145, 0, 0.054], '#f8edce'))
    return { group, dots }
  }
  const bubbles = [bubble('#6d9181', -0.95, 1.2), bubble('#b88556', 1.65, 0.48)]

  scene.add(new THREE.HemisphereLight('#fff7e7', '#b1b49c', 2))
  const sunlight = new THREE.DirectionalLight('#fff0d7', 2.65)
  sunlight.position.set(-3, 8, 5)
  sunlight.castShadow = true
  sunlight.shadow.mapSize.set(1024, 1024)
  Object.assign(sunlight.shadow.camera, { left: -6, right: 6, top: 7, bottom: -5, near: 0.5, far: 25 })
  sunlight.shadow.normalBias = 0.025
  scene.add(sunlight)
  const fill = new THREE.DirectionalLight('#deebed', 0.65)
  fill.position.set(5, 3, -3)
  scene.add(fill)

  const shadowCanvas = document.createElement('canvas')
  shadowCanvas.width = shadowCanvas.height = 128
  const shadowContext = shadowCanvas.getContext('2d')
  const shadowGradient = shadowContext.createRadialGradient(64, 64, 4, 64, 64, 64)
  shadowGradient.addColorStop(0, 'rgba(87, 83, 59, 0.2)')
  shadowGradient.addColorStop(0.55, 'rgba(87, 83, 59, 0.09)')
  shadowGradient.addColorStop(1, 'rgba(87, 83, 59, 0)')
  shadowContext.fillStyle = shadowGradient
  shadowContext.fillRect(0, 0, 128, 128)
  const shadowTexture = new THREE.CanvasTexture(shadowCanvas)
  textures.add(shadowTexture)
  const shadowMaterial = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, toneMapped: false })
  materials.add(shadowMaterial)
  const shadowGeometry = new THREE.PlaneGeometry(8.8, 6.4)
  geometries.add(shadowGeometry)
  const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial)
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = -1.55
  scene.add(shadow)

  let pointerX = 0
  let pointerY = 0
  const handTarget = new THREE.Vector3()
  const bookContact = new THREE.Vector3()
  const penGrip = new THREE.Vector3()
  const restHand = new THREE.Vector3()
  const braidStart = new THREE.Vector3()
  const braidEnd = new THREE.Vector3(0.23, 1.385, 0.24)
  function resize() {
    const width = host.clientWidth || 600
    const height = host.clientHeight || 550
    renderer.setSize(width, height)
    const aspect = width / height
    const halfHeight = Math.max(3.62, 4.62 / aspect)
    camera.left = -halfHeight * aspect
    camera.right = halfHeight * aspect
    camera.top = halfHeight
    camera.bottom = -halfHeight
    camera.updateProjectionMatrix()
  }
  function tick(delta, time, pointer = { x: 0, y: 0 }) {
    const { phase, conversation, writing, pageTurn } = sampleHomeChoreography(time)
    const cycle = phase / LOOP_SECONDS * Math.PI * 2
    pointerX = THREE.MathUtils.damp(pointerX, pointer.x * 0.08, 3.5, delta)
    pointerY = THREE.MathUtils.damp(pointerY, pointer.y * 0.2, 3.5, delta)
    const cameraAngle = 0.49 + pointerX + Math.sin(cycle) * 0.015
    camera.position.set(Math.sin(cameraAngle) * 12, 7.3 + pointerY, Math.cos(cameraAngle) * 12)
    camera.lookAt(-0.05, 1.65, 0)
    world.position.y = Math.sin(cycle) * 0.026

    steve.root.rotation.y = 0.12 + conversation * 0.48
    steve.head.rotation.set(0.18 * (1 - conversation) + Math.sin(cycle * 5) * 0.015, conversation * 0.52, 0)
    alex.root.rotation.y = -0.04 - conversation * 0.13
    alex.head.rotation.set(0.22 * writing + 0.06 * (1 - writing) - conversation * 0.1, -0.08 - conversation * 0.4, Math.sin(cycle * 4) * 0.008)
    alex.head.updateMatrix()
    braidStart.set(0.27, 0.08, 0.345).applyMatrix4(alex.head.matrix)
    alex.braid.position.copy(braidStart).add(braidEnd).multiplyScalar(0.5)
    alex.braid.scale.y = braidStart.distanceTo(braidEnd) + 0.045
    segmentDirection.copy(braidEnd).sub(braidStart).normalize()
    alex.braid.quaternion.setFromUnitVectors(DOWN, segmentDirection)
    for (const [person, side] of [[steve, 1], [alex, -1]]) {
      person.eyes.forEach((eye, i) => { eye.position.x = (i === 0 ? -0.14 : 0.14) + side * conversation * 0.025 })
    }
    heldBook.group.position.set(0, 1.105 - conversation * 0.09, 0.53 - conversation * 0.035)
    heldBook.group.rotation.x = 0.08 + conversation * 0.09
    heldBook.pageHinge.rotation.z = pageTurn * Math.PI
    heldBook.pageHinge.visible = pageTurn > 0 && pageTurn < 1 && conversation < 0.15
    heldBook.group.updateMatrix()
    for (const arm of steve.arms) {
      // Palms support the underside, outside the printed pages.
      bookContact.set(arm.side * 0.49, -0.135, -0.24).applyMatrix4(heldBook.group.matrix)
      handTarget.copy(bookContact)
      let gesture = 0
      if (arm.side === 1) {
        // Release the outer edge first, then raise the hand above the book.
        gesture = smooth(0.35, 1, conversation)
        handTarget.x = THREE.MathUtils.lerp(bookContact.x, 0.74, smooth(0, 0.4, conversation))
        handTarget.y = THREE.MathUtils.lerp(bookContact.y, 1.31 + Math.sin(cycle * 9) * 0.055, gesture)
        handTarget.z = THREE.MathUtils.lerp(bookContact.z, 0.38, gesture)
      }
      poseArm(arm, handTarget)
      arm.hand.quaternion.copy(heldBook.group.quaternion).slerp(arm.lower.quaternion, gesture)
    }

    // Finish a line, lift the nib, then return through the air to the next line.
    const strokeTime = THREE.MathUtils.clamp(phase - 5.5, 0, 9.95)
    const stroke = (strokeTime % 2.6) / 2.6
    const lineIndex = Math.min(3, Math.floor(strokeTime / 2.6))
    const drawing = smooth(0.08, 0.79, stroke)
    const returning = smooth(0.84, 1, stroke)
    const lineLength = 0.43 - lineIndex * 0.035
    // Alex faces +Z: her left is +X, and the top of her page is farther along +Z.
    const nibX = 1.42 - lineLength * drawing * (1 - returning)
    const nibZ = 0.55 - lineIndex * 0.07 - returning * (lineIndex < 3 ? 0.07 : 0)
    const nibLift = Math.sin(returning * Math.PI) * 0.075 + (1 - writing) * 0.14 + conversation * 0.28
    quill.position.set(
      THREE.MathUtils.lerp(1.1, nibX, writing) + conversation * 0.09,
      deskTop + 0.024 + nibLift,
      THREE.MathUtils.lerp(0.27, nibZ, writing) - conversation * 0.1
    )
    quill.rotation.set(-0.3 + conversation * 0.2, -0.15, -0.25 + conversation * 0.16)
    world.updateMatrixWorld(true)
    penGrip.set(0, 0.22, 0).applyMatrix4(quill.matrixWorld)
    alex.root.worldToLocal(penGrip)
    poseArm(alex.arms[0], penGrip)
    restHand.set(2.03, deskTop + 0.092 + conversation * 0.2, 0.32 - conversation * 0.05)
    world.localToWorld(restHand)
    alex.root.worldToLocal(restHand)
    poseArm(alex.arms[1], restHand)
    alex.arms[1].hand.quaternion.identity()
    ink.forEach((line, index) => {
      const length = 0.43 - index * 0.035
      const amount = phase < 5.5 ? 0 : index < lineIndex ? 1 : index === lineIndex ? drawing : 0
      // Keep the completed words on the paper throughout the conversation.
      const visibleLength = length * (phase >= 15.9 && phase < 28 ? 1 : amount) * (1 - smooth(28, 30, phase))
      line.visible = visibleLength > 0.002
      line.scale.x = Math.max(0.001, visibleLength)
      line.position.x = 0.22 - visibleLength / 2
    })
    bubbles.forEach(({ group, dots }, index) => {
      const reveal = smooth(0.1 + index * 0.17, 0.62 + index * 0.17, conversation)
      group.visible = reveal > 0.001
      group.scale.setScalar(Math.max(0.001, reveal))
      group.rotation.y = cameraAngle
      group.position.y = 2.74 + Math.sin(cycle * 7 + index) * 0.035
      dots.forEach((dot, i) => { dot.position.y = Math.max(0, Math.sin(cycle * 15 - i * 0.8 + index)) * 0.032 })
    })
    particles.forEach((cube, i) => {
      cube.position.y = 1.6 + (i % 3) * 0.62 + Math.sin(cycle * 2 + i) * 0.16
      cube.rotation.set(cycle + i, cycle * 2 + i, 0)
    })
    clouds.forEach((cloud, i) => { cloud.position.x = (i === 0 ? -3.6 : 2.7) + Math.sin(cycle + i) * 0.12 })
    lanternLight.intensity = 1.8 + Math.sin(cycle * 7) * 0.12
    glowMaterial.opacity = 0.55 + Math.sin(cycle * 7) * 0.025
    renderer.render(scene, camera)
  }
  resize()
  return {
    resize,
    tick,
    canvas: renderer.domElement,
    dispose() {
      geometries.forEach(geometry => geometry.dispose())
      materials.forEach(mat => mat.dispose())
      textures.forEach(texture => texture.dispose())
      sunlight.shadow.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    }
  }
}
