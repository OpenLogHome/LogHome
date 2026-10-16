// PM2 配置：只注册一个应用 loghome-miniapps，由项目自带的管理器 start-all.js
// 并行拉起两个小程序后端（原木保卫战 8787、原木方块世界 8788）。
//
// 这里必须显式指定 Node 22 解释器并把它的目录前置到 PATH：管理器是用 npm.cmd
// 启动子服务的，而本机 PATH 上的 node 是 nvm 链接的 v16.18.0，不认识子服务
// start 脚本里的 --env-file-if-exists（Node 22.9 起才支持），会直接退出码 9。
const NODE22 = 'C:\\Users\\Administrator\\AppData\\Local\\nvm\\v22.12.0';

module.exports = {
  apps: [
    {
      name: 'loghome-miniapps',
      cwd: 'E:\\LogHome\\LogHome\\loghome-miniapps',
      script: 'start-all.js',
      interpreter: NODE22 + '\\node.exe',
      env: {
        NODE_ENV: 'production',
        PATH: NODE22 + ';' + process.env.PATH,
        // 管理器只会把 PORT/BASE_PATH/DATA_DIR 从继承环境里删掉，其余原样传给子服务。
        // Caddy 已在 reverse_proxy 里写 header_up X-Real-IP {remote_host}，
        // 开了这个开关两个后端的登录限速才按真实访客 IP 计数，而不是全部算成 frpc 的 127.0.0.1。
        TRUST_PROXY: '1'
      },
      time: true
    }
  ]
}
