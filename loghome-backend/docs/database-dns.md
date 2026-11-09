# 本地数据库偶发 ENOTFOUND

`getaddrinfo ENOTFOUND sql.ricepastem.cafe` 表示在获取数据库 TCP 连接前，
系统域名解析失败。它不能单独证明数据库宕机，也不能单独证明是代理导致。
Node.js 的 `dns.lookup()` 使用操作系统解析机制；HTTP 系统代理本身不等于
MySQL TCP 流量会经过代理，但 TUN、DNS 劫持及 fake-IP 可能改变解析或路由。

本次检查时系统 DNS 为 `223.5.5.5`，FlClash 的 TUN 关闭；系统解析、两个公共
DNS 和数据库 TCP 连接均正常。数据库域名 CNAME 指向 `*.sql.tencentcdb.com`。
FlClash 订阅的默认 DNS 经代理，且原配置未为这些数据库域名单独设置策略。

## 本机代理配置

当前 FlClash 配置已绑定独立覆写脚本，源码见
[`database-dns.flclash.js`](database-dns.flclash.js)：

- 数据库域名及 `sql.tencentcdb.com` 走 DIRECT。
- 这两个域名使用通过 DIRECT 访问的阿里 / DNSPod DoH 解析。
- blacklist / rule 模式下排除这些域名的 fake-IP。
- 保留订阅内其他规则、代理节点和策略组。

脚本保存在 FlClash 的独立脚本库，并绑定到当前 `clash.tensornaut.io` 配置；
订阅自动更新后仍会应用。切换其他订阅时，需要为对应配置绑定相同脚本。
直接修改订阅下载的 YAML 会在同步时被覆盖，因此不应只靠修改 YAML。

原始 YAML 备份在工作区 `_tmp/database-dns-backup-20261027/`，目录仅当前
用户可访问；其中可能包含代理节点凭证，不应提交或分享。

## 后端容错

`sql.js` 仅对获取连接时的 DNS / 网络暂时故障重试：最多 4 次，间隔约
300 / 600 / 1200ms 加少量随机抖动。单次连接本身的耗时仍由连接池超时配置控制。
SQL 执行、事务回调和 commit 失败均不会重放，避免重复扣款或重复写入。
密码错误等非暂时性错误直接返回。需要重启正在运行的后端进程以加载代码。
AI 后端已有获取连接阶段的有限重试，本次未重复修改。

## 排查和验证

在 `loghome-backend` 下运行：

```sh
npm run check:database-dns
npm run test:sql-connection
```

诊断命令比较系统解析与两个国内 DNS，并测试数据库 TCP 可达性；不会输出
数据库用户名或密码，不发送认证或 SQL。系统解析失败而公共 DNS 成功时，
重点检查系统 DNS 缓存、代理 TUN / DNS 劫持、网络切换时机；三个都失败时，
检查域名权威 DNS 和网络。不要把当前数据库 IP 永久写死，云数据库切换可能改变 IP。

以上措施降低代理相关故障与短暂解析失败的影响，不能保证断网、DNS 服务故障或
长时间数据库故障时请求始终成功。

参考：[Node.js DNS](https://nodejs.org/api/dns.html)、
[Mihomo DNS 配置](https://wiki.metacubex.one/config/dns/)。
