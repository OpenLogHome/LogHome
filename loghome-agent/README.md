# LogHome Agent Simulator

LogHome Agent Simulator 是一个模拟原木社区吉祥物"原木娘"行为的程序，它会自动浏览社区内容、阅读小说、与用户互动等。

## 持续运行方案

为了确保模拟器能够持续运行，即使在程序崩溃或系统重启后也能自动恢复，我们提供了以下几种方案：

### 方案1：使用内置的永久运行模式

我们在 `simulator.py` 中添加了永久运行模式，可以通过以下命令启动：

```bash
python simulator.py --forever
```

或者直接运行提供的批处理文件：

```bash
run_forever.bat
```

这种方式会在程序崩溃后自动重启，但如果命令窗口被关闭，程序也会停止。

### 方案2：使用 NSSM 作为 Windows 服务（推荐）

NSSM (Non-Sucking Service Manager) 是一个优秀的 Windows 服务管理工具，可以将任何程序作为 Windows 服务运行。

1. 首先下载并安装 NSSM：https://nssm.cc/
2. 将 NSSM 添加到系统 PATH 环境变量中
3. 运行提供的安装服务脚本：

```bash
install_service.bat
```

安装后，服务会自动随系统启动，即使没有用户登录也能运行。

服务管理命令：
- 启动服务：`nssm start LogHomeSimulator`
- 停止服务：`nssm stop LogHomeSimulator`
- 删除服务：`nssm remove LogHomeSimulator`

### 方案3：使用 Supervisor（适用于支持 Python 的 Windows 系统）

Supervisor 是一个用 Python 编写的进程管理工具，也可以在 Windows 上使用。

1. 安装 supervisor-win：
```bash
pip install supervisor-win
```

2. 将提供的 `supervisor_config.ini` 文件复制到适当位置，例如 `C:\supervisor\`

3. 启动 Supervisor：
```bash
supervisord -c C:\supervisor\supervisor_config.ini
```

4. 使用 supervisorctl 管理进程：
```bash
supervisorctl status
supervisorctl start loghome_simulator
supervisorctl stop loghome_simulator
supervisorctl restart loghome_simulator
```

## 日志文件

无论使用哪种方式运行，日志文件都会保存在 `logs` 目录下：

- `simulator.log`：主程序日志
- `simulator_error.log`：错误日志

使用 NSSM 服务时，额外的服务日志：
- `service_stdout.log`：服务标准输出
- `service_stderr.log`：服务错误输出

## 故障排除

1. **程序无法启动**：
   - 检查 Python 环境是否正确
   - 检查所需依赖是否已安装
   - 查看日志文件了解详细错误信息

2. **服务安装失败**：
   - 确保以管理员权限运行安装脚本
   - 确保 NSSM 已正确安装并添加到 PATH

3. **程序启动后立即崩溃**：
   - 检查配置文件和数据库连接
   - 查看日志文件了解详细错误信息 