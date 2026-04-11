<template>
  <view class="oak-tree-3d" :style="sceneThemeStyle">
    <view class="scene-backdrop">
      <view class="sun-halo"></view>
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

const CAMERA_TARGET = new THREE.Vector3(0, 2.6, 0);
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
  });

  const blossom = createPixelTexture(resources, "blossom", (ctx, size) => {
    fillGrid(ctx, size, palette.blossom);
    ctx.fillStyle = palette.blossomAccent;
    ctx.fillRect(8, 8, 4, 4);
    ctx.fillRect(20, 16, 4, 4);
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
    emissive: options.emissive || "#000000",
    emissiveIntensity: options.emissiveIntensity || 0,
  });

  resources.materials.push(material);

  return material;
}

function createBoxMaterialSet(resources, options) {
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
  });
  const topMaterial = new THREE.MeshStandardMaterial({
    ...common,
    map: options.top || options.side,
    transparent: !!options.transparent,
    alphaTest: options.alphaTest || 0,
    emissive: options.topEmissive || options.sideEmissive || "#000000",
    emissiveIntensity: options.emissiveIntensity || 0,
  });
  const bottomMaterial = new THREE.MeshStandardMaterial({
    ...common,
    map: options.bottom || options.side,
    transparent: !!options.transparent,
    alphaTest: options.alphaTest || 0,
  });

  resources.materials.push(sideMaterial, topMaterial, bottomMaterial);

  return [
    sideMaterial,
    sideMaterial,
    topMaterial,
    bottomMaterial,
    sideMaterial,
    sideMaterial,
  ];
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
    leaf: createVoxelMaterial(resources, {
      map: textures.leaf,
      emissive: "#16351d",
      emissiveIntensity: 0.12,
    }),
    blossom: createVoxelMaterial(resources, {
      map: textures.blossom,
      emissive: "#5d1c38",
      emissiveIntensity: 0.08,
    }),
    apple: createVoxelMaterial(resources, {
      map: textures.apple,
      emissive: "#51140f",
      emissiveIntensity: 0.1,
    }),
    plank: createVoxelMaterial(resources, {
      map: textures.plank,
    }),
    cloud: cloudMaterial,
    glow: glowMaterial,
    pinkGlow: pinkGlowMaterial,
  };
}

function createGeometryLibrary(resources) {
  const unit = new THREE.BoxGeometry(1, 1, 1);
  const smallOrb = new THREE.SphereGeometry(0.16, 8, 8);

  resources.geometries.push(unit, smallOrb);

  return {
    unit,
    smallOrb,
  };
}

function createRuntime(framing = getCameraFraming(1)) {
  return {
    renderer: null,
    scene: null,
    camera: null,
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
    stage: null,
    animationFrame: 0,
    resizeObserver: null,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    baseTheta: 0,
    basePhi: framing.phi,
    targetTheta: 0,
    targetPhi: framing.phi,
    currentTheta: 0,
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
    runtime.renderer.dispose();
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
    runtime.geometries.smallOrb,
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

function addFlowerPatch(runtime, group, x, z, colorKey = "blossom") {
  addVoxel(runtime, group, "leaf", x, 1, z, {
    scale: [0.2, 0.28, 0.2],
    castShadow: false,
  });
  addVoxel(runtime, group, colorKey, x, 1.32, z, {
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

function getSurfaceMaterialKey(x, z) {
  const key = `${x}:${z}`;
  if (Math.abs(x) <= 1 && Math.abs(z) <= 1) return "soil";
  if (PATH_CELLS.has(key)) return "path";
  return "grass";
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

      for (let iy = 1; iy <= height; iy += 1) {
        addVoxel(runtime, runtime.world, "stone", offsetX, y - iy, offsetZ, {
          castShadow: false,
        });
      }
    }
  }
}

function addLanternPost(runtime, group, x, z, glowMaterialKey = "glow") {
  addVoxel(runtime, group, "plank", x, 1, z, {
    scale: [0.5, 1.6, 0.5],
  });
  addVoxel(runtime, group, glowMaterialKey, x, 2.25, z, {
    scale: [0.42, 0.42, 0.42],
    castShadow: false,
    receiveShadow: false,
  });
}

function addGrassTuft(runtime, group, x, z, materialKey = "leaf") {
  [
    [x - 0.14, 1.02, z, [0.18, 0.72, 0.18]],
    [x + 0.14, 1.08, z + 0.08, [0.18, 0.58, 0.18]],
    [x + 0.02, 1.12, z - 0.16, [0.18, 0.86, 0.18]],
  ].forEach((item) => {
    addVoxel(runtime, group, materialKey, item[0], item[1], item[2], {
      scale: item[3],
      castShadow: false,
    });
  });
}

function addMiniBirch(runtime, group, x, z) {
  addVoxel(runtime, group, "trunk", x, 1, z, {
    scale: [0.24, 1.26, 0.24],
    castShadow: false,
  });
  addVoxel(runtime, group, "leaf", x, 1.92, z, {
    scale: [0.58, 0.24, 0.58],
    castShadow: false,
  });
  addVoxel(runtime, group, "blossom", x, 2.14, z, {
    scale: [0.28, 0.18, 0.28],
    castShadow: false,
  });
}

function addCrystalCluster(runtime, group, x, z) {
  [
    [x, 1, z, [0.32, 1.46, 0.32]],
    [x + 0.28, 0.96, z - 0.2, [0.22, 1.02, 0.22]],
    [x - 0.24, 0.94, z + 0.16, [0.2, 0.88, 0.2]],
  ].forEach((item) => {
    addVoxel(runtime, group, "stone", item[0], item[1], item[2], {
      scale: item[3],
      castShadow: false,
    });
  });
  addVoxel(runtime, group, "pinkGlow", x, 1.88, z, {
    scale: [0.16, 0.16, 0.16],
    castShadow: false,
    receiveShadow: false,
  });
}

function addSwampStump(runtime, group, x, z) {
  addVoxel(runtime, group, "trunk", x, 1, z, {
    scale: [0.82, 0.92, 0.82],
  });
  addVoxel(runtime, group, "trunk", x + 0.56, 1, z, {
    scale: [0.48, 0.44, 1.02],
  });
  addVoxel(runtime, group, "pinkGlow", x, 1.62, z, {
    scale: [0.2, 0.2, 0.2],
    castShadow: false,
    receiveShadow: false,
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
      addVoxel(runtime, terrain, "trunk", item[0], 1, item[1], {
        scale: [0.24, 1.16, 0.24],
        castShadow: false,
      });
      addVoxel(runtime, terrain, "leaf", item[0], 1.92, item[1], {
        scale: [0.56, 0.24, 0.56],
        castShadow: false,
      });
      addVoxel(runtime, terrain, "blossom", item[0], 2.16, item[1], {
        scale: [0.28, 0.18, 0.28],
        castShadow: false,
      });
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
      addVoxel(runtime, terrain, "stone", item[0], 1, item[1], {
        scale: item[2],
        castShadow: false,
      });
      addVoxel(runtime, terrain, "pinkGlow", item[0], 1.9, item[1], {
        scale: [0.16, 0.16, 0.16],
        castShadow: false,
        receiveShadow: false,
      });
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
      addVoxel(runtime, terrain, "stone", item[0], 1, item[1], {
        scale: item[2],
        castShadow: false,
      });
    });
    addGrassTuft(runtime, terrain, -0.45, 0.88);
    addGrassTuft(runtime, terrain, 0.4, 0.62);
    addVoxel(runtime, terrain, "stone", 1.15, 1, -0.35, {
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
      addVoxel(runtime, terrain, "trunk", item[0], 1, item[1], {
        scale: [0.46, 1.24, 0.46],
      });
      addVoxel(runtime, terrain, "pinkGlow", item[0], 2.04, item[1], {
        scale: [0.18, 0.18, 0.18],
        castShadow: false,
        receiveShadow: false,
      });
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
    addVoxel(runtime, terrain, "leaf", item[0], 1, item[1], {
      scale: [0.22, 0.75, 0.22],
      castShadow: false,
    });
    addVoxel(runtime, terrain, "leaf", item[0], 1.42, item[1], {
      scale: [0.46, 0.18, 0.46],
      castShadow: false,
    });
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

      addVoxel(runtime, terrain, getSurfaceMaterialKey(x, z), x, topY, z, {
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
    [-1.1, 0, 4.3, [1.15, 0.26, 1.1]],
    [0, 0, 4.9, [1.25, 0.26, 1.25]],
    [1.1, 0, 4.3, [1.15, 0.26, 1.1]],
  ].forEach((item) => {
    addVoxel(runtime, terrain, "plank", item[0], item[1], item[2], {
      scale: item[3],
      castShadow: false,
    });
  });
  buildThemeTerrainDecorations(runtime, terrain);

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
  scale = [0.9, 0.42, 0.9]
) {
  for (let x = -radius; x <= radius; x += 1) {
    for (let z = -radius; z <= radius; z += 1) {
      if (Math.sqrt(x * x + z * z) > radius + 0.2) continue;
      addVoxel(runtime, group, materialKey, centerX + x, centerY, centerZ + z, {
        scale,
        castShadow: false,
      });
    }
  }
}

function buildBirchBloomStage(runtime) {
  const stage = createStageShell();
  for (let y = 1; y <= 5; y += 1) {
    addVoxel(runtime, stage.treePivot, "trunk", 0, y, 0, { scale: [0.68, 1, 0.68] });
  }
  addVoxel(runtime, stage.treePivot, "trunk", 0.7, 3.8, 0.12, { scale: [0.32, 0.32, 1.04] });
  addVoxel(runtime, stage.treePivot, "trunk", -0.62, 4.18, -0.08, { scale: [0.28, 0.28, 0.96] });
  addOakLeaves(runtime, stage.treePivot, getBirchLeafCells(), "leaf", { castShadow: false });
  [[-1.1, 4.92, -0.86], [1.12, 5.08, -0.78], [-1.04, 5.12, 0.94], [1.04, 5.16, 0.98], [0, 6.16, -0.9]].forEach((cell) => {
    addVoxel(runtime, stage.treePivot, "blossom", cell[0], cell[1], cell[2], { scale: [0.32, 0.32, 0.32], castShadow: false });
  });
  [{ origin: new THREE.Vector3(-0.9, 5.08, 0.4), radius: 0.7, speed: 0.94, lift: 0.18, phase: 0.2 }, { origin: new THREE.Vector3(0.92, 5.72, -0.22), radius: 0.78, speed: 0.82, lift: 0.22, phase: 1.6 }].forEach((config) => {
    addParticle(runtime, stage.floatingLights, stage.root, "pinkGlow", config);
  });
  return stage;
}

function buildBirchFruitStage(runtime) {
  const stage = createStageShell();
  for (let y = 1; y <= 5; y += 1) {
    addVoxel(runtime, stage.treePivot, "trunk", 0, y, 0, { scale: [0.68, 1, 0.68] });
  }
  addOakLeaves(runtime, stage.treePivot, getBirchLeafCells(), "leaf", { castShadow: false });
  [[-1.02, 4.52, 0.84], [1.02, 4.48, 0.92], [-0.92, 5.08, -0.08], [0.94, 5.1, -0.12], [0.06, 5.28, 0.96], [0.04, 6.04, -0.88]].forEach((cell) => {
    addVoxel(runtime, stage.treePivot, "apple", cell[0], cell[1], cell[2], { scale: [0.34, 0.34, 0.34], castShadow: false });
  });
  [{ origin: new THREE.Vector3(-0.8, 5.1, -0.8), radius: 0.82, speed: 0.84, lift: 0.2, phase: 0.2 }, { origin: new THREE.Vector3(0.94, 5.62, 0.4), radius: 0.92, speed: 0.74, lift: 0.22, phase: 1.7 }].forEach((config) => {
    addParticle(runtime, stage.floatingLights, stage.root, "glow", config);
  });
  return stage;
}

function buildSpruceBloomStage(runtime) {
  const stage = createStageShell();
  for (let y = 1; y <= 6; y += 1) {
    addVoxel(runtime, stage.treePivot, "trunk", 0, y, 0, { scale: [0.68, 1, 0.68] });
  }
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 3, 0, 2, [0.92, 0.38, 0.92]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 4, 0, 2, [0.88, 0.38, 0.88]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 5, 0, 1, [0.8, 0.38, 0.8]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 6, 0, 1, [0.7, 0.34, 0.7]);
  addVoxel(runtime, stage.treePivot, "leaf", 0, 7, 0, { scale: [0.48, 0.72, 0.48], castShadow: false });
  [[-1.04, 3.4, 0.78], [1.08, 4.06, -0.7], [0.88, 5.08, 0.1], [0.04, 6.16, 0.84]].forEach((cell) => {
    addVoxel(runtime, stage.treePivot, "blossom", cell[0], cell[1], cell[2], { scale: [0.26, 0.26, 0.26], castShadow: false });
  });
  [{ origin: new THREE.Vector3(-0.84, 4.12, 0.7), radius: 0.62, speed: 0.92, lift: 0.16, phase: 0.3 }, { origin: new THREE.Vector3(0.84, 5.18, -0.2), radius: 0.66, speed: 0.82, lift: 0.18, phase: 1.8 }].forEach((config) => {
    addParticle(runtime, stage.floatingLights, stage.root, "pinkGlow", config);
  });
  return stage;
}

function buildSpruceFruitStage(runtime) {
  const stage = createStageShell();
  for (let y = 1; y <= 6; y += 1) {
    addVoxel(runtime, stage.treePivot, "trunk", 0, y, 0, { scale: [0.7, 1, 0.7] });
  }
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 3, 0, 2, [0.92, 0.38, 0.92]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 4, 0, 2, [0.88, 0.38, 0.88]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 5, 0, 1, [0.8, 0.38, 0.8]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 6, 0, 1, [0.7, 0.34, 0.7]);
  addVoxel(runtime, stage.treePivot, "leaf", 0, 7, 0, { scale: [0.48, 0.72, 0.48], castShadow: false });
  [[-1.02, 3.08, 0.86], [1.04, 3.4, 0.7], [-0.88, 4.08, -0.68], [0.94, 4.22, -0.62], [0.06, 5.16, 0.08], [0.04, 6.04, -0.72]].forEach((cell) => {
    addVoxel(runtime, stage.treePivot, "apple", cell[0], cell[1], cell[2], { scale: [0.3, 0.38, 0.3], castShadow: false });
  });
  [{ origin: new THREE.Vector3(-0.88, 4.08, -0.62), radius: 0.58, speed: 0.82, lift: 0.16, phase: 0.3 }, { origin: new THREE.Vector3(0.92, 4.88, 0.16), radius: 0.64, speed: 0.76, lift: 0.18, phase: 1.8 }].forEach((config) => {
    addParticle(runtime, stage.floatingLights, stage.root, "glow", config);
  });
  return stage;
}

function buildSakuraBloomStage(runtime) {
  const stage = buildOakBloomStage(runtime);
  addOakLeaves(runtime, stage.treePivot, getBloomOakLeafCells(), "blossom", { castShadow: false });
  return stage;
}

function buildSakuraFruitStage(runtime) {
  const stage = buildOakFruitStage(runtime);
  addOakLeaves(runtime, stage.treePivot, getFruitOakLeafCells(), "blossom", { castShadow: false });
  return stage;
}

function buildAcaciaBloomStage(runtime) {
  const stage = createStageShell();
  for (let y = 1; y <= 3; y += 1) {
    addVoxel(runtime, stage.treePivot, "trunk", 0, y, 0, { scale: [0.76, 1, 0.76] });
  }
  addVoxel(runtime, stage.treePivot, "trunk", 0.58, 4, 0.12, { scale: [0.64, 0.92, 0.64] });
  addVoxel(runtime, stage.treePivot, "trunk", 1.08, 4.9, 0.22, { scale: [0.54, 0.82, 0.54] });
  addVoxel(runtime, stage.treePivot, "trunk", -0.82, 3.72, -0.42, { scale: [0.5, 0.72, 0.5] });
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 1.1, 5.2, 0.2, 2, [0.96, 0.24, 0.96]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0.12, 5.78, 0.18, 2, [0.92, 0.22, 0.92]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", -1.02, 4.8, -0.82, 1, [0.86, 0.22, 0.86]);
  [[1.54, 5.68, 0.18], [0.62, 5.86, -1.02], [1.12, 5.84, 1.1], [-1.14, 5.08, -0.72]].forEach((cell) => {
    addVoxel(runtime, stage.treePivot, "blossom", cell[0], cell[1], cell[2], { scale: [0.32, 0.32, 0.32], castShadow: false });
  });
  [{ origin: new THREE.Vector3(1.18, 5.62, 0.32), radius: 0.78, speed: 0.82, lift: 0.16, phase: 0.4 }, { origin: new THREE.Vector3(0.1, 5.9, -0.8), radius: 0.72, speed: 0.92, lift: 0.16, phase: 1.8 }].forEach((config) => {
    addParticle(runtime, stage.floatingLights, stage.root, "pinkGlow", config);
  });
  return stage;
}

function buildAcaciaFruitStage(runtime) {
  const stage = createStageShell();
  for (let y = 1; y <= 3; y += 1) {
    addVoxel(runtime, stage.treePivot, "trunk", 0, y, 0, { scale: [0.78, 1, 0.78] });
  }
  addVoxel(runtime, stage.treePivot, "trunk", 0.62, 4, 0.12, { scale: [0.66, 0.94, 0.66] });
  addVoxel(runtime, stage.treePivot, "trunk", 1.16, 4.92, 0.22, { scale: [0.58, 0.84, 0.58] });
  addVoxel(runtime, stage.treePivot, "trunk", -0.86, 3.76, -0.42, { scale: [0.52, 0.74, 0.52] });
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 1.12, 5.2, 0.22, 2, [0.98, 0.24, 0.98]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0.12, 5.78, 0.18, 2, [0.94, 0.22, 0.94]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", -1.02, 4.8, -0.82, 1, [0.86, 0.22, 0.86]);
  [[1.56, 4.88, 0.22], [0.84, 4.96, -0.96], [1.18, 4.98, 1.02], [0.08, 5.24, -1.12], [-1.08, 4.46, -0.68]].forEach((cell) => {
    addVoxel(runtime, stage.treePivot, "apple", cell[0], cell[1], cell[2], { scale: [0.28, 0.4, 0.28], castShadow: false });
  });
  [{ origin: new THREE.Vector3(1.18, 5.62, 0.32), radius: 0.82, speed: 0.78, lift: 0.18, phase: 0.3 }, { origin: new THREE.Vector3(0.02, 5.84, -0.9), radius: 0.7, speed: 0.88, lift: 0.14, phase: 1.8 }].forEach((config) => {
    addParticle(runtime, stage.floatingLights, stage.root, "glow", config);
  });
  return stage;
}

function buildRedwoodBloomStage(runtime) {
  const stage = createStageShell();
  for (let y = 1; y <= 7; y += 1) {
    addVoxel(runtime, stage.treePivot, "trunk", 0, y, 0, { scale: [1.02, 1, 1.02] });
  }
  [[0.72, 1, 0, [0.58, 0.52, 1.22]], [-0.72, 1, 0, [0.58, 0.52, 1.22]], [0, 1, 0.68, [1.22, 0.52, 0.58]], [0, 1, -0.68, [1.22, 0.52, 0.58]]].forEach((item) => {
    addVoxel(runtime, stage.treePivot, "trunk", item[0], item[1], item[2], { scale: item[3] });
  });
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 7, 0, 2, [0.84, 0.32, 0.84]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 8, 0, 1, [0.72, 0.28, 0.72]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0.62, 6.6, 0.18, 1, [0.68, 0.26, 0.68]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", -0.54, 6.2, -0.18, 1, [0.66, 0.26, 0.66]);
  addVoxel(runtime, stage.treePivot, "leaf", 0, 9, 0, { scale: [0.44, 0.56, 0.44], castShadow: false });
  [[0.9, 6.38, 0.72], [-0.86, 6.08, -0.62], [0.08, 7.28, -1.02], [0.08, 8.06, 0.76]].forEach((cell) => {
    addVoxel(runtime, stage.treePivot, "blossom", cell[0], cell[1], cell[2], { scale: [0.26, 0.26, 0.26], castShadow: false });
  });
  [{ origin: new THREE.Vector3(0.88, 6.62, 0.76), radius: 0.7, speed: 0.76, lift: 0.14, phase: 0.3 }, { origin: new THREE.Vector3(-0.68, 7.46, -0.16), radius: 0.64, speed: 0.88, lift: 0.12, phase: 1.7 }].forEach((config) => {
    addParticle(runtime, stage.floatingLights, stage.root, "pinkGlow", config);
  });
  return stage;
}

function buildRedwoodFruitStage(runtime) {
  const stage = createStageShell();
  for (let y = 1; y <= 7; y += 1) {
    addVoxel(runtime, stage.treePivot, "trunk", 0, y, 0, { scale: [1.04, 1, 1.04] });
  }
  [[0.72, 1, 0, [0.58, 0.52, 1.22]], [-0.72, 1, 0, [0.58, 0.52, 1.22]], [0, 1, 0.68, [1.22, 0.52, 0.58]], [0, 1, -0.68, [1.22, 0.52, 0.58]]].forEach((item) => {
    addVoxel(runtime, stage.treePivot, "trunk", item[0], item[1], item[2], { scale: item[3] });
  });
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 7, 0, 2, [0.86, 0.32, 0.86]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 8, 0, 1, [0.74, 0.28, 0.74]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0.62, 6.6, 0.18, 1, [0.7, 0.26, 0.7]);
  addRoundCanopyLayer(runtime, stage.treePivot, "leaf", -0.54, 6.2, -0.18, 1, [0.68, 0.26, 0.68]);
  addVoxel(runtime, stage.treePivot, "leaf", 0, 9, 0, { scale: [0.44, 0.56, 0.44], castShadow: false });
  [[0.96, 6.34, 0.6], [-0.92, 6.1, -0.66], [0.08, 7.18, -0.98], [0.08, 8.04, 0.8], [-0.48, 7.38, 0.82]].forEach((cell) => {
    addVoxel(runtime, stage.treePivot, "apple", cell[0], cell[1], cell[2], { scale: [0.22, 0.38, 0.22], castShadow: false });
  });
  [{ origin: new THREE.Vector3(0.9, 6.66, 0.7), radius: 0.68, speed: 0.74, lift: 0.12, phase: 0.2 }, { origin: new THREE.Vector3(-0.66, 7.4, -0.18), radius: 0.6, speed: 0.84, lift: 0.12, phase: 1.8 }].forEach((config) => {
    addParticle(runtime, stage.floatingLights, stage.root, "glow", config);
  });
  return stage;
}

function buildEmptyStage(runtime) {
  const root = new THREE.Group();
  const kind = runtime.themeDefinition.treeKind;

  if (kind === "birch") {
    addMiniBirch(runtime, root, -0.28, 0.18);
    addMiniBirch(runtime, root, 0.62, -0.26);
    addVoxel(runtime, root, "plank", 1.05, 2.05, -1.1, {
      scale: [1.45, 0.85, 0.22],
      castShadow: false,
    });
    addVoxel(runtime, root, "trunk", 1.05, 1, -1.1, {
      scale: [0.28, 1.3, 0.28],
    });
    addFlowerPatch(runtime, root, -0.72, 0.94, "blossom");
    addFlowerPatch(runtime, root, 0.22, 0.82, "blossom");
  } else if (kind === "spruce") {
    addCrystalCluster(runtime, root, -0.22, 0.1);
    addVoxel(runtime, root, "trunk", 0.62, 1, -0.12, {
      scale: [0.34, 1.24, 0.34],
    });
    addRoundCanopyLayer(runtime, root, "leaf", 0.62, 1.92, -0.12, 1, [0.62, 0.28, 0.62]);
    addVoxel(runtime, root, "leaf", 0.62, 2.6, -0.12, {
      scale: [0.34, 0.52, 0.34],
      castShadow: false,
    });
  } else if (kind === "sakura") {
    addVoxel(runtime, root, "plank", 0, 1, -0.1, {
      scale: [1.28, 0.22, 1.28],
      castShadow: false,
    });
    addFlowerPatch(runtime, root, -0.52, 0.72, "blossom");
    addFlowerPatch(runtime, root, 0.24, 0.66, "blossom");
    addMiniBirch(runtime, root, 0.78, -0.42);
  } else if (kind === "acacia") {
    addVoxel(runtime, root, "trunk", -0.2, 1, 0, {
      scale: [0.56, 1, 0.56],
    });
    addVoxel(runtime, root, "trunk", 0.3, 1.86, 0.12, {
      scale: [0.36, 0.74, 0.36],
    });
    addRoundCanopyLayer(runtime, root, "leaf", 0.56, 2.48, 0.12, 1, [0.74, 0.2, 0.74]);
    addGrassTuft(runtime, root, -0.82, 0.82);
  } else if (kind === "redwood") {
    addSwampStump(runtime, root, 0.08, -0.08);
    addVoxel(runtime, root, "trunk", 0.86, 1, -0.92, {
      scale: [0.3, 1.24, 0.3],
    });
    addVoxel(runtime, root, "plank", 0.86, 2.02, -0.92, {
      scale: [1.24, 0.78, 0.22],
      castShadow: false,
    });
    addGrassTuft(runtime, root, -0.86, 0.86);
  } else {
    const sign = new THREE.Group();
    root.add(sign);

    addVoxel(runtime, sign, "trunk", 0.9, 1, -1.2, {
      scale: [0.28, 1.3, 0.28],
    });
    addVoxel(runtime, sign, "plank", 0.9, 2.05, -1.2, {
      scale: [1.45, 0.85, 0.22],
      castShadow: false,
    });
    addVoxel(runtime, sign, "leaf", -0.6, 1, 0.8, {
      scale: [0.36, 0.22, 0.36],
      castShadow: false,
    });
    addVoxel(runtime, sign, "blossom", -0.2, 1.2, 0.4, {
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
      castShadow: false,
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

  for (let y = 1; y <= 4; y += 1) {
    addVoxel(runtime, treePivot, "trunk", 0, y, 0, {
      scale: [0.92, 1, 0.92],
    });
  }

  addOakLeaves(runtime, treePivot, getBloomOakLeafCells(), "leaf", {
    castShadow: false,
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

  for (let y = 1; y <= 4; y += 1) {
    addVoxel(runtime, treePivot, "trunk", 0, y, 0, {
      scale: [0.98, 1, 0.98],
    });
  }

  addOakLeaves(runtime, treePivot, getFruitOakLeafCells(), "leaf", {
    castShadow: false,
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
    addVoxel(runtime, root, "trunk", 1.12, 1.18, 0.12, {
      scale: [1.5, 0.44, 0.54],
    });
    addGrassTuft(runtime, root, -0.9, 0.7);
  } else if (kind === "redwood") {
    addSwampStump(runtime, root, 0.1, 0);
    addVoxel(runtime, root, "trunk", -1.26, 1.06, -0.74, {
      scale: [1.46, 0.54, 0.62],
    });
  } else if (kind === "birch") {
    addVoxel(runtime, root, "trunk", 0, 1, 0, {
      scale: [0.9, 0.88, 0.9],
    });
    addVoxel(runtime, root, "trunk", 0.96, 1.02, 0.62, {
      scale: [1.22, 0.42, 0.46],
    });
    addFlowerPatch(runtime, root, -0.82, 0.72, "blossom");
  } else if (kind === "sakura") {
    addVoxel(runtime, root, "trunk", 0, 1, 0, {
      scale: [1.02, 0.92, 1.02],
    });
    addVoxel(runtime, root, "trunk", 1.08, 1.02, 0.62, {
      scale: [1.34, 0.46, 0.5],
    });
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
    [1.3, 1, 0.7, [1.5, 0.7, 0.7]],
    [2.45, 1.05, 0.72, [0.72, 0.72, 0.72]],
    [-1.2, 1, -0.92, [1.28, 0.68, 0.68]],
    [-2, 1.02, -0.92, [0.72, 0.72, 0.72]],
  ].forEach((item) => {
    addVoxel(runtime, root, "trunk", item[0], item[1], item[2], {
      scale: item[3],
    });
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
    addVoxel(runtime, stage.treePivot, "trunk", 0, 1, 0, {
      scale: [0.34, 1.04, 0.34],
    });
    addVoxel(runtime, stage.treePivot, "trunk", 0, 2.02, 0, {
      scale: [0.28, 0.86, 0.28],
    });
    addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 2.84, 0, 1, [0.64, 0.24, 0.64]);
    addVoxel(runtime, stage.treePivot, "blossom", 0.1, 3.08, 0.08, {
      scale: [0.22, 0.22, 0.22],
      castShadow: false,
    });
    return stage;
  }

  if (runtime.themeDefinition.treeKind === "spruce") {
    const stage = createStageShell();
    addVoxel(runtime, stage.treePivot, "trunk", 0, 1, 0, {
      scale: [0.42, 1, 0.42],
    });
    addVoxel(runtime, stage.treePivot, "trunk", 0, 2, 0, {
      scale: [0.34, 0.82, 0.34],
    });
    addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 2.7, 0, 1, [0.72, 0.34, 0.72]);
    return stage;
  }

  if (runtime.themeDefinition.treeKind === "acacia") {
    const stage = createStageShell();
    addVoxel(runtime, stage.treePivot, "trunk", 0, 1, 0, {
      scale: [0.5, 0.96, 0.5],
    });
    addVoxel(runtime, stage.treePivot, "trunk", 0.32, 1.94, 0.12, {
      scale: [0.38, 0.8, 0.38],
    });
    addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0.32, 2.7, 0.12, 1, [0.76, 0.24, 0.76]);
    return stage;
  }

  if (runtime.themeDefinition.treeKind === "redwood") {
    const stage = createStageShell();
    addVoxel(runtime, stage.treePivot, "trunk", 0, 1, 0, {
      scale: [0.58, 1.1, 0.58],
    });
    addVoxel(runtime, stage.treePivot, "trunk", 0, 2.08, 0, {
      scale: [0.48, 0.96, 0.48],
    });
    addRoundCanopyLayer(runtime, stage.treePivot, "leaf", 0, 3.12, 0, 1, [0.64, 0.28, 0.64]);
    return stage;
  }

  if (runtime.themeDefinition.treeKind === "sakura") {
    const stage = createStageShell();
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
        castShadow: false,
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
  },
  data() {
    return {
      runtime: null,
      initFailed: false,
      hasInteracted: false,
    };
  },
  computed: {
    sceneStatus() {
      return this.state && this.state.tree_status
        ? this.state.tree_status
        : "未种植";
    },
    themeDefinition() {
      return getSceneThemeDefinition(this.sceneTheme);
    },
    sceneThemeStyle() {
      return getSceneThemeStyle(this.sceneTheme);
    },
  },
  watch: {
    sceneStatus() {
      this.rebuildStage();
    },
    sceneTheme() {
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

      if (!window.WebGLRenderingContext) {
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

      const hostRect = host.getBoundingClientRect();
      const initialAspect =
        hostRect.height > 0 ? hostRect.width / hostRect.height : 1;
      const themeDefinition = this.themeDefinition;
      const initialFraming = getCameraFraming(initialAspect, themeDefinition.key);
      const runtime = createRuntime(initialFraming);
      runtime.host = host;
      runtime.themeKey = themeDefinition.key;
      runtime.themeDefinition = themeDefinition;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
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

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(
        themeDefinition.fog.color,
        themeDefinition.fog.near,
        themeDefinition.fog.far
      );

      const camera = new THREE.PerspectiveCamera(initialFraming.fov, 1, 0.1, 60);
      camera.position
        .setFromSpherical(
          new THREE.Spherical(runtime.radius, runtime.currentPhi, runtime.currentTheta)
        )
        .add(CAMERA_TARGET);
      camera.lookAt(CAMERA_TARGET);

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

        runtime.targetTheta = runtime.baseTheta - deltaX * 0.012;
        runtime.targetPhi = clamp(runtime.basePhi + deltaY * 0.006, 0.82, 1.24);
      };

      const releasePointer = (event) => {
        if (!runtime.isDragging) return;

        runtime.isDragging = false;
        runtime.baseTheta = runtime.targetTheta;
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
      const framing = getCameraFraming(width / height, runtime.themeKey || this.themeDefinition.key);

      runtime.radius = framing.radius;
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

      runtime.currentTheta = lerp(
        runtime.currentTheta,
        runtime.targetTheta,
        0.08
      );
      runtime.currentPhi = lerp(runtime.currentPhi, runtime.targetPhi, 0.08);

      const offset = new THREE.Spherical(
        runtime.radius,
        runtime.currentPhi,
        runtime.currentTheta
      );
      runtime.camera.position.setFromSpherical(offset).add(CAMERA_TARGET);
      runtime.camera.lookAt(CAMERA_TARGET);

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

      if (runtime.stage && runtime.stage.treePivot) {
        const swayScale =
          this.themeDefinition.treeKind === "redwood"
            ? 0.62
            : this.themeDefinition.treeKind === "acacia"
              ? 0.82
              : 1;
        runtime.stage.treePivot.rotation.z =
          Math.sin(timestamp * 0.0011) * 0.028 * swayScale;
        runtime.stage.treePivot.rotation.x =
          Math.cos(timestamp * 0.0007) * 0.012 * swayScale;
      }

      if (runtime.stage && Array.isArray(runtime.stage.floatingLights)) {
        runtime.stage.floatingLights.forEach((item, index) => {
          item.mesh.position.x =
            item.origin.x +
            Math.cos(timestamp * 0.001 * item.speed + item.phase) * item.radius;
          item.mesh.position.z =
            item.origin.z +
            Math.sin(timestamp * 0.00115 * item.speed + item.phase) *
              item.radius;
          item.mesh.position.y =
            item.origin.y +
            Math.sin(timestamp * 0.0015 * item.speed + item.phase + index) *
              item.lift;
        });
      }

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
}

.scene-backdrop {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.sun-halo {
  position: absolute;
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
  filter: blur(8rpx);
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
</style>
