@echo off
setlocal enabledelayedexpansion

chcp 65001 >nul

:MAIN_LOOP
cls
echo ====================================
echo        腾讯云DDNS配置工具
echo ====================================
echo.
echo 1. 添加腾讯云ID和Key
echo 2. 删除腾讯云ID和Key
echo 3. 查看腾讯云ID和Key
echo 4. 添加域名
echo 5. 删除域名
echo 6. 查看已添加域名

echo 7. 环境配置检测

echo 8. 启动运行
echo 9. 后台进程检测/删除
echo 0.退出
echo.
echo ====================================

set /p CHOICE=请输入选项数字（0-9）：
if "%CHOICE%"=="" goto INVALID_INPUT

if %CHOICE% equ 1 (
    goto ADD_SECRET
) else if %CHOICE% equ 2 (
    goto DEL_SECRET
) else if %CHOICE% equ 3 (
    goto SHOW_SECRET
) else if %CHOICE% equ 4 (
    goto ADD_DOMAIN
) else if %CHOICE% equ 5 (
    goto DEL_DOMAIN
) else if %CHOICE% equ 6 (
    goto SHOW_DOMAINS
) else if %CHOICE% equ 7 (
    goto CREATE_SERVICE
) else if %CHOICE% equ 8 (
    goto START_RUN
) else if %CHOICE% equ 9 (
    goto Thread_Que
) else if %CHOICE% equ 0 (
    exit /b
) else (
    goto INVALID_INPUT
)

:ADD_SECRET

cls
echo ====================================
echo      添加腾讯云ID和Key
echo ====================================

REM 创建基础目录结构
if not exist "src\ReadFile\IdAndKey\" (
    mkdir "src\ReadFile\IdAndKey" >nul 2>&1
)

REM 检测已有配置
set "FLAG_EXIST="
for /f "delims=" %%i in ('dir /ad /b "src\ReadFile\IdAndKey" 2^>nul') do set FLAG_EXIST=1

if defined FLAG_EXIST (
    echo 错误：检测到已存在的腾讯云配置！
    echo 请先执行[功能2]删除现有配置后再添加
    echo 按回车键继续.....
    pause >nul
    goto MAIN_LOOP
)

REM 用户输入验证循环
:INPUT_LOOP
set /p "TENCENT_ID=请输入腾讯云ID："
if "%TENCENT_ID%"=="" (
    echo 输入不能为空！
    goto INPUT_LOOP
)


:KEY_INPUT
set /p "TENCENT_KEY=请输入腾讯云Key："
if "%TENCENT_KEY%"=="" (
    echo 输入不能为空！
    goto KEY_INPUT
)


REM 创建凭证存储结构
mkdir "src\ReadFile\IdAndKey\%TENCENT_ID%" >nul 2>&1
if errorlevel 1 (
    echo 创建目录失败！可能原因：
    echo 1. 包含非法字符
    echo 2. 系统权限不足
    echo 按回车键继续.....
    pause >nul
    goto MAIN_LOOP
)

cd.>"src\ReadFile\IdAndKey\%TENCENT_ID%\%TENCENT_KEY%"
if errorlevel 1 (
    echo 文件创建失败！正在回滚操作...
    rmdir /s /q "src\ReadFile\IdAndKey\%TENCENT_ID%"
    echo 按回车键继续.....
    pause >nul
    goto MAIN_LOOP
)

echo ----------------------------------------
echo 凭证存储成功！
echo 存储路径：src\ReadFile\IdAndKey\%TENCENT_ID%\
echo 密钥文件：%TENCENT_KEY%
echo 按回车键继续.....
pause >nul
goto MAIN_LOOP





:DEL_SECRET
cls
echo ====================================
echo      删除腾讯云ID和Key
echo ====================================

REM 检查目录是否存在
if not exist "src\ReadFile\IdAndKey\" (
    echo 未找到凭证存储目录
    echo 可能尚未配置或已被删除
    echo 按回车键继续.....
    pause >nul
    goto MAIN_LOOP
)

REM 检测子目录存在性
set "FOLDER_EXIST="
for /d %%i in ("src\ReadFile\IdAndKey\*") do set FOLDER_EXIST=1

if not defined FOLDER_EXIST (
    echo 当前没有可删除的腾讯云配置
    echo 按回车键继续.....
    pause >nul
    goto MAIN_LOOP
)

REM 显示警告信息
echo 警告：这将永久删除所有存储的凭证！


echo 以下配置将被清除：
dir /ad /b "src\ReadFile\IdAndKey"

REM 二次确认
:CONFIRM_DELETE
set /p "CHOICE=确定要永久删除所有凭证？(Y/N) "
if /i "%CHOICE%"=="Y" goto PERFORM_DELETE
if /i "%CHOICE%"=="N" (
    echo 操作已取消
    echo 按回车键继续.....
    pause >nul
    goto MAIN_LOOP
)
echo 请输入 Y 或 N
goto CONFIRM_DELETE

:PERFORM_DELETE
echo 正在清除凭证...
rmdir /s /q "src\ReadFile\IdAndKey" >nul 2>&1

REM 结果验证
if exist "src\ReadFile\IdAndKey\" (
    echo 删除失败！可能原因：
    echo 1. 文件被其他程序占用
    echo 2. 缺少管理员权限
    echo 3. 防病毒软件阻止操作
) else (
    echo 所有凭证已成功删除
    mkdir "src\ReadFile\IdAndKey" >nul 2>&1
)
echo 按回车键继续.....
pause >nul
goto MAIN_LOOP

:SHOW_SECRET
rem 查看腾讯云ID和Key的功能
cls
echo ====================================
echo      查看腾讯云ID和Key
echo ====================================

rem 检查是否存在配置
dir /a "src\ReadFile\IdAndKey\*" 2>nul | findstr "." >nul
if %errorlevel% neq 0 (
    echo 提示：当前没有已保存的腾讯云ID和Key！
    echo 按回车键继续.....
    pause
    goto menu
)

echo 已保存的腾讯云ID和Key信息：
echo ------------------------------------

rem 遍历所有ID文件夹
for /d %%i in ("src\ReadFile\IdAndKey\*") do (
    echo 腾讯云ID: %%~nxi
    rem 遍历ID文件夹中的Key文件
    for %%j in ("%%i\*") do (
        echo 腾讯云Key: %%~nxj
    )
    echo ------------------------------------
)
echo 按回车键继续.....
pause >nul
goto MAIN_LOOP

:ADD_DOMAIN
cls
echo ====================================
echo            添加域名
echo ====================================

REM 创建域名存储目录
if not exist "src\ReadFile\TencentDomain\" (
    mkdir "src\ReadFile\TencentDomain" >nul 2>&1
    if errorlevel 1 (
        echo 错误：无法创建存储目录！
        echo 请检查以下可能原因：
        echo 1. 磁盘写保护
        echo 2. 系统权限不足
        echo 3. 路径包含非法字符
        echo 按回车键继续.....
        pause >nul
        goto MAIN_LOOP
    )
)

REM 域名输入循环
:DOMAIN_INPUT
set /p "DOMAIN=请输入要添加的域名（例如：example.com）："
set "DOMAIN=%DOMAIN: =%"  & REM 去除首尾空格

REM 空值验证
if "%DOMAIN%"=="" (
    echo 错误：域名不能为空！
    goto DOMAIN_INPUT
)

REM 检查域名是否已存在
if exist "src\ReadFile\TencentDomain\%DOMAIN%" (
    echo 错误：域名 %DOMAIN% 已存在！
    echo 请执行[功能5]删除现有配置
    echo 按回车键继续.....
    pause >nul
    goto MAIN_LOOP
)

REM 创建域名标记文件
echo. > "src\ReadFile\TencentDomain\%DOMAIN%"
echo.
echo ----------------------------------------
echo 域名 %DOMAIN% 添加成功
echo 按回车键继续.....
pause
goto MAIN_LOOP

:DEL_DOMAIN
cls
echo ====================================
echo            删除域名
echo ====================================

REM 检查存储目录是否存在
if not exist "src\ReadFile\TencentDomain\" (
    echo 错误：域名配置目录不存在！
    echo 按回车键继续.....
    pause >nul
    goto MAIN_LOOP
)

REM 获取域名文件列表
setlocal enabledelayedexpansion
set COUNT=0
echo 可删除的域名列表：
for /f "delims=" %%i in ('dir /b "src\ReadFile\TencentDomain\" 2^>nul') do (
    set /a COUNT+=1
    set "DOMAIN[!COUNT!]=%%i"
    echo  [!COUNT!] %%i
)

REM 空目录检查
if %COUNT% equ 0 (
    echo 当前没有可删除的域名配置！
    echo 按回车键继续.....
    pause >nul
    goto MAIN_LOOP
)

REM 用户输入循环
:DELETE_INPUT
set /p "NUM=请输入要删除的域名编号："
set "NUM=%NUM: =%"  & REM 去除空格

REM 空值验证
if "%NUM%"=="" (
    echo 错误：输入不能为空！
    goto DELETE_INPUT
)

REM 数字格式验证
echo %NUM%|findstr /r "^[0-9]*$" >nul
if errorlevel 1 (
    echo 错误：请输入有效数字编号！
    goto DELETE_INPUT
)

REM 范围验证
if %NUM% lss 1 (
    echo 错误：编号不能小于1！
    goto DELETE_INPUT
)
if %NUM% gtr %COUNT% (
    echo 错误：编号不能超过%COUNT%！
    goto DELETE_INPUT
)

REM 获取对应域名
set "TARGET=!DOMAIN[%NUM%]!"

REM 二次确认
:CONFIRM_DELETE
set /p "CHOICE=确定要删除域名 [!TARGET!] 吗？(Y/N): "
if /i "%CHOICE%"=="y" (
    del "src\ReadFile\TencentDomain\!TARGET!" >nul 2>&1
    if exist "src\ReadFile\TencentDomain\!TARGET!" (
        echo 错误：文件删除失败！
        echo 可能原因：文件被锁定或权限不足
    ) else (
        echo 域名 [!TARGET!] 已成功删除
    )
) else if /i "%CHOICE%"=="n" (
    echo 已取消删除操作
) else (
    echo 请输入Y或N进行确认！
    goto CONFIRM_DELETE
)

endlocal
echo 按回车键继续.....
pause >nul
goto MAIN_LOOP

:SHOW_DOMAINS
cls
echo ====================================
echo            查看已添加域名
echo ====================================

REM 检查存储目录是否存在
if not exist "src\ReadFile\TencentDomain\" (
    echo 错误：域名配置目录不存在！
    echo 按回车键继续.....
    pause >nul
    goto MAIN_LOOP
)

REM 获取域名列表并显示
setlocal enabledelayedexpansion
set COUNT=0
echo 当前已配置域名：
for /f "delims=" %%i in ('dir /b "src\ReadFile\TencentDomain\" 2^>nul') do (
    set /a COUNT+=1
    echo  [!COUNT!] %%i
)

REM 空目录提示
if %COUNT% equ 0 (
    echo （空）
)

endlocal
echo.
echo ----------------------------------------
echo 按回车键继续.....
pause >nul
goto MAIN_LOOP

:Detection_Domain
set COUNT=0
for /f "delims=" %%i in ('dir /b "src\ReadFile\TencentDomain\" 2^>nul') do (
    set /a COUNT+=1
)
REM 空目录检查
if %COUNT% equ 0 (
    echo 没有域名，请执行[功能4]！
    echo 回车继续.....
    pause >nul
    goto MAIN_LOOP
)
echo 域名正常
goto Build_jar


:CREATE_SERVICE
echo [功能7] 检测环境和配置...
REM 获取当前批处理文件的根目录
REM 尝试运行java -version命令
java -version 2>nul

REM 检查上一条命令的返回码
if %errorlevel% EQU 0 (
    echo Java环境已安装
    set "FLAG="
    for /f "delims=" %%i in ('dir /ad /b "src\ReadFile\IdAndKey" 2^>nul') do set FLAG=1
    if defined FLAG (
        echo 腾讯云配置账号配置正常！
        goto Detection_Domain
    )
    echo 未检测到腾讯云账号，请执行[功能1]
    echo 回车键继续.....
    pause >nul
    goto MAIN_LOOP

) else (
    echo Java环境未安装,请安装java环境后再试。
    pause >nul
    goto MAIN_LOOP
)

:Build_jar
set "ROOT_DIR=%~dp0"

REM 检查根目录下是否存在 PublicIP.jar
if exist "%ROOT_DIR%PublicIP.jar" (
    echo PublicIP.jar 已存在，无需构建。
    goto PANDING
)
REM 如果不存在，则运行 gradle build
echo PublicIP.jar 不存在，开始构建...
call gradle build


REM 检查 gradle build 是否成功
if errorlevel 1 (
    echo 构建失败，说明你没有gradle环境，请直接使用原来jar包或自己打包
    pause >nul
    goto MAIN_LOOP
)

REM 构建成功后，将 build/libs/PublicIP.jar 剪切到根目录
if exist "%ROOT_DIR%build\libs\PublicIP.jar" (
    echo 正在移动 PublicIP.jar 到根目录...
    move "%ROOT_DIR%build\libs\PublicIP.jar" "%ROOT_DIR%"
    echo 移动完成。
    goto PANDING
) else (
    echo 未找到 build/libs/PublicIP.jar 文件，请检查构建输出。
)

pause >nul
goto MAIN_LOOP

REM 二次确认
:PANDING
    set /p "FLAG=是否直接运行？(Y/N) "
    if /i "%FLAG%"=="Y" goto START_RUN
    if /i "%FLAG%"=="N" (
        echo 操作已取消
        echo 按回车键继续.....
        pause >nul
        goto MAIN_LOOP
    )
echo 请输入 Y 或 N
goto PANDING


:START_RUN
echo 请选择运行方式：

echo 1、前台运行(会有日志提示，随着窗口关闭而停止运行)

echo 2、后台运行(没有日志提示，窗口关闭在后台运行)
set /p choice=请输入选项（1 或 2）：
REM 检查用户输入
if "%choice%"=="1" (
    echo 前台运行中。
    java -jar PublicIP.jar
    REM 在这里添加前台运行的命令
    echo 结束运行
    pause >nul
    goto MAIN_LOOP
) else if "%choice%"=="2" (
    echo 后台运行中。
    start /B javaw -jar PublicIP.jar
    echo 查询后台进程
    tasklist /FI "IMAGENAME eq javaw.exe"
    pause >nul
    REM 在这里添加后台运行的命令
    goto MAIN_LOOP
) else (
    echo 无效选项，请重新输入。
    pause >nul
    goto START_RUN
)

pause >nul
goto MAIN_LOOP

:INVALID_INPUT
echo 错误：无效的输入，请按任意键重新选择...
pause >nul
goto MAIN_LOOP

:Thread_Que
echo 查询后台进程
echo 一个是执行程序，一个是保留后台程序
tasklist /FI "IMAGENAME eq javaw.exe"

set /p "FLAG=是否删除进程？(Y/N): "
if /i "%FLAG%"=="N" goto MAIN_LOOP
if /i "%FLAG%"=="Y" (
    goto util_PID
)
echo 请输入 Y 或 N
goto Thread_Que

:util_PID
set /p "pid1=请输入第一个PID: "
echo PID1=%pid1%
set /p "pid2=请输入第二个PID: "
echo PID2=%pid2%
if %errorlevel%==0 (
    echo 正在终止第一个进程...
    taskkill /PID "%pid1%" /F
) else (
    echo 进程 %pid1% 不存在
)

tasklist | findstr /I "%pid2%" >nul
if %errorlevel%==0 (
    echo 正在终止第二个进程...
    taskkill /PID "%pid2%" /F
) else (
     echo 进程 %pid2% 不存在
)
echo 进程已终止,按回车键继续.....
echo 如果进程未关闭，请手动执行指令

echo taskkill /PID 进程PID值 /F
pause >nul
goto MAIN_LOOP