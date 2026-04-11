# Tree Scene Assets

当前 `oakIsland` 首版贴图放在 `static/plantTrees/oakIsland/textures/`，是为了先把 H5 的 Minecraft 风格空岛橡树树场跑起来而生成的项目内像素资源。

当前已落地的贴图：

- `grass_top.png`
- `grass_side.png`
- `dirt.png`
- `stone.png`
- `soil.png`
- `path.png`
- `oak_log_top.png`
- `oak_log_side.png`
- `oak_leaves.png`
- `oak_planks.png`
- `blossom.png`
- `apple.png`

后续如果要替换成更精细的资源，优先选可商用、可重分发的 `CC0` 或明确允许商用的资源，不要直接搬用 Minecraft 原版材质。

可作为后续替换来源的公开资源：

- Kenney Voxel Pack: https://kenney.nl/assets/voxel-pack
- Kenney Roguelike Caves & Dungeons: https://kenney.nl/assets/roguelike-caves-dungeons
- OpenGameArt 16x16 grass and dirt TileSet: https://opengameart.org/content/16x16-grass-and-dirt-tileset
- OpenGameArt 16x16 Block Textures: https://opengameart.org/content/1616-block-textures
- OpenGameArt CC0 Minecraft Inspired Textures: https://opengameart.org/content/cc0-minecraft-inspired-textures
- Poly Haven Bark Brown 02: https://polyhaven.com/a/bark_brown_02
- ambientCG Foliage 002: https://ambientcg.com/view?id=Foliage002
- ambientCG Ground 049C: https://ambientcg.com/view?id=Ground049C

接入约定：

- `threeOakTree.vue` 优先从 `/static/plantTrees/oakIsland/textures/*.png` 读取贴图。
- 若贴图加载失败，组件会继续使用代码里的程序贴图兜底。
- 像素贴图保持 `16x16` 或 `32x32`，并配合 `NearestFilter`，不要混入大尺寸写实贴图直接上场景。
