<template>
  <view
    class="oak-tree-3d"
    :class="{ 'is-night': nightMode }"
    :style="sceneThemeStyle"
  >
    <view class="scene-backdrop">
      <view class="sun-halo"></view>
      <view class="pixel-stars" v-if="nightMode">
        <view
          v-for="(star, index) in nightStars"
          :key="'night-star-' + index"
          class="pixel-star"
          :class="'star-size-' + star.size"
          :style="{ left: star.x + '%', top: star.y + '%', opacity: star.opacity }"
        ></view>
      </view>
      <view class="mist mist-a"></view>
      <view class="mist mist-b"></view>
    </view>

    <view ref="sceneHost" class="scene-host"></view>

    <view class="gesture-hint" v-if="!hasInteracted">
      <text>拖动旋转树场</text>
    </view>

    <view class="scene-error" v-if="initFailed">
      <text>当前环境无法启用高质量 3D 树场，已切回经典模式。</text>
    </view>
  </view>
</template>

<script>
import * as THREE from "three";
import { DEFAULT_TREE_PLANT_SCENE_THEME } from "../../../lib/treeSceneSettings";
import {
  getCameraFraming,
  getSceneThemeDefinition,
  getSceneThemeStyle,
} from "./sceneThemes";

const PATH_CELLS = new Set([
  "0:4",
  "0:3",
  "0:2",
  "0:1",
  "-1:4",
  "1:4",
  "-1:3",
  "1:3",
]);
const SWAMP_WATER_CELLS = new Set([
  "-4:-1",
  "-3:-2",
  "-3:-1",
  "-3:0",
  "3:-2",
  "3:-1",
  "4:-1",
]);
const NIGHT_STAR_POSITIONS = [
  { x: 7, y: 12, size: 1, opacity: 0.72 },
  { x: 16, y: 24, size: 2, opacity: 0.9 },
  { x: 24, y: 8, size: 1, opacity: 0.82 },
  { x: 34, y: 19, size: 1, opacity: 0.68 },
  { x: 43, y: 7, size: 2, opacity: 0.94 },
  { x: 54, y: 27, size: 1, opacity: 0.76 },
  { x: 63, y: 13, size: 1, opacity: 0.86 },
  { x: 72, y: 31, size: 2, opacity: 0.72 },
  { x: 83, y: 18, size: 1, opacity: 0.92 },
  { x: 92, y: 8, size: 1, opacity: 0.7 },
  { x: 12, y: 39, size: 1, opacity: 0.64 },
  { x: 88, y: 42, size: 2, opacity: 0.74 },
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function lerp(from, to, alpha) {
  return from + (to - from) * alpha;
}

function createCanvasTexture(resources, painter) {
  const canvas = document.createElement("canvas");
  const size = 32;
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  painter(ctx, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestMipmapNearestFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;

  resources.textures.push(texture);
  return texture;
}

function createPixelTexture(resources, fileName, painter) {
  return createCanvasTexture(resources, painter);
}

function cutPixelHoles(ctx, cells, cellSize = 4) {
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  cells.forEach(([x, y]) => {
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  });
  ctx.restore();
}

function fillGrid(ctx, size, palette, cellSize = 4) {
  for (let y = 0; y < size; y += cellSize) {
    for (let x = 0; x < size; x += cellSize) {
      const paletteIndex = Math.abs((x * 13 + y * 7 + x * y) % palette.length);
      ctx.fillStyle = palette[paletteIndex];
      ctx.fillRect(x, y, cellSize, cellSize);
    }
  }
}

function createTextureLibrary(resources, themeDefinition) {
  const palette = themeDefinition.palette;
  const grassTop = createPixelTexture(resources, "grass_top", (ctx, size) => {
    fillGrid(ctx, size, palette.surfaceTop);
    ctx.fillStyle = palette.surfaceAccent;
    ctx.fillRect(4, 4, 4, 4);
    ctx.fillRect(20, 8, 4, 4);
  });

  const dirt = createPixelTexture(resources, "dirt", (ctx, size) => {
    fillGrid(ctx, size, palette.fill);
  });

  const grassSide = createPixelTexture(resources, "grass_side", (ctx, size) => {
    ctx.fillStyle = palette.surfaceBand;
    ctx.fillRect(0, 0, size, 8);
    fillGrid(ctx, size, palette.fill);
    ctx.fillStyle = palette.surfaceBand;
    ctx.fillRect(0, 0, size, 6);
    ctx.fillStyle = palette.surfaceEdge;
    ctx.fillRect(0, 6, size, 2);
  });

  const soil = createPixelTexture(resources, "soil", (ctx, size) => {
    fillGrid(ctx, size, palette.soil);
  });

  const path = createPixelTexture(resources, "path", (ctx, size) => {
    fillGrid(ctx, size, palette.path);
    ctx.fillStyle = palette.path[1];
    ctx.fillRect(8, 8, 8, 4);
    ctx.fillRect(18, 18, 6, 4);
  });

  const stone = createPixelTexture(resources, "stone", (ctx, size) => {
    fillGrid(ctx, size, palette.stone);
    ctx.fillStyle = palette.stone[2];
    ctx.fillRect(8, 8, 4, 12);
    ctx.fillRect(18, 12, 8, 4);
    ctx.fillStyle = palette.stone[3];
    ctx.fillRect(4, 24, 8, 4);
    ctx.fillRect(24, 4, 4, 8);
  });

  const trunkTop = createPixelTexture(resources, "oak_log_top", (ctx, size) => {
    ctx.fillStyle = palette.trunkTop[0];
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = palette.trunkTop[1];
    ctx.fillRect(4, 4, 24, 24);
    ctx.fillStyle = palette.trunkTop[2];
    ctx.fillRect(8, 8, 16, 16);
    ctx.fillStyle = palette.trunkTop[3];
    ctx.fillRect(12, 12, 8, 8);
  });

  const trunkSide = createPixelTexture(
    resources,
    "oak_log_side",
    (ctx, size) => {
      ctx.fillStyle = palette.trunkSide[0];
      ctx.fillRect(0, 0, size, size);
      for (let x = 0; x < size; x += 6) {
        ctx.fillStyle = x % 12 === 0 ? palette.trunkSide[1] : palette.trunkSide[2];
        ctx.fillRect(x, 0, 3, size);
      }
    }
  );

  const leaf = createPixelTexture(resources, "oak_leaves", (ctx, size) => {
    fillGrid(ctx, size, palette.leaf);
    ctx.fillStyle = palette.leafAccent;
    ctx.fillRect(4, 8, 4, 4);
    ctx.fillRect(20, 20, 4, 4);
    cutPixelHoles(ctx, [[0, 1], [7, 2], [2, 5], [5, 7]]);
  });

  const blossom = createPixelTexture(resources, "blossom", (ctx, size) => {
    fillGrid(ctx, size, palette.blossom);
    ctx.fillStyle = palette.blossomAccent;
    ctx.fillRect(8, 8, 4, 4);
    ctx.fillRect(20, 16, 4, 4);
    cutPixelHoles(ctx, [[1, 0], [6, 2], [0, 6], [7, 7]]);
  });

  const apple = createPixelTexture(resources, "apple", (ctx, size) => {
    fillGrid(ctx, size, palette.fruit);
    ctx.fillStyle = palette.fruitAccent;
    ctx.fillRect(8, 6, 4, 4);
    ctx.fillStyle = palette.fruitStem;
    ctx.fillRect(14, 2, 4, 4);
  });

  const plank = createPixelTexture(resources, "oak_planks", (ctx, size) => {
    ctx.fillStyle = palette.plank[0];
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 8) {
      ctx.fillStyle = y % 16 === 0 ? palette.plank[2] : palette.plank[1];
      ctx.fillRect(0, y, size, 2);
    }
    ctx.fillStyle = palette.plank[3];
    ctx.fillRect(8, 8, 2, 16);
    ctx.fillRect(22, 12, 2, 12);
  });

  const water = createPixelTexture(resources, "water", (ctx, size) => {
    fillGrid(ctx, size, palette.water || palette.stone, 8);
    ctx.fillStyle = (palette.water || palette.stone)[0];
    ctx.fillRect(0, 6, 20, 2);
    ctx.fillRect(12, 22, 20, 2);
  });

  return {
    grassTop,
    grassSide,
    dirt,
    soil,
    path,
    stone,
    trunkTop,
    trunkSide,
    leaf,
    blossom,
    apple,
    plank,
    water,
  };
}

function createVoxelMaterial(resources, options) {
  const common = {
    roughness: 0.96,
    metalness: 0.03,
    envMapIntensity: 0.2,
  };

  const material = new THREE.MeshStandardMaterial({
    ...common,
    map: options.map,
    transparent: !!options.transparent,
    alphaTest: options.alphaTest || 0,
    opacity: options.opacity == null ? 1 : options.opacity,
    depthWrite: options.depthWrite !== false,
    emissive: options.emissive || "#000000",
    emissiveIntensity: options.emissiveIntensity || 0,
    flatShading: true,
  });

  resources.materials.push(material);

  return material;
}

function createBoxMaterialSet(resources, options, axis = "y") {
  const common = {
    roughness: 0.96,
    metalness: 0.03,
    envMapIntensity: 0.2,
  };

  const sideMaterial = new THREE.MeshStandardMaterial({
    ...common,
    map: options.side,
    transparent: !!options.transparent,
    alphaTest: options.alphaTest || 0,
    emissive: options.sideEmissive || "#000000",
    emissiveIntensity: options.emissiveIntensity || 0,
    flatShading: true,
  });
  const topMaterial = new THREE.MeshStandardMaterial({
    ...common,
    map: options.top || options.side,
    transparent: !!options.transparent,
    alphaTest: options.alphaTest || 0,
    emissive: options.topEmissive || options.sideEmissive || "#000000",
    emissiveIntensity: options.emissiveIntensity || 0,
    flatShading: true,
  });
  const bottomMaterial = new THREE.MeshStandardMaterial({
    ...common,
    map: options.bottom || options.side,
    transparent: !!options.transparent,
    alphaTest: options.alphaTest || 0,
    flatShading: true,
  });

  resources.materials.push(sideMaterial, topMaterial, bottomMaterial);

  if (axis === "x") {
    return [topMaterial, bottomMaterial, sideMaterial, sideMaterial, sideMaterial, sideMaterial];
  }
  if (axis === "z") {
    return [sideMaterial, sideMaterial, sideMaterial, sideMaterial, topMaterial, bottomMaterial];
  }
  return [sideMaterial, sideMaterial, topMaterial, bottomMaterial, sideMaterial, sideMaterial];
}

function createMaterialLibrary(resources, themeDefinition) {
  const textures = createTextureLibrary(resources, themeDefinition);
  const palette = themeDefinition.palette;

  const cloudMaterial = new THREE.MeshStandardMaterial({
    color: palette.cloudColor,
    transparent: true,
    opacity: palette.cloudOpacity,
    roughness: 1,
    metalness: 0,
  });
  const glowMaterial = new THREE.MeshStandardMaterial({
    color: palette.glow[0],
    emissive: palette.glow[1],
    emissiveIntensity: palette.glow[2],
    roughness: 0.45,
    metalness: 0,
  });
  const pinkGlowMaterial = new THREE.MeshStandardMaterial({
    color: palette.accentGlow[0],
    emissive: palette.accentGlow[1],
    emissiveIntensity: palette.accentGlow[2],
    roughness: 0.55,
    metalness: 0,
  });

  resources.materials.push(cloudMaterial, glowMaterial, pinkGlowMaterial);

  return {
    grass: createBoxMaterialSet(resources, {
      top: textures.grassTop,
      side: textures.grassSide,
      bottom: textures.dirt,
    }),
    dirt: createVoxelMaterial(resources, {
      map: textures.dirt,
    }),
    soil: createVoxelMaterial(resources, {
      map: textures.soil,
    }),
    path: createVoxelMaterial(resources, {
      map: textures.path,
    }),
    stone: createVoxelMaterial(resources, {
      map: textures.stone,
    }),
    trunk: createBoxMaterialSet(resources, {
      top: textures.trunkTop,
      side: textures.trunkSide,
      bottom: textures.trunkTop,
    }),
    trunkX: createBoxMaterialSet(resources, {
      top: textures.trunkTop,
      side: textures.trunkSide,
      bottom: textures.trunkTop,
    }, "x"),
    trunkZ: createBoxMaterialSet(resources, {
      top: textures.trunkTop,
      side: textures.trunkSide,
      bottom: textures.trunkTop,
    }, "z"),
    leaf: createVoxelMaterial(resources, {
      map: textures.leaf,
      alphaTest: 0.32,
      emissive: "#16351d",
      emissiveIntensity: 0.08,
    }),
    blossom: createVoxelMaterial(resources, {
      map: textures.blossom,
      alphaTest: 0.3,
      emissive: "#5d1c38",
      emissiveIntensity: 0.06,
    }),
    apple: createVoxelMaterial(resources, {
      map: textures.apple,
      emissive: "#51140f",
      emissiveIntensity: 0.1,
    }),
    plank: createVoxelMaterial(resources, {
      map: textures.plank,
    }),
    water: createVoxelMaterial(resources, {
      map: textures.water,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
    }),
    cloud: cloudMaterial,
    glow: glowMaterial,
    pinkGlow: pinkGlowMaterial,
  };
}

function createGeometryLibrary(resources) {
  const unit = new THREE.BoxGeometry(1, 1, 1);
  const sparkCube = new THREE.BoxGeometry(0.18, 0.18, 0.18);

  resources.geometries.push(unit, sparkCube);

  return {
    unit,
    sparkCube,
  };
}

function createRuntime(framing = getCameraFraming(1)) {
  return {
    renderer: null,
    scene: null,
    camera: null,
    cameraTarget: new THREE.Vector3(0, framing.targetY || 2.6, 0),
    world: null,
    host: null,
    materials: null,
    geometries: null,
    resources: {
      textures: [],
      materials: [],
      geometries: [],
    },
    clouds: [],
    ambientLights: [],
    isNight: false,
    stage: null,
    animationFrame: 0,
    resizeObserver: null,
    contextLostHandler: null,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    cameraTheta: 0,
    baseWorldRotationY: 0,
    basePhi: framing.phi,
    targetWorldRotationY: 0,
    targetPhi: framing.phi,
    currentWorldRotationY: 0,
    currentPhi: framing.phi,
    radius: framing.radius,
    lastTimestamp: 0,
  };
}

function disposeRuntime(runtime) {
  if (!runtime) return;

  if (runtime.animationFrame) {
    cancelAnimationFrame(runtime.animationFrame);
    runtime.animationFrame = 0;
  }

  if (runtime.resizeObserver) {
    runtime.resizeObserver.disconnect();
    runtime.resizeObserver = null;
  }

  if (runtime.host) {
    runtime.host.onpointerdown = null;
    runtime.host.onpointermove = null;
    runtime.host.onpointerup = null;
    runtime.host.onpointerleave = null;
    runtime.host.onpointercancel = null;
  }

  if (runtime.renderer) {
    if (runtime.contextLostHandler && runtime.renderer.domElement) {
      runtime.renderer.domElement.removeEventListener(
        "webglcontextlost",
        runtime.contextLostHandler
      );
    }
    const loseContext = runtime.renderer.getContext
      ? runtime.renderer.getContext().getExtension("WEBGL_lose_context")
      : null;
    runtime.renderer.dispose();
    if (loseContext) loseContext.loseContext();
    if (runtime.renderer.domElement && runtime.renderer.domElement.parentNode) {
      runtime.renderer.domElement.parentNode.removeChild(
        runtime.renderer.domElement
      );
    }
  }

  runtime.resources.textures.forEach((item) => item.dispose && item.dispose());
  runtime.resources.materials.forEach((item) => item.dispose && item.dispose());
  runtime.resources.geometries.forEach(
    (item) => item.dispose && item.dispose()
  );
}

function addVoxel(runtime, group, materialKey, x, y, z, options = {}) {
  const scale = options.scale || [1, 1, 1];
  const mesh = new THREE.Mesh(
    runtime.geometries.unit,
    runtime.materials[materialKey]
  );
  mesh.scale.set(scale[0], scale[1], scale[2]);
  mesh.position.set(x, y - 0.5 + (scale[1] - 1) * 0.5, z);
  mesh.castShadow = options.castShadow !== false;
  mesh.receiveShadow = options.receiveShadow !== false;
  group.add(mesh);
  return mesh;
}

function addParticle(runtime, targetList, group, materialKey, config) {
  const mesh = new THREE.Mesh(
    runtime.geometries.sparkCube,
    runtime.materials[materialKey]
  );
  mesh.position.set(config.origin.x, config.origin.y, config.origin.z);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  group.add(mesh);

  targetList.push({
    mesh,
    origin: config.origin,
    radius: config.radius,
    speed: config.speed,
    lift: config.lift,
    phase: config.phase,
  });
}

function animateParticleSet(items, timestamp, indexOffset = 0) {
  if (!Array.isArray(items)) return;
  items.forEach((item, index) => {
    item.mesh.position.x =
      item.origin.x +
      Math.cos(timestamp * 0.001 * item.speed + item.phase) * item.radius;
    item.mesh.position.z =
      item.origin.z +
      Math.sin(timestamp * 0.00115 * item.speed + item.phase) * item.radius;
    item.mesh.position.y =
      item.origin.y +
      Math.sin(
        timestamp * 0.0015 * item.speed + item.phase + index + indexOffset
      ) *
        item.lift;
    item.mesh.rotation.y = timestamp * 0.0012 * item.speed + item.phase;
    item.mesh.rotation.x = item.mesh.rotation.y * 0.65;
  });
}

function addFlowerPatch(runtime, group, x, z, colorKey = "blossom") {
  const baseY = getDecorationBaseY(x, z);
  addVoxel(runtime, group, "leaf", x, baseY, z, {
    scale: [0.2, 0.28, 0.2],
    castShadow: false,
  });
  addVoxel(runtime, group, colorKey, x, baseY + 0.32, z, {
    scale: [0.35, 0.2, 0.35],
    castShadow: false,
  });
}

function buildCloud(runtime, x, y, z, scale = 1) {
  const cloud = new THREE.Group();
  const offsets = [
    [-1.1, 0, 0, 1.6],
    [0, 0.25, 0.2, 1.9],
    [1.25, -0.1, -0.2, 1.35],
    [0.3, -0.2, 0.85, 1.15],
  ];

  offsets.forEach((offset) => {
    const mesh = new THREE.Mesh(
      runtime.geometries.unit,
      runtime.materials.cloud
    );
    mesh.scale.set(offset[3] * scale, 0.8 * scale, 1.1 * scale);
    mesh.position.set(offset[0] * scale, offset[1] * scale, offset[2] * scale);
    cloud.add(mesh);
  });

  cloud.position.set(x, y, z);
  runtime.world.add(cloud);
  runtime.clouds.push({
    group: cloud,
    baseX: x,
    baseZ: z,
    speed: 0.09 + scale * 0.02,
    amplitude: 0.6 + scale * 0.2,
    phase: (x + z) * 0.35,
  });
}

function sampleTerrainNoise(x, z) {
  const seed = Math.sin(x * 12.9898 + z * 78.233 + x * z * 0.217) * 43758.5453;
  return seed - Math.floor(seed);
}

function isIslandSurfaceCell(x, z) {
  const radial = Math.sqrt(x * x + z * z * 1.08);
  const noise = sampleTerrainNoise(x, z);
  return radial <= 4.85 + noise * 0.45;
}

function getIslandTopHeight(x, z) {
  const key = `${x}:${z}`;
  const radial = Math.sqrt(x * x + z * z);
  const noise = sampleTerrainNoise(x, z);

  if (Math.abs(x) <= 1 && Math.abs(z) <= 1) return 0;
  if (PATH_CELLS.has(key)) return 0;
  if (radial < 2.2) return 0;
  if (radial < 3.65 && noise > 0.74) return 1;
  if (radial < 4.6 && noise > 0.86) return 1;
  return 0;
}

function getIslandDepth(x, z, topY) {
  const radial = Math.sqrt(x * x + z * z * 1.06);
  const noise = sampleTerrainNoise(x, z);
  return Math.max(
    3,
    Math.floor(3.2 + Math.max(0, 4.9 - radial) * 1.25 + noise * 2 + topY * 0.6)
  );
}

function getSurfaceMaterialKey(runtime, x, z) {
  const key = `${x}:${z}`;
  if (Math.abs(x) <= 1 && Math.abs(z) <= 1) return "soil";
  if (PATH_CELLS.has(key)) return "path";
  if (runtime.themeKey === "swamp_redwood" && SWAMP_WATER_CELLS.has(key)) {
    return "water";
  }
  return "grass";
}

function getGroundTopY(x, z) {
  const cellX = Math.round(x);
  const cellZ = Math.round(z);
  return isIslandSurfaceCell(cellX, cellZ)
    ? getIslandTopHeight(cellX, cellZ)
    : 0;
}

function getDecorationBaseY(x, z) {
  return getGroundTopY(x, z) + 1;
}

function addGroundedVoxel(
  runtime,
  group,
  materialKey,
  x,
  z,
  options = {},
  lift = 0
) {
  return addVoxel(
    runtime,
    group,
    materialKey,
    x,
    getDecorationBaseY(x, z) + lift,
    z,
    options
  );
}

function buildFloatingShard(
  runtime,
  x,
  y,
  z,
  width = 2,
  depth = 2,
  height = 2
) {
  for (let ix = 0; ix < width; ix += 1) {
    for (let iz = 0; iz < depth; iz += 1) {
      const offsetX = x + ix - (width - 1) * 0.5;
      const offsetZ = z + iz - (depth - 1) * 0.5;
      addVoxel(runtime, runtime.world, "grass", offsetX, y, offsetZ, {
        castShadow: false,
      });

      const edgeDistance = Math.min(ix, iz, width - 1 - ix, depth - 1 - iz);
      const localDepth = Math.max(1, height - (edgeDistance === 0 ? 1 : 0));
      for (let iy = 1; iy <= localDepth; iy += 1) {
        addVoxel(runtime, runtime.world, "stone", offsetX, y - iy, offsetZ, {
          castShadow: false,
        });
      }
    }
  }
}

function addLanternPost(runtime, group, x, z, glowMaterialKey = "glow") {
  const baseY = getDecorationBaseY(x, z);
  addVoxel(runtime, group, "plank", x, baseY, z, {
    scale: [0.5, 1.6, 0.5],
  });
  addVoxel(runtime, group, glowMaterialKey, x, baseY + 1.6, z, {
    scale: [0.42, 0.42, 0.42],
    castShadow: false,
    receiveShadow: false,
  });
  if (runtime.isNight) {
    const glowPalette =
      glowMaterialKey === "pinkGlow"
        ? runtime.themeDefinition.palette.accentGlow
        : runtime.themeDefinition.palette.glow;
    const light = new THREE.PointLight(glowPalette[0], 3.4, 6.5, 2);
    light.position.set(x, baseY + 0.82, z);
    light.castShadow = false;
    group.add(light);
  }
}

function addGrassTuft(runtime, group, x, z, materialKey = "leaf") {
  const baseY = getDecorationBaseY(x, z);
  [
    [x - 0.14, baseY + 0.02, z, [0.18, 0.72, 0.18]],
    [x + 0.14, baseY + 0.08, z + 0.08, [0.18, 0.58, 0.18]],
    [x + 0.02, baseY + 0.12, z - 0.16, [0.18, 0.86, 0.18]],
  ].forEach((item) => {
    addVoxel(runtime, group, materialKey, item[0], item[1], item[2], {
      scale: item[3],
      castShadow: false,
    });
  });
}

function addMiniBirch(runtime, group, x, z) {
  const baseY = getDecorationBaseY(x, z);
  addVoxel(runtime, group, "trunk", x, baseY, z, {
    scale: [0.24, 1.26, 0.24],
    castShadow: false,
  });
  addVoxel(runtime, group, "leaf", x, baseY + 1.24, z, {
    scale: [0.64, 0.56, 0.64],
    castShadow: false,
  });
  addVoxel(runtime, group, "blossom", x, baseY + 1.76, z, {
    scale: [0.28, 0.18, 0.28],
    castShadow: false,
  });
}

function addCrystalCluster(runtime, group, x, z) {
  const baseY = getDecorationBaseY(x, z);
  [
    [x, baseY, z, [0.32, 1.46, 0.32]],
    [x + 0.28, baseY, z - 0.2, [0.22, 1.02, 0.22]],
    [x - 0.24, baseY, z + 0.16, [0.2, 0.88, 0.2]],
  ].forEach((item) => {
    addVoxel(runtime, group, "stone", item[0], item[1], item[2], {
      scale: item[3],
      castShadow: false,
    });
  });
  addVoxel(runtime, group, "pinkGlow", x, baseY + 1.46, z, {
    scale: [0.16, 0.16, 0.16],
    castShadow: false,
    receiveShadow: false,
  });
}

function addSwampStump(runtime, group, x, z) {
  const baseY = getDecorationBaseY(x, z);
  addVoxel(runtime, group, "trunk", x, baseY, z, {
    scale: [0.82, 0.92, 0.82],
  });
  addVoxel(runtime, group, "trunkZ", x + 0.56, baseY, z, {
    scale: [0.48, 0.44, 1.02],
  });
  addVoxel(runtime, group, "pinkGlow", x, baseY + 0.92, z, {
    scale: [0.2, 0.2, 0.2],
    castShadow: false,
    receiveShadow: false,
  });
}

function buildNightAtmosphere(runtime, group) {
  if (!runtime.isNight) return;
  const materialKey =
    runtime.themeKey === "sakura_grove" || runtime.themeKey === "swamp_redwood"
      ? "pinkGlow"
      : "glow";
  [
    [-3.2, -1.4, 1.15, 0.46, 0.72, 0.18, 0.2],
    [3.1, -1.8, 1.35, 0.52, 0.64, 0.22, 1.4],
    [-2.4, 2.8, 1.72, 0.4, 0.82, 0.2, 2.6],
    [2.6, 2.4, 1.46, 0.44, 0.76, 0.18, 3.8],
    [-0.9, 3.6, 1.28, 0.36, 0.9, 0.16, 4.7],
    [1.2, -3.4, 1.58, 0.48, 0.68, 0.22, 5.5],
  ].forEach((item, index) => {
    addParticle(runtime, runtime.ambientLights, group, index % 3 === 0 ? "glow" : materialKey, {
      origin: new THREE.Vector3(
        item[0],
        getGroundTopY(item[0], item[1]) + item[2],
        item[1]
      ),
      radius: item[3],
      speed: item[4],
      lift: item[5],
      phase: item[6],
    });
  });
}

function buildThemeTerrainDecorations(runtime, terrain) {
  if (runtime.themeKey === "birch_blossom") {
    [
      [-4.4, -1],
      [-3.8, 2.5],
      [4.2, -2],
      [3.6, 2.7],
      [-1.5, -3.7],
      [1.8, -3.4],
      [0.8, 3.8],
    ].forEach((item, index) => {
      addFlowerPatch(runtime, terrain, item[0], item[1], index % 3 === 0 ? "apple" : "blossom");
    });
    [
      [-3.9, 3.4],
      [3.8, 3.2],
      [-4.1, -2.8],
      [4.1, -1.7],
    ].forEach((item) => {
      addMiniBirch(runtime, terrain, item[0], item[1]);
    });
    addMiniBirch(runtime, terrain, -1.25, -0.8);
    addMiniBirch(runtime, terrain, 1.35, -0.2);
    addFlowerPatch(runtime, terrain, -0.35, 0.95, "blossom");
    addFlowerPatch(runtime, terrain, 0.45, 0.72, "blossom");
    addLanternPost(runtime, terrain, -2.2, 4.4, "pinkGlow");
    addLanternPost(runtime, terrain, 2.2, 4.4, "pinkGlow");
    return;
  }

  if (runtime.themeKey === "snow_spruce") {
    [
      [-4.2, -1.8, [0.34, 1.4, 0.34]],
      [-3.6, 2.8, [0.26, 1.08, 0.26]],
      [4.2, -2.3, [0.34, 1.5, 0.34]],
      [3.4, 2.6, [0.24, 0.96, 0.24]],
    ].forEach((item) => {
      addGroundedVoxel(runtime, terrain, "stone", item[0], item[1], {
        scale: item[2],
        castShadow: false,
      });
      addGroundedVoxel(runtime, terrain, "pinkGlow", item[0], item[1], {
        scale: [0.16, 0.16, 0.16],
        castShadow: false,
        receiveShadow: false,
      }, item[2][1]);
    });
    addCrystalCluster(runtime, terrain, -0.5, -0.9);
    addCrystalCluster(runtime, terrain, 0.7, -0.4);
    addLanternPost(runtime, terrain, -2.2, 4.4, "pinkGlow");
    addLanternPost(runtime, terrain, 2.2, 4.4, "pinkGlow");
    return;
  }

  if (runtime.themeKey === "sakura_grove") {
    [
      [-4.2, -1.2],
      [-3.8, 2.6],
      [4.1, -2.3],
      [3.6, 2.8],
      [-1.6, -3.8],
      [1.8, -3.5],
      [0.8, 3.9],
      [-0.7, 3.7],
    ].forEach((item) => {
      addFlowerPatch(runtime, terrain, item[0], item[1], "blossom");
    });
    addFlowerPatch(runtime, terrain, -0.55, 0.9, "blossom");
    addFlowerPatch(runtime, terrain, 0.35, 0.55, "blossom");
    addMiniBirch(runtime, terrain, -1.2, -0.65);
    addLanternPost(runtime, terrain, -2.2, 4.4, "pinkGlow");
    addLanternPost(runtime, terrain, 2.2, 4.4, "pinkGlow");
    return;
  }

  if (runtime.themeKey === "savanna_acacia") {
    [
      [-4.2, -1.6],
      [-3.6, 2.8],
      [4, -2.2],
      [3.8, 2.7],
      [-1.4, -3.8],
      [1.6, -3.3],
      [0.8, 3.9],
    ].forEach((item) => {
      addGrassTuft(runtime, terrain, item[0], item[1]);
    });
    [
      [-3.9, 3.3, [0.68, 1.8, 0.68]],
      [4.2, -1.9, [0.74, 2.1, 0.74]],
      [2.2, 4.1, [0.52, 1.3, 0.52]],
    ].forEach((item) => {
      addGroundedVoxel(runtime, terrain, "stone", item[0], item[1], {
        scale: item[2],
        castShadow: false,
      });
    });
    addGrassTuft(runtime, terrain, -0.45, 0.88);
    addGrassTuft(runtime, terrain, 0.4, 0.62);
    addGroundedVoxel(runtime, terrain, "stone", 1.15, -0.35, {
      scale: [0.7, 0.9, 0.7],
      castShadow: false,
    });
    addLanternPost(runtime, terrain, -2.2, 4.4, "glow");
    addLanternPost(runtime, terrain, 2.2, 4.4, "glow");
    return;
  }

  if (runtime.themeKey === "swamp_redwood") {
    [
      [-4.2, -1.1],
      [-3.6, 2.8],
      [4.1, -2.2],
      [3.6, 2.9],
      [-1.4, -3.8],
      [1.8, -3.4],
    ].forEach((item) => {
      addGrassTuft(runtime, terrain, item[0], item[1]);
    });
    [
      [-3.9, 3.3],
      [4, -1.8],
      [-1.6, 4],
    ].forEach((item) => {
      addGroundedVoxel(runtime, terrain, "trunk", item[0], item[1], {
        scale: [0.46, 1.24, 0.46],
      });
      addGroundedVoxel(runtime, terrain, "pinkGlow", item[0], item[1], {
        scale: [0.18, 0.18, 0.18],
        castShadow: false,
        receiveShadow: false,
      }, 1.24);
    });
    addSwampStump(runtime, terrain, -0.35, -0.55);
    addGrassTuft(runtime, terrain, 0.55, 0.82);
    addLanternPost(runtime, terrain, -2.2, 4.4, "pinkGlow");
    addLanternPost(runtime, terrain, 2.2, 4.4, "pinkGlow");
    return;
  }

  [
    [-4.2, -1.2],
    [-3.8, 2.6],
    [4.1, -2.3],
    [3.6, 2.8],
    [-1.6, -3.8],
    [1.8, -3.5],
  ].forEach((item, index) => {
    addFlowerPatch(
      runtime,
      terrain,
      item[0],
      item[1],
      index % 2 === 0 ? "blossom" : "apple"
    );
  });
  [
    [-3.9, 3.4],
    [3.7, 3.1],
    [-4.1, -2.8],
    [4.2, -1.6],
  ].forEach((item) => {
    addGroundedVoxel(runtime, terrain, "leaf", item[0], item[1], {
      scale: [0.22, 0.75, 0.22],
      castShadow: false,
    });
    addGroundedVoxel(runtime, terrain, "leaf", item[0], item[1], {
      scale: [0.46, 0.18, 0.46],
      castShadow: false,
    }, 0.75);
  });
  addLanternPost(runtime, terrain, -2.2, 4.4, "glow");
  addLanternPost(runtime, terrain, 2.2, 4.4, "glow");
}

function buildThemeClouds(runtime) {
  (runtime.themeDefinition.clouds || []).forEach((item) => {
    buildCloud(runtime, item[0], item[1], item[2], item[3]);
  });
}

function buildTerrain(runtime) {
  const terrain = new THREE.Group();

  for (let x = -6; x <= 6; x += 1) {
    for (let z = -6; z <= 6; z += 1) {
      if (!isIslandSurfaceCell(x, z)) continue;

      const topY = getIslandTopHeight(x, z);
      const depth = getIslandDepth(x, z, topY);

      addVoxel(runtime, terrain, getSurfaceMaterialKey(runtime, x, z), x, topY, z, {
        castShadow: false,
      });

      for (let step = 1; step <= depth; step += 1) {
        const y = topY - step;
        const materialKey = step > depth - 2 || y < -4 ? "stone" : "dirt";
        addVoxel(runtime, terrain, materialKey, x, y, z, {
          castShadow: false,
          receiveShadow: y >= -2,
        });
      }
    }
  }

  [
    [0, -7, 0, [1.1, 3.4, 1.1]],
    [-0.7, -6.2, 0.5, [0.8, 2.2, 0.8]],
    [0.8, -6, -0.6, [0.7, 2, 0.7]],
  ].forEach((item) => {
    addVoxel(runtime, terrain, "stone", item[0], item[1], item[2], {
      scale: item[3],
      castShadow: false,
    });
  });
  [
    [-9.2, -0.4, -3.2, 2, 2, 2],
    [9.4, -0.6, -4.4, 3, 2, 3],
    [-7.4, 0.4, 7.8, 2, 2, 2],
    [8.1, 0.2, 6.6, 3, 2, 2],
  ].forEach((item) => {
    buildFloatingShard(
      runtime,
      item[0],
      item[1],
      item[2],
      item[3],
      item[4],
      item[5]
    );
  });
  [
    [-1.1, 1.02, 4.3, [1.15, 0.22, 1.1]],
    [0, 1.02, 4.9, [1.25, 0.22, 1.25]],
    [1.1, 1.02, 4.3, [1.15, 0.22, 1.1]],
  ].forEach((item) => {
    addVoxel(runtime, terrain, "plank", item[0], item[1], item[2], {
      scale: item[3],
      castShadow: false,
    });
  });
  buildThemeTerrainDecorations(runtime, terrain);
  buildNightAtmosphere(runtime, terrain);

  runtime.world.add(terrain);

  buildThemeClouds(runtime);
}

function addOakLeaves(
  runtime,
  group,
  cells,
  materialKey = "leaf",
  options = {}
) {
  cells.forEach((cell) => {
    addVoxel(runtime, group, materialKey, cell[0], cell[1], cell[2], options);
  });
}

function getBloomOakLeafCells() {
  return [
    [0, 4, 0],
    [-1, 4, 0],
    [1, 4, 0],
    [0, 4, -1],
    [0, 4, 1],
    [-2, 5, -1],
    [-1, 5, -2],
    [0, 5, -2],
    [1, 5, -2],
    [2, 5, -1],
    [-2, 5, 0],
    [-1, 5, 0],
    [0, 5, 0],
    [1, 5, 0],
    [2, 5, 0],
    [-2, 5, 1],
    [-1, 5, 1],
    [0, 5, 1],
    [1, 5, 1],
    [2, 5, 1],
    [-1, 5, 2],
    [0, 5, 2],
    [1, 5, 2],
    [-2, 6, 0],
    [-1, 6, -1],
    [0, 6, -1],
    [1, 6, -1],
    [2, 6, 0],
    [-1, 6, 0],
    [0, 6, 0],
    [1, 6, 0],
    [0, 6, 1],
    [1, 6, 1],
    [0, 7, 0],
    [-1, 7, 0],
    [0, 7, -1],
    [1, 7, 0],
  ];
}

function getFruitOakLeafCells() {
  return [
    [0, 4, 0],
    [-1, 4, 0],
    [1, 4, 0],
    [0, 4, -1],
    [0, 4, 1],
    [-2, 5, -1],
    [-1, 5, -2],
    [0, 5, -2],
    [1, 5, -2],
    [2, 5, -1],
    [-2, 5, 0],
    [-1, 5, 0],
    [0, 5, 0],
    [1, 5, 0],
    [2, 5, 0],
    [-2, 5, 1],
    [-1, 5, 1],
    [0, 5, 1],
    [1, 5, 1],
    [2, 5, 1],
    [-1, 5, 2],
    [0, 5, 2],
    [1, 5, 2],
    [-2, 6, -1],
    [-1, 6, -1],
    [0, 6, -1],
    [1, 6, -1],
    [2, 6, -1],
    [-2, 6, 0],
    [-1, 6, 0],
    [0, 6, 0],
    [1, 6, 0],
    [2, 6, 0],
    [-1, 6, 1],
    [0, 6, 1],
    [1, 6, 1],
    [0, 6, 2],
    [-1, 7, 0],
    [0, 7, 0],
    [1, 7, 0],
    [0, 7, -1],
    [0, 7, 1],
  ];
}

function getBirchLeafCells() {
  return [
    [0, 4, 0], [-1, 4, 0], [1, 4, 0], [0, 4, -1], [0, 4, 1],
    [-1, 5, -1], [0, 5, -1], [1, 5, -1], [-2, 5, 0], [-1, 5, 0],
    [0, 5, 0], [1, 5, 0], [2, 5, 0], [-1, 5, 1], [0, 5, 1],
    [1, 5, 1], [0, 5, 2], [-1, 6, 0], [0, 6, -1], [0, 6, 0],
    [1, 6, 0], [0, 6, 1], [0, 7, 0],
  ];
}

function createStageShell() {
  const root = new THREE.Group();
  const treePivot = new THREE.Group();
  const floatingLights = [];
  root.add(treePivot);
  return {
    root,
    treePivot,
    floatingLights,
  };
}

function addRoundCanopyLayer(
  runtime,
  group,
  materialKey,
  centerX,
  centerY,
  centerZ,
  radius,
  scale = [0.92, 0.82, 0.92]
) {
  for (let x = -radius; x <= radius; x += 1) {
    for (let z = -radius; z <= radius; z += 1) {
      if (Math.sqrt(x * x + z * z) > radius + 0.2) continue;
      addVoxel(runtime, group, materialKey, centerX + x, centerY, centerZ + z, {
        scale,
        castShadow: true,
      });
    }
  }
}

function addHorizontalLog(runtime, group, axis, x, y, z, length, thickness = 0.5) {
  const alongX = axis === "x";
  const segmentCount = Math.max(1, Math.ceil(length));
  const segmentLength = length / segmentCount;
  for (let index = 0; index < segmentCount; index += 1) {
    const offset = -length * 0.5 + segmentLength * (index + 0.5);
    addVoxel(
      runtime,
      group,
      alongX ? "trunkX" : "trunkZ",
      alongX ? x + offset : x,
      y,
      alongX ? z : z + offset,
      {
        scale: alongX
          ? [segmentLength + 0.02, thickness, thickness]
          : [thickness, thickness, segmentLength + 0.02],
      }
    );
  }
}

function addTreeRoots(runtime, group, spread = 1.3, thickness = 0.44) {
  addHorizontalLog(runtime, group, "x", 0, 1, 0, spread, thickness);
  addHorizontalLog(runtime, group, "z", 0, 1.02, 0, spread, thickness);
}

function addPlotSign(runtime, group, x = 1.18, z = -1.18) {
  const baseY = getDecorationBaseY(x, z);
  addVoxel(runtime, group, "trunk", x, baseY, z, {
    scale: [0.26, 1.34, 0.26],
  });
  addVoxel(runtime, group, "plank", x, baseY + 1.18, z, {
    scale: [1.46, 0.76, 0.2],
    castShadow: true,
  });
}

function buildBirchTreeStage(runtime, fruiting = false) {
  const stage = createStageShell();
  addTreeRoots(runtime, stage.treePivot, 1.18, 0.32);
  for (let y = 1; y <= 5; y += 1) {
    addVoxel(runtime, stage.treePivot, "trunk", 0, y, 0, {
      scale: [0.66, 1, 0.66],
    });
  }
  addHorizontalLog(runtime, stage.treePivot, "x", 0.62, 4.34, 0, 1.56, 0.4);
  addHorizontalLog(runtime, stage.treePivot, "z", -0.32, 4.78, -0.54, 1.28, 0.36);
  addOakLeaves(runtime, stage.treePivot, getBirchLeafCells(), "leaf", {
    castShadow: true,
  });

  const detailCells = fruiting
    ? [[-1.02, 4.48, 0.84], [1.02, 4.46, 0.92], [-0.92, 5.08, -0.08], [0.94, 5.1, -0.12], [0.06, 5.28, 0.96], [0.04, 6.04, -0.88]]
    : [[-1.1, 4.92, -0.86], [1.12, 5.08, -0.78], [-1.04, 5.12, 0.94], [1.04, 5.16, 0.98], [0, 6.16, -0.9]];
  detailCells.forEach((cell) => {
    addVoxel(runtime, stage.treePivot, fruiting ? "apple" : "blossom", cell[0], cell[1], cell[2], {
      scale: fruiting ? [0.32, 0.4, 0.32] : [0.32, 0.32, 0.32],
      castShadow: false,
    });
  });
  [{ origin: new THREE.Vector3(-0.9, 5.08, 0.4), radius: 0.7, speed: 0.94, lift: 0.18, phase: 0.2 }, { origin: new THREE.Vector3(0.92, 5.72, -0.22), radius: 0.78, speed: 0.82, lift: 0.22, phase: 1.6 }].forEach((config) => {
    addParticle(runtime, stage.floatingLights, stage.root, fruiting ? "glow" : "pinkGlow", config);
  });
  return stage;
}

function buildBirchBloomStage(runtime) {
  return buildBirchTreeStage(runtime, false);
}

function buildBirchFruitStage(runtime) {
  return buildBirchTreeStage(runtime, true);
}

function buildSpruceTreeStage(runtime, fruiting = false) {
  const stage = createStageShell();
  addTreeRoots(runtime, stage.treePivot, 1.34, 0.38);
  for (let y = 1; y <= 6; y += 1) {
    addVoxel(runtime, stage.treePivot, "trunk", 0, y, 0, {
      scale: [0.68, 1, 0.68],
    });
  }
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 3.1, 0, 2, [0.96, 0.72, 0.96]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 4.25, 0, 2, [0.9, 0.68, 0.9]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 5.36, 0, 1, [0.84, 0.76, 0.84]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 6.42, 0, 1, [0.7, 0.76, 0.7]);
  addVoxel(runtime, stage.treePivot, "leaf", 0, 7.3, 0, {
    scale: [0.5, 0.84, 0.5],
    castShadow: true,
  });

  const detailCells = fruiting
    ? [[-1.08, 3.08, 0.86], [1.08, 3.36, 0.72], [-0.9, 4.12, -0.7], [0.92, 4.24, -0.64], [0.08, 5.22, 0.82]]
    : [[-1.14, 3.58, 0.84], [1.12, 4.7, -0.72], [0.88, 5.82, 0.12], [0.04, 6.76, 0.7]];
  detailCells.forEach((cell) => {
    addVoxel(runtime, stage.treePivot, fruiting ? "apple" : "blossom", cell[0], cell[1], cell[2], {
      scale: fruiting ? [0.28, 0.42, 0.28] : [0.32, 0.2, 0.32],
      castShadow: false,
    });
  });
  [{ origin: new THREE.Vector3(-0.84, 4.12, 0.7), radius: 0.62, speed: 0.92, lift: 0.16, phase: 0.3 }, { origin: new THREE.Vector3(0.84, 5.18, -0.2), radius: 0.66, speed: 0.82, lift: 0.18, phase: 1.8 }].forEach((config) => {
    addParticle(runtime, stage.floatingLights, stage.root, fruiting ? "glow" : "pinkGlow", config);
  });
  return stage;
}

function buildSpruceBloomStage(runtime) {
  return buildSpruceTreeStage(runtime, false);
}

function buildSpruceFruitStage(runtime) {
  return buildSpruceTreeStage(runtime, true);
}

function buildSakuraTreeStage(runtime, fruiting = false) {
  const stage = createStageShell();
  addTreeRoots(runtime, stage.treePivot, 1.46, 0.4);
  for (let y = 1; y <= 4; y += 1) {
    addVoxel(runtime, stage.treePivot, "trunk", 0, y, 0, {
      scale: [0.78, 1, 0.78],
    });
  }
  addHorizontalLog(runtime, stage.treePivot, "x", 0.68, 4.32, 0, 1.72, 0.44);
  addHorizontalLog(runtime, stage.treePivot, "z", -0.42, 4.62, -0.64, 1.5, 0.4);

  addRoundCanopyLayer(runtime, stage.treePivot, "blossom", 0, 4.82, 0, 2, [0.96, 0.76, 0.96]);
  addRoundCanopyLayer(runtime, stage.treePivot, "blossom", 0.36, 5.72, -0.12, 2, [0.9, 0.72, 0.9]);
  addRoundCanopyLayer(runtime, stage.treePivot, "blossom", -0.5, 6.52, 0.18, 1, [0.84, 0.76, 0.84]);
  [[-1.72, 4.26, 0], [1.72, 4.22, 0.12], [0.18, 4.18, 1.72], [-0.9, 4.42, -1.52]].forEach((cell) => {
    addVoxel(runtime, stage.treePivot, "blossom", cell[0], cell[1], cell[2], {
      scale: [0.4, 0.58, 0.4],
      castShadow: true,
    });
  });

  if (fruiting) {
    [[-1.12, 4.36, 0.86], [1.18, 4.52, 0.92], [-0.72, 5.12, -0.92], [0.9, 5.18, -0.76], [0.18, 5.62, 1.02]].forEach((cell) => {
      addVoxel(runtime, stage.treePivot, "apple", cell[0], cell[1], cell[2], {
        scale: [0.32, 0.4, 0.32],
        castShadow: false,
      });
    });
  }

  [{ origin: new THREE.Vector3(-1.02, 5.06, 0.5), radius: 0.82, speed: 0.86, lift: 0.2, phase: 0.2 }, { origin: new THREE.Vector3(1.08, 5.76, -0.3), radius: 0.9, speed: 0.76, lift: 0.24, phase: 1.7 }].forEach((config) => {
    addParticle(runtime, stage.floatingLights, stage.root, fruiting ? "glow" : "pinkGlow", config);
  });
  return stage;
}

function buildSakuraBloomStage(runtime) {
  return buildSakuraTreeStage(runtime, false);
}

function buildSakuraFruitStage(runtime) {
  return buildSakuraTreeStage(runtime, true);
}

function buildAcaciaTreeStage(runtime, fruiting = false) {
  const stage = createStageShell();
  addTreeRoots(runtime, stage.treePivot, 1.58, 0.46);
  for (let y = 1; y <= 3; y += 1) {
    addVoxel(runtime, stage.treePivot, "trunk", 0, y, 0, {
      scale: [0.76, 1, 0.76],
    });
  }
  addHorizontalLog(runtime, stage.treePivot, "x", 0.66, 3.4, 0.08, 1.76, 0.5);
  addVoxel(runtime, stage.treePivot, "trunk", 1.3, 4.18, 0.08, {
    scale: [0.58, 1.18, 0.58],
  });
  addHorizontalLog(runtime, stage.treePivot, "x", -0.62, 3.76, -0.34, 1.38, 0.42);

  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 1.2, 4.82, 0.08, 2, [0.98, 0.7, 0.98]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", -0.9, 4.38, -0.42, 1, [0.92, 0.68, 0.92]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0.28, 5.54, 0.02, 1, [0.88, 0.64, 0.88]);

  const detailCells = fruiting
    ? [[1.62, 4.38, 0.72], [0.82, 4.36, -0.9], [1.2, 4.44, 1.02], [0.08, 5.04, -0.82], [-1.08, 3.98, -0.62]]
    : [[1.62, 5.08, 0.18], [0.64, 5.12, -1.02], [1.18, 5.14, 1.1], [-1.12, 4.7, -0.7]];
  detailCells.forEach((cell) => {
    addVoxel(runtime, stage.treePivot, fruiting ? "apple" : "blossom", cell[0], cell[1], cell[2], {
      scale: fruiting ? [0.28, 0.4, 0.28] : [0.32, 0.3, 0.32],
      castShadow: false,
    });
  });
  [{ origin: new THREE.Vector3(1.18, 5.62, 0.32), radius: 0.78, speed: 0.82, lift: 0.16, phase: 0.4 }, { origin: new THREE.Vector3(0.1, 5.9, -0.8), radius: 0.72, speed: 0.92, lift: 0.16, phase: 1.8 }].forEach((config) => {
    addParticle(runtime, stage.floatingLights, stage.root, fruiting ? "glow" : "pinkGlow", config);
  });
  return stage;
}

function buildAcaciaBloomStage(runtime) {
  return buildAcaciaTreeStage(runtime, false);
}

function buildAcaciaFruitStage(runtime) {
  return buildAcaciaTreeStage(runtime, true);
}

function buildRedwoodTreeStage(runtime, fruiting = false) {
  const stage = createStageShell();
  addTreeRoots(runtime, stage.treePivot, 2.08, 0.58);
  for (let y = 1; y <= 8; y += 1) {
    addVoxel(runtime, stage.treePivot, "trunk", 0, y, 0, {
      scale: [1.02, 1, 1.02],
    });
  }
  addHorizontalLog(runtime, stage.treePivot, "x", 0, 4.42, 0, 3.2, 0.44);
  addHorizontalLog(runtime, stage.treePivot, "z", 0, 5.58, 0, 2.8, 0.4);
  addHorizontalLog(runtime, stage.treePivot, "x", 0, 6.72, 0, 2.2, 0.36);

  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 4.62, 0, 2, [0.98, 0.68, 0.98]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 5.76, 0, 2, [0.92, 0.66, 0.92]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 6.86, 0, 1, [0.86, 0.74, 0.86]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 7.92, 0, 1, [0.76, 0.76, 0.76]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 8.9, 0, 1, [0.62, 0.72, 0.62]);
  addVoxel(runtime, stage.treePivot, "leaf", 0, 9.72, 0, {
    scale: [0.44, 0.78, 0.44],
    castShadow: true,
  });

  const detailCells = fruiting
    ? [[-1.26, 4.34, 0.72], [1.24, 4.4, -0.66], [-0.92, 5.52, -0.72], [0.94, 5.58, 0.7], [0.08, 6.62, -0.82]]
    : [[-1.2, 4.86, 0.76], [1.18, 5.02, -0.72], [-0.82, 6.02, -0.7], [0.82, 7.04, 0.68]];
  detailCells.forEach((cell) => {
    addVoxel(runtime, stage.treePivot, fruiting ? "apple" : "blossom", cell[0], cell[1], cell[2], {
      scale: fruiting ? [0.24, 0.4, 0.24] : [0.26, 0.3, 0.26],
      castShadow: false,
    });
  });
  [{ origin: new THREE.Vector3(0.88, 6.62, 0.76), radius: 0.7, speed: 0.76, lift: 0.14, phase: 0.3 }, { origin: new THREE.Vector3(-0.68, 7.46, -0.16), radius: 0.64, speed: 0.88, lift: 0.12, phase: 1.7 }].forEach((config) => {
    addParticle(runtime, stage.floatingLights, stage.root, fruiting ? "glow" : "pinkGlow", config);
  });
  return stage;
}

function buildRedwoodBloomStage(runtime) {
  return buildRedwoodTreeStage(runtime, false);
}

function buildRedwoodFruitStage(runtime) {
  return buildRedwoodTreeStage(runtime, true);
}

function buildEmptyStage(runtime) {
  const root = new THREE.Group();
  const kind = runtime.themeDefinition.treeKind;
  addPlotSign(runtime, root);

  if (kind === "birch") {
    addFlowerPatch(runtime, root, -0.72, 0.94, "blossom");
    addFlowerPatch(runtime, root, 0.22, 0.82, "blossom");
    addGroundedVoxel(runtime, root, "stone", -0.7, -0.42, {
      scale: [0.62, 0.38, 0.54],
      castShadow: false,
    });
  } else if (kind === "spruce") {
    addCrystalCluster(runtime, root, -0.22, 0.1);
    addGroundedVoxel(runtime, root, "stone", -0.88, 0.82, {
      scale: [0.7, 0.46, 0.7],
      castShadow: false,
    });
    addGroundedVoxel(runtime, root, "blossom", -0.88, 0.82, {
      scale: [0.72, 0.18, 0.72],
      castShadow: false,
    }, 0.46);
  } else if (kind === "sakura") {
    addVoxel(runtime, root, "plank", 0, 1, -0.88, {
      scale: [2.18, 0.2, 0.2],
      castShadow: false,
    });
    addVoxel(runtime, root, "plank", -0.88, 1.02, 0, {
      scale: [0.2, 0.2, 1.96],
      castShadow: false,
    });
    addFlowerPatch(runtime, root, -0.52, 0.72, "blossom");
    addFlowerPatch(runtime, root, 0.24, 0.66, "blossom");
  } else if (kind === "acacia") {
    addHorizontalLog(runtime, root, "x", -0.32, 1, 0.14, 1.18, 0.48);
    addGrassTuft(runtime, root, -0.82, 0.82);
    addGroundedVoxel(runtime, root, "stone", 0.58, 0.62, {
      scale: [0.58, 0.42, 0.62],
      castShadow: false,
    });
  } else if (kind === "redwood") {
    addSwampStump(runtime, root, 0.08, -0.08);
    addGrassTuft(runtime, root, -0.86, 0.86);
    addFlowerPatch(runtime, root, 0.72, 0.68, "pinkGlow");
  } else {
    addVoxel(runtime, root, "leaf", -0.6, 1, 0.8, {
      scale: [0.36, 0.22, 0.36],
      castShadow: false,
    });
    addVoxel(runtime, root, "blossom", -0.2, 1.2, 0.4, {
      scale: [0.24, 0.24, 0.24],
      castShadow: false,
    });
  }

  return {
    root,
    treePivot: null,
    floatingLights: [],
  };
}

function buildOakSaplingStage(runtime) {
  const root = new THREE.Group();
  const treePivot = new THREE.Group();
  root.add(treePivot);
  addTreeRoots(runtime, treePivot, 0.86, 0.24);

  addVoxel(runtime, treePivot, "trunk", 0, 1, 0, {
    scale: [0.56, 0.82, 0.56],
  });
  addVoxel(runtime, treePivot, "trunk", 0, 1.86, 0, {
    scale: [0.5, 0.74, 0.5],
  });
  [
    [0, 2.58, 0],
    [-0.48, 2.28, 0],
    [0.48, 2.28, 0],
    [0, 2.28, -0.48],
    [0, 2.28, 0.48],
  ].forEach((cell) => {
    addVoxel(runtime, treePivot, "leaf", cell[0], cell[1], cell[2], {
      scale: [0.72, 0.72, 0.72],
      castShadow: true,
    });
  });

  return {
    root,
    treePivot,
    floatingLights: [],
  };
}

function buildOakBloomStage(runtime) {
  const root = new THREE.Group();
  const treePivot = new THREE.Group();
  const floatingLights = [];
  root.add(treePivot);
  addTreeRoots(runtime, treePivot, 1.52, 0.44);

  for (let y = 1; y <= 4; y += 1) {
    addVoxel(runtime, treePivot, "trunk", 0, y, 0, {
      scale: [0.92, 1, 0.92],
    });
  }

  addHorizontalLog(runtime, treePivot, "x", 0, 4.28, 0, 2.38, 0.46);
  addHorizontalLog(runtime, treePivot, "z", 0, 4.56, 0, 2.08, 0.4);

  addOakLeaves(runtime, treePivot, getBloomOakLeafCells(), "leaf", {
    castShadow: true,
  });
  [
    [-1.35, 5.1, -1.15],
    [1.3, 5.15, -1.1],
    [-1.2, 5.12, 1.22],
    [1.28, 5.18, 1.12],
    [0, 6.2, -1.2],
    [0.12, 6.18, 1.18],
    [-0.9, 6.1, 0],
    [0.95, 6.08, 0.08],
  ].forEach((cell) => {
    addVoxel(runtime, treePivot, "blossom", cell[0], cell[1], cell[2], {
      scale: [0.42, 0.42, 0.42],
      castShadow: false,
    });
  });
  [
    {
      origin: new THREE.Vector3(-1.2, 5.2, 0.6),
      radius: 0.85,
      speed: 1.1,
      lift: 0.2,
      phase: 0.1,
    },
    {
      origin: new THREE.Vector3(1.4, 5.5, -0.2),
      radius: 0.92,
      speed: 0.86,
      lift: 0.28,
      phase: 1.4,
    },
    {
      origin: new THREE.Vector3(0.2, 6.2, 1.1),
      radius: 0.7,
      speed: 1.18,
      lift: 0.18,
      phase: 2.2,
    },
  ].forEach((config) => {
    addParticle(runtime, floatingLights, root, "pinkGlow", config);
  });

  return {
    root,
    treePivot,
    floatingLights,
  };
}

function buildOakFruitStage(runtime) {
  const root = new THREE.Group();
  const treePivot = new THREE.Group();
  const floatingLights = [];
  root.add(treePivot);
  addTreeRoots(runtime, treePivot, 1.62, 0.46);

  for (let y = 1; y <= 4; y += 1) {
    addVoxel(runtime, treePivot, "trunk", 0, y, 0, {
      scale: [0.98, 1, 0.98],
    });
  }

  addHorizontalLog(runtime, treePivot, "x", 0, 4.3, 0, 2.46, 0.48);
  addHorizontalLog(runtime, treePivot, "z", 0, 4.58, 0, 2.12, 0.42);

  addOakLeaves(runtime, treePivot, getFruitOakLeafCells(), "leaf", {
    castShadow: true,
  });
  [
    [-1.1, 4.45, 1.08],
    [1.08, 4.4, 1.05],
    [-1.02, 5.08, -0.05],
    [1.05, 5.1, -0.04],
    [0.04, 5.25, 1.1],
    [0.15, 6.0, -1.1],
    [-0.92, 6.15, 0.8],
  ].forEach((cell) => {
    addVoxel(runtime, treePivot, "apple", cell[0], cell[1], cell[2], {
      scale: [0.48, 0.48, 0.48],
      castShadow: false,
    });
  });
  [
    {
      origin: new THREE.Vector3(-1.1, 5.3, -1),
      radius: 0.96,
      speed: 0.82,
      lift: 0.26,
      phase: 0.2,
    },
    {
      origin: new THREE.Vector3(1.35, 5.8, 0.4),
      radius: 1.08,
      speed: 0.74,
      lift: 0.32,
      phase: 1.5,
    },
    {
      origin: new THREE.Vector3(0.1, 6.5, 1.2),
      radius: 0.78,
      speed: 0.94,
      lift: 0.24,
      phase: 2.4,
    },
    {
      origin: new THREE.Vector3(0.4, 4.8, -1.3),
      radius: 0.84,
      speed: 1.02,
      lift: 0.18,
      phase: 3.1,
    },
  ].forEach((config) => {
    addParticle(runtime, floatingLights, root, "glow", config);
  });

  return {
    root,
    treePivot,
    floatingLights,
  };
}

function buildHarvestStage(runtime) {
  const root = new THREE.Group();
  const kind = runtime.themeDefinition.treeKind;

  if (kind === "spruce") {
    addVoxel(runtime, root, "trunk", 0, 1, 0, {
      scale: [0.92, 1.18, 0.92],
    });
    addVoxel(runtime, root, "trunk", 0, 2.08, 0, {
      scale: [0.62, 0.44, 0.62],
    });
    addCrystalCluster(runtime, root, -0.92, 0.42);
  } else if (kind === "acacia") {
    addVoxel(runtime, root, "trunk", 0.2, 1, 0, {
      scale: [1.18, 0.82, 1.18],
    });
    addHorizontalLog(runtime, root, "x", 1.12, 1.18, 0.12, 1.5, 0.5);
    addGrassTuft(runtime, root, -0.9, 0.7);
  } else if (kind === "redwood") {
    addSwampStump(runtime, root, 0.1, 0);
    addHorizontalLog(runtime, root, "x", -1.26, 1.06, -0.74, 1.46, 0.56);
  } else if (kind === "birch") {
    addVoxel(runtime, root, "trunk", 0, 1, 0, {
      scale: [0.9, 0.88, 0.9],
    });
    addHorizontalLog(runtime, root, "x", 0.96, 1.02, 0.62, 1.22, 0.44);
    addFlowerPatch(runtime, root, -0.82, 0.72, "blossom");
  } else if (kind === "sakura") {
    addVoxel(runtime, root, "trunk", 0, 1, 0, {
      scale: [1.02, 0.92, 1.02],
    });
    addHorizontalLog(runtime, root, "x", 1.08, 1.02, 0.62, 1.34, 0.48);
    addFlowerPatch(runtime, root, -0.62, 0.76, "blossom");
    addFlowerPatch(runtime, root, 0.28, 0.52, "blossom");
  } else {
    addVoxel(runtime, root, "trunk", 0, 1, 0, {
      scale: [1.08, 1, 1.08],
    });
    addVoxel(runtime, root, "trunk", 0, 2, 0, {
      scale: [0.78, 0.56, 0.78],
    });
  }

  [
    ["x", 1.3, 1, 0.7, 1.5, 0.68],
    ["x", 2.42, 1.02, 0.72, 0.7, 0.68],
    ["x", -1.2, 1, -0.92, 1.28, 0.66],
    ["x", -2, 1.02, -0.92, 0.7, 0.66],
  ].forEach((item) => {
    addHorizontalLog(runtime, root, item[0], item[1], item[2], item[3], item[4], item[5]);
  });

  addVoxel(runtime, root, "plank", 1.8, 1, -1.5, {
    scale: [1.2, 0.8, 1.2],
  });
  addVoxel(runtime, root, "apple", 1.5, 1.45, -1.3, {
    scale: [0.42, 0.42, 0.42],
    castShadow: false,
  });
  addVoxel(runtime, root, "apple", 1.95, 1.52, -1.55, {
    scale: [0.42, 0.42, 0.42],
    castShadow: false,
  });

  return {
    root,
    treePivot: null,
    floatingLights: [],
  };
}

function buildSaplingStage(runtime) {
  if (runtime.themeDefinition.treeKind === "birch") {
    const stage = createStageShell();
    addTreeRoots(runtime, stage.treePivot, 0.84, 0.22);
    addVoxel(runtime, stage.treePivot, "trunk", 0, 1, 0, {
      scale: [0.34, 1.04, 0.34],
    });
    addVoxel(runtime, stage.treePivot, "trunk", 0, 2.02, 0, {
      scale: [0.28, 0.86, 0.28],
    });
    addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 2.84, 0, 1, [0.66, 0.68, 0.66]);
    addVoxel(runtime, stage.treePivot, "blossom", 0.1, 3.08, 0.08, {
      scale: [0.22, 0.22, 0.22],
      castShadow: false,
    });
    return stage;
  }

  if (runtime.themeDefinition.treeKind === "spruce") {
    const stage = createStageShell();
    addTreeRoots(runtime, stage.treePivot, 0.9, 0.24);
    addVoxel(runtime, stage.treePivot, "trunk", 0, 1, 0, {
      scale: [0.42, 1, 0.42],
    });
    addVoxel(runtime, stage.treePivot, "trunk", 0, 2, 0, {
      scale: [0.34, 0.82, 0.34],
    });
    addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 2.58, 0, 1, [0.74, 0.68, 0.74]);
    addVoxel(runtime, stage.treePivot, "leaf", 0, 3.32, 0, {
      scale: [0.4, 0.66, 0.4],
      castShadow: true,
    });
    return stage;
  }

  if (runtime.themeDefinition.treeKind === "acacia") {
    const stage = createStageShell();
    addTreeRoots(runtime, stage.treePivot, 1.02, 0.28);
    addVoxel(runtime, stage.treePivot, "trunk", 0, 1, 0, {
      scale: [0.5, 0.96, 0.5],
    });
    addHorizontalLog(runtime, stage.treePivot, "x", 0.3, 1.92, 0.08, 0.86, 0.34);
    addVoxel(runtime, stage.treePivot, "trunk", 0.58, 2.6, 0.08, {
      scale: [0.34, 0.72, 0.34],
    });
    addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0.58, 3.04, 0.08, 1, [0.78, 0.62, 0.78]);
    return stage;
  }

  if (runtime.themeDefinition.treeKind === "redwood") {
    const stage = createStageShell();
    addTreeRoots(runtime, stage.treePivot, 1.18, 0.34);
    addVoxel(runtime, stage.treePivot, "trunk", 0, 1, 0, {
      scale: [0.58, 1.1, 0.58],
    });
    addVoxel(runtime, stage.treePivot, "trunk", 0, 2.08, 0, {
      scale: [0.48, 0.96, 0.48],
    });
    addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 2.76, 0, 1, [0.72, 0.64, 0.72]);
    addVoxel(runtime, stage.treePivot, "leaf", 0, 3.5, 0, {
      scale: [0.42, 0.7, 0.42],
      castShadow: true,
    });
    return stage;
  }

  if (runtime.themeDefinition.treeKind === "sakura") {
    const stage = createStageShell();
    addTreeRoots(runtime, stage.treePivot, 0.92, 0.24);
    addVoxel(runtime, stage.treePivot, "trunk", 0, 1, 0, {
      scale: [0.5, 0.92, 0.5],
    });
    addVoxel(runtime, stage.treePivot, "trunk", 0, 1.94, 0, {
      scale: [0.42, 0.72, 0.42],
    });
    [
      [0, 2.52, 0],
      [-0.46, 2.24, 0],
      [0.46, 2.24, 0],
      [0, 2.24, -0.46],
      [0, 2.24, 0.46],
    ].forEach((cell) => {
      addVoxel(runtime, stage.treePivot, "blossom", cell[0], cell[1], cell[2], {
        scale: [0.7, 0.7, 0.7],
        castShadow: true,
      });
    });
    addVoxel(runtime, stage.treePivot, "leaf", 0, 2.18, 0, {
      scale: [0.42, 0.42, 0.42],
      castShadow: false,
    });
    return stage;
  }

  return buildOakSaplingStage(runtime);
}

function buildBloomStage(runtime) {
  if (runtime.themeDefinition.treeKind === "birch") return buildBirchBloomStage(runtime);
  if (runtime.themeDefinition.treeKind === "spruce") return buildSpruceBloomStage(runtime);
  if (runtime.themeDefinition.treeKind === "sakura") return buildSakuraBloomStage(runtime);
  if (runtime.themeDefinition.treeKind === "acacia") return buildAcaciaBloomStage(runtime);
  if (runtime.themeDefinition.treeKind === "redwood") return buildRedwoodBloomStage(runtime);
  return buildOakBloomStage(runtime);
}

function buildFruitStage(runtime) {
  if (runtime.themeDefinition.treeKind === "birch") return buildBirchFruitStage(runtime);
  if (runtime.themeDefinition.treeKind === "spruce") return buildSpruceFruitStage(runtime);
  if (runtime.themeDefinition.treeKind === "sakura") return buildSakuraFruitStage(runtime);
  if (runtime.themeDefinition.treeKind === "acacia") return buildAcaciaFruitStage(runtime);
  if (runtime.themeDefinition.treeKind === "redwood") return buildRedwoodFruitStage(runtime);
  return buildOakFruitStage(runtime);
}

function buildStageForStatus(runtime, status) {
  if (status === "种植") return buildSaplingStage(runtime);
  if (status === "开花") return buildBloomStage(runtime);
  if (status === "结果") return buildFruitStage(runtime);
  if (status === "收获") return buildHarvestStage(runtime);
  return buildEmptyStage(runtime);
}

export default {
  props: {
    state: {
      type: Object,
      default() {
        return {};
      },
    },
    sceneTheme: {
      type: String,
      default: DEFAULT_TREE_PLANT_SCENE_THEME,
    },
    nightMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      runtime: null,
      initFailed: false,
      hasInteracted: false,
      nightStars: NIGHT_STAR_POSITIONS,
    };
  },
  computed: {
    sceneStatus() {
      return this.state && this.state.tree_status
        ? this.state.tree_status
        : "未种植";
    },
    themeDefinition() {
      return getSceneThemeDefinition(this.sceneTheme, this.nightMode);
    },
    sceneThemeStyle() {
      return getSceneThemeStyle(this.sceneTheme, this.nightMode);
    },
  },
  watch: {
    sceneStatus() {
      this.rebuildStage();
    },
    sceneTheme() {
      this.refreshScene();
    },
    nightMode() {
      this.refreshScene();
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initScene();
    });
  },
  beforeDestroy() {
    this.destroyScene();
  },
  beforeUnmount() {
    this.destroyScene();
  },
  methods: {
    getHostElement() {
      const host = this.$refs.sceneHost;
      if (!host) return null;
      return host.$el || host;
    },
    refreshScene() {
      if (!this.$refs.sceneHost) return;
      this.hasInteracted = false;
      this.initFailed = false;
      this.destroyScene();
      this.$nextTick(() => {
        this.initScene();
      });
    },
    initScene() {
      if (typeof window === "undefined" || typeof document === "undefined")
        return;

      const host = this.getHostElement();
      if (!host) return;

      if (!window.WebGLRenderingContext && !window.WebGL2RenderingContext) {
        this.handleSceneUnavailable("missing_webgl_rendering_context");
        return;
      }

      let gl = null;
      try {
        const probe = document.createElement("canvas");
        gl =
          probe.getContext("webgl2") ||
          probe.getContext("webgl") ||
          probe.getContext("experimental-webgl");
      } catch (e) {
        gl = null;
      }

      if (!gl) {
        this.handleSceneUnavailable("failed_to_create_webgl_context");
        return;
      }

      const releaseProbe = gl.getExtension && gl.getExtension("WEBGL_lose_context");
      if (releaseProbe) releaseProbe.loseContext();

      const hostRect = host.getBoundingClientRect();
      const initialAspect =
        hostRect.height > 0 ? hostRect.width / hostRect.height : 1;
      const themeDefinition = this.themeDefinition;
      const initialFraming = getCameraFraming(
        initialAspect,
        themeDefinition.key,
        this.nightMode
      );
      const runtime = createRuntime(initialFraming);
      runtime.host = host;
      runtime.themeKey = themeDefinition.key;
      runtime.themeDefinition = themeDefinition;
      runtime.isNight = this.nightMode;

      let renderer = null;
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        });
      } catch (error) {
        this.handleSceneUnavailable("failed_to_initialize_renderer");
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.shadowMap.autoUpdate = false;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = themeDefinition.lights.toneExposure || 1.05;
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";

      host.innerHTML = "";
      host.appendChild(renderer.domElement);
      runtime.contextLostHandler = (event) => {
        event.preventDefault();
        if (this.runtime === runtime) {
          this.handleSceneUnavailable("webgl_context_lost");
        }
      };
      renderer.domElement.addEventListener(
        "webglcontextlost",
        runtime.contextLostHandler,
        false
      );

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(
        themeDefinition.fog.color,
        themeDefinition.fog.near,
        themeDefinition.fog.far
      );

      const camera = new THREE.PerspectiveCamera(initialFraming.fov, 1, 0.1, 60);
      camera.position
        .setFromSpherical(
          new THREE.Spherical(
            runtime.radius,
            runtime.currentPhi,
            runtime.cameraTheta
          )
        )
        .add(runtime.cameraTarget);
      camera.lookAt(runtime.cameraTarget);

      const ambient = new THREE.HemisphereLight(
        themeDefinition.lights.hemisphereSky,
        themeDefinition.lights.hemisphereGround,
        themeDefinition.lights.hemisphereIntensity
      );
      const fill = new THREE.AmbientLight(
        themeDefinition.lights.ambientColor,
        themeDefinition.lights.ambientIntensity
      );
      const sun = new THREE.DirectionalLight(
        themeDefinition.lights.sunColor,
        themeDefinition.lights.sunIntensity
      );
      sun.position.set(
        themeDefinition.lights.sunPosition[0],
        themeDefinition.lights.sunPosition[1],
        themeDefinition.lights.sunPosition[2]
      );
      sun.castShadow = true;
      sun.shadow.mapSize.width = 1024;
      sun.shadow.mapSize.height = 1024;
      sun.shadow.camera.left = -14;
      sun.shadow.camera.right = 14;
      sun.shadow.camera.top = 14;
      sun.shadow.camera.bottom = -14;
      sun.shadow.camera.near = 1;
      sun.shadow.camera.far = 40;

      const rim = new THREE.DirectionalLight(
        themeDefinition.lights.rimColor,
        themeDefinition.lights.rimIntensity
      );
      rim.position.set(
        themeDefinition.lights.rimPosition[0],
        themeDefinition.lights.rimPosition[1],
        themeDefinition.lights.rimPosition[2]
      );

      scene.add(ambient, fill, sun, rim);

      const world = new THREE.Group();
      scene.add(world);

      runtime.renderer = renderer;
      runtime.scene = scene;
      runtime.camera = camera;
      runtime.world = world;
      runtime.materials = createMaterialLibrary(runtime.resources, themeDefinition);
      runtime.geometries = createGeometryLibrary(runtime.resources);

      buildTerrain(runtime);
      this.runtime = runtime;

      this.attachInteraction(runtime);
      this.updateRendererSize();
      this.rebuildStage();

      if (window.ResizeObserver) {
        runtime.resizeObserver = new window.ResizeObserver(() => {
          this.updateRendererSize();
        });
        runtime.resizeObserver.observe(host);
      } else {
        window.addEventListener("resize", this.updateRendererSize);
      }

      this.animate(0);
    },
    attachInteraction(runtime) {
      const host = runtime.host;
      if (!host) return;

      host.onpointerdown = (event) => {
        runtime.isDragging = true;
        runtime.dragStartX = event.clientX;
        runtime.dragStartY = event.clientY;
        host.setPointerCapture && host.setPointerCapture(event.pointerId);
        this.hasInteracted = true;
      };

      host.onpointermove = (event) => {
        if (!runtime.isDragging) return;

        const deltaX = event.clientX - runtime.dragStartX;
        const deltaY = event.clientY - runtime.dragStartY;

        runtime.targetWorldRotationY =
          runtime.baseWorldRotationY + deltaX * 0.012;
        runtime.targetPhi = clamp(runtime.basePhi + deltaY * 0.006, 0.82, 1.24);
      };

      const releasePointer = (event) => {
        if (!runtime.isDragging) return;

        runtime.isDragging = false;
        runtime.baseWorldRotationY = runtime.targetWorldRotationY;
        runtime.basePhi = runtime.targetPhi;
        host.releasePointerCapture &&
          host.releasePointerCapture(event.pointerId);
      };

      host.onpointerup = releasePointer;
      host.onpointerleave = releasePointer;
      host.onpointercancel = releasePointer;
    },
    rebuildStage() {
      const runtime = this.runtime;
      if (!runtime || !runtime.world) return;

      if (runtime.stage && runtime.stage.root) {
        runtime.world.remove(runtime.stage.root);
      }

      runtime.stage = buildStageForStatus(runtime, this.sceneStatus);
      runtime.world.add(runtime.stage.root);
      runtime.renderer.shadowMap.needsUpdate = true;
    },
    updateRendererSize() {
      const runtime = this.runtime;
      if (!runtime || !runtime.host || !runtime.renderer || !runtime.camera)
        return;

      const rect = runtime.host.getBoundingClientRect();
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);
      const framing = getCameraFraming(
        width / height,
        runtime.themeKey || this.themeDefinition.key,
        runtime.isNight
      );

      runtime.radius = framing.radius;
      runtime.cameraTarget.y = framing.targetY || 2.6;
      runtime.camera.fov = framing.fov;

      if (!this.hasInteracted) {
        runtime.basePhi = framing.phi;
        runtime.targetPhi = framing.phi;
        runtime.currentPhi = framing.phi;
      }

      runtime.camera.aspect = width / height;
      runtime.camera.updateProjectionMatrix();
      runtime.renderer.setSize(width, height, false);
      runtime.renderer.shadowMap.needsUpdate = true;
    },
    animate(timestamp) {
      const runtime = this.runtime;
      if (!runtime || !runtime.renderer || !runtime.scene || !runtime.camera)
        return;

      runtime.lastTimestamp = timestamp;

      const previousWorldRotationY = runtime.currentWorldRotationY;
      runtime.currentWorldRotationY = lerp(
        runtime.currentWorldRotationY,
        runtime.targetWorldRotationY,
        0.08
      );
      runtime.currentPhi = lerp(runtime.currentPhi, runtime.targetPhi, 0.08);

      if (runtime.world) {
        runtime.world.rotation.y = runtime.currentWorldRotationY;
        if (
          Math.abs(runtime.currentWorldRotationY - previousWorldRotationY) >
          0.00001
        ) {
          runtime.renderer.shadowMap.needsUpdate = true;
        }
      }

      const offset = new THREE.Spherical(
        runtime.radius,
        runtime.currentPhi,
        runtime.cameraTheta
      );
      runtime.camera.position.setFromSpherical(offset).add(runtime.cameraTarget);
      runtime.camera.lookAt(runtime.cameraTarget);

      runtime.clouds.forEach((cloud) => {
        cloud.group.position.x =
          cloud.baseX +
          Math.sin(timestamp * 0.00018 * cloud.speed + cloud.phase) *
            cloud.amplitude;
        cloud.group.position.z =
          cloud.baseZ +
          Math.cos(timestamp * 0.00014 * cloud.speed + cloud.phase) *
            cloud.amplitude *
            0.55;
      });

      if (runtime.stage && Array.isArray(runtime.stage.floatingLights)) {
        animateParticleSet(runtime.stage.floatingLights, timestamp);
      }
      animateParticleSet(runtime.ambientLights, timestamp, 7);

      runtime.renderer.render(runtime.scene, runtime.camera);
      runtime.animationFrame = requestAnimationFrame((nextTimestamp) =>
        this.animate(nextTimestamp)
      );
    },
    handleSceneUnavailable(reason) {
      this.initFailed = true;
      try {
        console.info(
          "[TREE3D_RUNTIME]" +
            JSON.stringify({
              reason: reason || "scene_unavailable",
              href:
                typeof window !== "undefined" && window.location
                  ? window.location.href
                  : "",
            })
        );
      } catch (error) {}
      this.$emit("scene-unavailable", reason || "scene_unavailable");
    },
    destroyScene() {
      if (!this.runtime) return;

      if (!window.ResizeObserver) {
        window.removeEventListener("resize", this.updateRendererSize);
      }

      disposeRuntime(this.runtime);
      this.runtime = null;
    },
  },
};
</script>

<style scoped lang="scss">
.oak-tree-3d {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: radial-gradient(
      circle at 50% 12%,
      var(--scene-halo-core) 0%,
      var(--scene-halo-mid) 42%,
      rgba(255, 255, 255, 0) 72%
    ),
    linear-gradient(
      180deg,
      var(--scene-sky-top) 0%,
      var(--scene-sky-mid) 32%,
      var(--scene-sky-low) 72%,
      var(--scene-sky-bottom) 100%
    );
  transition: background 0.45s ease;
}

.scene-backdrop {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.sun-halo {
  position: absolute;
  z-index: 2;
  top: 6%;
  right: 10%;
  width: 280rpx;
  height: 280rpx;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    var(--scene-halo-core) 0%,
    var(--scene-halo-mid) 42%,
    rgba(255, 255, 255, 0) 72%
  );
}

.sun-halo::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 92rpx;
  height: 92rpx;
  transform: translate(-50%, -50%);
  border-radius: 4rpx;
  background: var(--scene-halo-core);
  box-shadow:
    -10rpx 0 0 var(--scene-halo-mid),
    10rpx 0 0 var(--scene-halo-mid),
    0 -10rpx 0 var(--scene-halo-mid),
    0 10rpx 0 var(--scene-halo-mid);
}

.is-night .sun-halo {
  top: 7%;
  right: 11%;
}

.is-night .sun-halo::after {
  content: "";
  position: absolute;
  left: calc(50% - 24rpx);
  top: calc(50% - 18rpx);
  width: 14rpx;
  height: 14rpx;
  background: var(--scene-moon-shade);
  box-shadow:
    34rpx 10rpx 0 var(--scene-moon-shade),
    20rpx 40rpx 0 var(--scene-moon-shade),
    54rpx 48rpx 0 var(--scene-moon-shade);
}

.pixel-stars {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.pixel-star {
  position: absolute;
  width: 4rpx;
  height: 4rpx;
  background: var(--scene-star-color);
  box-shadow: 0 0 8rpx var(--scene-star-color);
  animation: pixel-star-twinkle 3.2s steps(2, end) infinite;
}

.pixel-star.star-size-2 {
  width: 7rpx;
  height: 7rpx;
}

.pixel-star:nth-child(3n + 1) {
  animation-delay: -0.9s;
}

.pixel-star:nth-child(3n + 2) {
  animation-delay: -1.8s;
}

.mist {
  position: absolute;
  border-radius: 999rpx;
  filter: blur(18rpx);
}

.mist-a {
  left: 8%;
  top: 18%;
  width: 280rpx;
  height: 70rpx;
  background: var(--scene-mist-a);
}

.mist-b {
  right: 12%;
  top: 28%;
  width: 220rpx;
  height: 60rpx;
  background: var(--scene-mist-b);
}

.scene-host {
  position: absolute;
  inset: 0;
  touch-action: none;
}

.gesture-hint {
  position: absolute;
  left: 50%;
  bottom: 210rpx;
  transform: translateX(-50%);
  pointer-events: none;
  padding: 16rpx 24rpx;
  border-radius: 999rpx;
  background: rgba(33, 26, 19, 0.55);
  color: #fff6e8;
  font-size: 22rpx;
  font-weight: 800;
  letter-spacing: 1rpx;
  box-shadow: 0 16rpx 32rpx rgba(18, 13, 9, 0.16);
  animation: hint-fade 2.8s ease-in-out infinite;
}

.scene-error {
  position: absolute;
  left: 50%;
  bottom: 190rpx;
  transform: translateX(-50%);
  max-width: 560rpx;
  padding: 16rpx 22rpx;
  border-radius: 22rpx;
  background: rgba(47, 34, 25, 0.72);
  color: #fff8ef;
  font-size: 22rpx;
  text-align: center;
  line-height: 1.5;
}

@keyframes hint-fade {
  0%,
  100% {
    opacity: 0.55;
    transform: translateX(-50%) translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) translateY(-6rpx);
  }
}

@keyframes pixel-star-twinkle {
  0%,
  100% {
    filter: brightness(0.72);
    transform: scale(0.85);
  }
  50% {
    filter: brightness(1.28);
    transform: scale(1.15);
  }
}
</style>
