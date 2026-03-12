@echo off
echo ========================================
echo       人生计算器 GitHub部署助手
echo ========================================
echo.
echo 本脚本将帮助您将项目部署到GitHub Pages
echo.

REM 检查是否在正确的目录
if not exist "网站代码" (
    echo [错误] 请在github-upload文件夹中运行此脚本
    echo 当前目录：%CD%
    pause
    exit /b 1
)

echo [信息] 当前目录：%CD%
echo.

echo [步骤1] 检查必要的文件...
if not exist "网站代码\index.html" (
    echo [错误] 未找到index.html文件
    pause
    exit /b 1
)

if not exist "README.md" (
    echo [错误] 未找到README.md文件
    pause
    exit /b 1
)

echo [成功] 所有必要文件检查通过
echo.

echo [步骤2] 请按照以下步骤操作：
echo.
echo 1. 登录GitHub并创建新仓库
echo    仓库名称：人生计算器
echo    描述：专业的在线人生规划工具平台
echo.
echo 2. 将本文件夹中的所有内容上传到GitHub仓库：
echo    - 直接将文件夹拖拽到GitHub网页上传
echo    - 或使用Git命令行工具
echo.
echo 3. 启用GitHub Pages：
echo    a. 进入仓库Settings → Pages
echo    b. Source选择：Deploy from a branch
echo    c. Branch选择：main
echo    d. Folder选择：/ (root)
echo    e. 点击Save
echo.
echo 4. 等待几分钟后访问您的网站：
echo    https://[您的用户名].github.io/人生计算器/
echo.
echo 详细说明请查看"GitHub部署指南.md"
echo.

echo [步骤3] Git命令行快速部署命令：
echo.
echo 如果您已经安装Git，可以使用以下命令：
echo.
echo # 克隆仓库
echo git clone https://github.com/[您的用户名]/人生计算器.git
echo cd "人生计算器"
echo.
echo # 复制所有文件到仓库
echo copy /Y "%~dp0\*" "."
echo xcopy /E /I "%~dp0\网站代码" "网站代码"
echo xcopy /E /I "%~dp0\项目文档" "项目文档"
echo xcopy /E /I "%~dp0\部署配置" "部署配置"
echo if exist "%~dp0\assets" xcopy /E /I "%~dp0\assets" "assets"
echo.
echo # 添加到Git并提交
echo git add .
echo git commit -m "初始提交：完整的人生计算器网站"
echo git push origin main
echo.

echo ========================================
echo        部署准备完成！
echo ========================================
echo.
echo 请按照上述步骤操作，或查看"GitHub部署指南.md"获取详细说明。
echo.
echo 按任意键退出...
pause >nul