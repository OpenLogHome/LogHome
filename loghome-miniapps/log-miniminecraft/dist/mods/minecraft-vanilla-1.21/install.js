// 内置本地模组安装器：使用应用自身的 IndexedDB API，首次启动完成后再挂载界面。
export async function installVanillaPack(api) {
  const response = await fetch(new URL('./pack.json', import.meta.url));
  if (!response.ok) throw new Error('原版材质模组清单加载失败');
  const manifest = await response.json();
  const current = await api.getModPack(manifest.id);
  if (current?.builtin_revision === manifest.revision) return;
  const defaults = api.createDefaultModPackData();
  const now = Date.now();
  const textureUrl = path => new URL('./' + path, import.meta.url).href;
  const blocks = defaults.blocks.filter(block => manifest.blocks[block.id]).map((block, index) => {
    const textures = Object.fromEntries(Object.entries(manifest.blocks[block.id]).map(
      ([face, files]) => [face, files.map(textureUrl)]
    ));
    return {...block, mod_pack_id: manifest.id, textures,
      icon_url: textures.front[0], created_at: now + index, updated_at: now + index};
  });
  const texturePaths = [...new Set(Object.values(manifest.blocks).flatMap(faces => Object.values(faces).flat()))];
  const assets = texturePaths.map((path, index) => ({
    id: 'vanilla_' + path.replace(/[^\w]/g, '_'), mod_pack_id: manifest.id,
    name: path.split('/').pop(), url: textureUrl(path), size: 0, created_at: now + index,
  }));
  // 最后写入包标记：部分写入失败时下次启动会重试，不覆盖其他模组。
  await api.saveAllCustomBlocks(blocks);
  await api.saveAllModAssets(assets);
  await api.saveModPack({id: manifest.id, name: manifest.name, description: manifest.description,
    author_id: 'builtin_vanilla', author_name: manifest.author, is_default: 0,
    builtin_revision: manifest.revision, created_at: now, updated_at: now});
  console.log('[VanillaPack] 原版材质模组已安装：', blocks.length, '种方块');
}
