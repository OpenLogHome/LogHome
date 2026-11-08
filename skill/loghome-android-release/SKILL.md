---
name: loghome-android-release
description: 自动化原木社区 Android 正式包发布准备：通过 HBuilderX 发行 Web 前端，将资源打入 web.zip，更新 Android 版本并生成签名 APK，同时校验前端和原生后端地址。用于本项目发版、重新打包或排查发布包连错后端。
---

# 原木 Android 发布

在仓库根目录运行配套脚本：HBuilderX Web 发行 → Android 资源打包 → Android 版本更新 → Gradle release 构建 → 成品校验。仅生成本地发布产物；安装设备、上传分发平台、修改线上版本记录、Git 提交和推送按用户本次授权执行。

## 使用

从请求中读取目标版本。用户未指定版本时，读取 `loghome-android/app/build.gradle`，默认采用下一补丁版本和 versionCode + 1，说明采用值后执行；脚本参数必须明确传入这两个值。用户要求重打当前版本时保持相同版本名和版本码。

先执行只读预检（不发行、不修改项目文件）：

```sh
python3 skill/loghome-android-release/scripts/release.py --check
```

例如用户要求发布 3.2.3（323），执行：

```sh
python3 skill/loghome-android-release/scripts/release.py --version-name 3.2.3 --version-code 323
```

需要 Python 3.9+、Node.js。Windows 将 `python3` 换为 `py -3`。HBuilderX 不在标准位置时传 `--hbuilder-cli` 或设置 HBUILDERX_CLI；JDK 可传 `--java-home`，否则复用 JAVA_HOME 或寻找 Android Studio 自带 JBR。SDK 从 Android local.properties、ANDROID_HOME 或 ANDROID_SDK_ROOT 读取。

HBuilderX 须已启动、导入本项目并安装 uni-app 编译插件。脚本使用本机 CLI 的 `publish web --project <绝对路径> --webHosting false --sourceMap false`。CLI 异常时先检查本机 `cli publish web --help`，不得使用旧产物冒充本次发行或改用开发模式编译。

## 关键约束

- 默认后端为 `https://api.loghome.ink`。只有用户明确要求其他正式/预发布服务时才传 `--backend-url https://...`；脚本拒绝 HTTP、本地主机名、模拟器地址和私网 IP。
- 前端临时 `.env.production.local` 注入 VUE_APP_API_BASE_URL，成功或失败均恢复原文件；剔除子进程继承的同名变量，避免覆盖配置。
- Android 优先向前端注入 `window.jsBridge.backendEndpoint`，只检查 main.js 默认值不够。Gradle 必须显式传 `-Pbackend_endpoint=<正式地址>` 和 `-PloghomeWebviewEntryUrl=`。开发者现有 gradle.properties 不被修改，本地调试偏好可保留。
- 前端发行目录固定为 `loghome-app-frontend/unpackage/dist/build/web`。旧产物先移走备份；本次发行成功、实际后端选择行为验证通过后才打包。ZIP 根目录直接包含 index.html、static 等，不能套 web 目录。不收录 __MACOSX、.DS_Store、归档 ZIP、APK、源码映射等。
- Android 版本来源为 app/build.gradle，不是 uni-app manifest.json 中历史遗留的 0.1.0/1。版本码不得降低；相同版本码只能重打同名版本。
- 正式升级应递增 versionCode：AssetRepository 只有在内置版本高于现有 Web 资源版本时才替换资源。同版本重打用于构建验证，不保证覆盖设备已有的 Web 缓存；不能为验证包自动清除用户数据。
- 使用已有 key.properties 和签名文件，不输出或复制私钥、口令。apksigner 验签未通过的 APK 不得交付。
- 预检只读访问后端 `/miniapps` 确认 HTTP 200 和 JSON 结构，不修改线上数据，也不代表所有业务接口都已部署。

## 完成与恢复

成功输出 `_tmp/releases/<版本与时间>/`，包含签名 APK、SHA-256、release-manifest.json、构建日志及旧产物备份。必须确认：

1. 前端实际编译表达式在无原生注入时使用目标后端，并正确优先采用原生注入地址。
2. release BuildConfig 的 BACKEND_ENDPOINT 正确、WEBVIEW_ENTRY_URL 为空、DEBUG 为 false。
3. APK 包名为 top.codesocean.loghome，版本与请求一致，签名验证通过。
4. APK 的 assets/web/web.zip 与本次打包的哈希相同，ZIP 内容与本次前端产物一致。

任一步失败即停止，恢复原版本文件、web.zip、前端发行目录和旧 APK 输出，保留失败日志。若进程被强制终止，先检查 `_tmp/releases/.release.lock` 和对应备份；确认无构建运行后再恢复，不直接删除其他任务的锁或重置用户工作区。

报告版本、后端地址、成品绝对路径、SHA-256 和校验结果。不能将本地打包成功表述为已安装、上传或部署。

维护脚本时运行 `python3 skill/loghome-android-release/scripts/test_release.py`。
