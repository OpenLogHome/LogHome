# 原木竞技场（log-arena）

原木实验室第二个实验位（原木保卫战 8787 / 原木方块世界 8788 之后的第三个小程序，端口 8789）。

骨架与 log-defence 同套管线：

- `scripts/build.cjs`：esbuild + sass 构建 `src/main.js` 与 `src/Game.vue`（含 Game.vue 内联 `<style lang="scss">`，rpx 自动转 `calc(var(--rpx) * n)`）到 `dist/`
- `server/index.cjs`：票据鉴权（`/api/session` → LOGHOME_API_URL 换票）+ 云存档（`/api/save`，按用户 revision 乐观锁，`data/players/<id>.json`）+ 静态托管 `dist/`；健康检查 `/api/config`
- 存档校验为通用结构校验（原型键/深度/体积/非法数值），玩法字段校验随玩法定型再补

```sh
npm ci          # 安装依赖
npm run build   # 构建 dist/
npm start       # 生产模式（读 .env，PORT/BASE_PATH/DATA_DIR/LOGHOME_API_URL）
npm run dev     # 开发模式（.env.development，默认指向本地后端 127.0.0.1:9000 鉴权）
```

`node start-all.js`（上级目录）会自动发现本目录并按 package.json 的 `miniapp` 元数据管理。
