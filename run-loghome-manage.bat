@echo off

rem 定义变量
set NODE_VERSION=14.18.0
set PROJECT_DIR=d:\LogHome\loghome-manage
set NVM_DIR=d:\LogHome\nvm
set NODE_PATH=%NVM_DIR%\v%NODE_VERSION%

rem 检查指定路径的Node是否存在
if exist "%NODE_PATH%\node.exe" (
    echo Found Node %NODE_VERSION% at %NODE_PATH%
    rem 设置PATH环境变量，优先使用指定版本的Node
    set "PATH=%NODE_PATH%;%PATH%"
) else (
    echo Node version %NODE_VERSION% not found at %NODE_PATH%
    echo Please install Node %NODE_VERSION% or check the path
    pause
    exit /b 1
)

rem 进入项目目录并运行npm run serve
cd "%PROJECT_DIR%"
echo Starting development server...
call npm run serve

pause