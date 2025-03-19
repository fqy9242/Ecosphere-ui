@echo off
if exist "node_modules" (
    echo 检测到依赖已安装，正在启动开发服务器...
    npm run dev
) else (
    echo 未检测到依赖，正在进行依赖安装...
    npm install
    echo 安装完成，正在启动开发服务器...
    npm run dev
)
pause