#!/bin/bash
# 腾讯云DDNS配置工具 – Ubuntu 版 Shell 脚本
# 注意：请确保系统已安装 java 和 gradle（如果需要打包 jar）

###############################
# 自定义 pause 函数
function pause(){
    read -rp "按回车键继续....." temp
}

###############################
# 功能1：添加腾讯云ID和Key
function add_secret(){
    clear
    echo "===================================="
    echo "      添加腾讯云ID和Key"
    echo "===================================="

    # 创建目录
    mkdir -p "src/ReadFile/IdAndKey"

    # 检查目录下是否已有子目录（代表已存在配置）
    if [ "$(find "src/ReadFile/IdAndKey" -mindepth 1 -maxdepth 1 -type d 2>/dev/null)" ]; then
        echo "错误：检测到已存在的腾讯云配置！"
        echo "请先执行[功能2]删除现有配置后再添加"
        pause
        return
    fi

    # 循环输入腾讯云ID
    while true; do
        read -rp "请输入腾讯云ID：" TENCENT_ID
        if [ -z "$TENCENT_ID" ]; then
            echo "输入不能为空！"
        else
            break
        fi
    done

    # 循环输入腾讯云Key
    while true; do
        read -rp "请输入腾讯云Key：" TENCENT_KEY
        if [ -z "$TENCENT_KEY" ]; then
            echo "输入不能为空！"
        else
            break
        fi
    done

    # 创建凭证存储结构
    if ! mkdir -p "src/ReadFile/IdAndKey/${TENCENT_ID}"; then
        echo "创建目录失败！可能原因："
        echo "1. 包含非法字符"
        echo "2. 系统权限不足"
        pause
        return
    fi

    if ! touch "src/ReadFile/IdAndKey/${TENCENT_ID}/${TENCENT_KEY}"; then
        echo "文件创建失败！正在回滚操作..."
        rm -rf "src/ReadFile/IdAndKey/${TENCENT_ID}"
        pause
        return
    fi

    echo "----------------------------------------"
    echo "凭证存储成功！"
    echo "存储路径：src/ReadFile/IdAndKey/${TENCENT_ID}/"
    echo "密钥文件：${TENCENT_KEY}"
    pause
}

###############################
# 功能2：删除腾讯云ID和Key
function del_secret(){
    clear
    echo "===================================="
    echo "      删除腾讯云ID和Key"
    echo "===================================="

    if [ ! -d "src/ReadFile/IdAndKey" ]; then
        echo "未找到凭证存储目录"
        echo "可能尚未配置或已被删除"
        pause
        return
    fi

    # 检查是否有子目录
    if [ -z "$(find "src/ReadFile/IdAndKey" -mindepth 1 -maxdepth 1 -type d 2>/dev/null)" ]; then
        echo "当前没有可删除的腾讯云配置"
        pause
        return
    fi

    echo "警告：这将永久删除所有存储的凭证！"
    echo "以下配置将被清除："
    ls -1 "src/ReadFile/IdAndKey"

    while true; do
        read -rp "确定要永久删除所有凭证？(Y/N) " choice
        case "$choice" in
            [Yy]* )
                echo "正在清除凭证..."
                rm -rf "src/ReadFile/IdAndKey"
                mkdir -p "src/ReadFile/IdAndKey"
                echo "所有凭证已成功删除"
                break;;
            [Nn]* )
                echo "操作已取消"
                break;;
            * )
                echo "请输入 Y 或 N" ;;
        esac
    done
    pause
}

###############################
# 功能3：查看腾讯云ID和Key
function show_secret(){
    clear
    echo "===================================="
    echo "      查看腾讯云ID和Key"
    echo "===================================="

    if [ -z "$(find "src/ReadFile/IdAndKey" -mindepth 1 -maxdepth 1 -type d 2>/dev/null)" ]; then
        echo "提示：当前没有已保存的腾讯云ID和Key！"
        pause
        return
    fi

    echo "已保存的腾讯云ID和Key信息："
    echo "------------------------------------"
    for dir in src/ReadFile/IdAndKey/*; do
        if [ -d "$dir" ]; then
            echo "腾讯云ID: $(basename "$dir")"
            for file in "$dir"/*; do
                if [ -f "$file" ]; then
                    echo "腾讯云Key: $(basename "$file")"
                fi
            done
            echo "------------------------------------"
        fi
    done
    pause
}

###############################
# 功能4：添加域名
function add_domain(){
    clear
    echo "===================================="
    echo "            添加域名"
    echo "===================================="

    mkdir -p "src/ReadFile/TencentDomain" 2>/dev/null
    while true; do
        read -rp "请输入要添加的域名（例如：example.com）： " DOMAIN
        DOMAIN=$(echo "$DOMAIN" | xargs)  # 去掉首尾空格
        if [ -z "$DOMAIN" ]; then
            echo "错误：域名不能为空！"
        else
            break
        fi
    done

    if [ -e "src/ReadFile/TencentDomain/${DOMAIN}" ]; then
        echo "错误：域名 ${DOMAIN} 已存在！"
        echo "请执行[功能5]删除现有配置"
        pause
        return
    fi

    if ! touch "src/ReadFile/TencentDomain/${DOMAIN}"; then
        echo "添加域名失败！"
        pause
        return
    fi

    echo "----------------------------------------"
    echo "域名 ${DOMAIN} 添加成功"
    pause
}

###############################
# 功能5：删除域名
function del_domain(){
    clear
    echo "===================================="
    echo "            删除域名"
    echo "===================================="

    if [ ! -d "src/ReadFile/TencentDomain" ]; then
        echo "错误：域名配置目录不存在！"
        pause
        return
    fi

    domains=()
    count=0
    echo "可删除的域名列表："
    while IFS= read -r line; do
        ((count++))
        domains+=("$line")
        echo "  [$count] $line"
    done < <(ls -1 "src/ReadFile/TencentDomain")

    if [ "$count" -eq 0 ]; then
        echo "当前没有可删除的域名配置！"
        pause
        return
    fi

    while true; do
        read -rp "请输入要删除的域名编号：" NUM
        NUM=$(echo "$NUM" | xargs)
        if [ -z "$NUM" ]; then
            echo "错误：输入不能为空！"
            continue
        fi
        if ! [[ "$NUM" =~ ^[0-9]+$ ]]; then
            echo "错误：请输入有效数字编号！"
            continue
        fi
        if [ "$NUM" -lt 1 ] || [ "$NUM" -gt "$count" ]; then
            echo "错误：编号必须在1 到 $count之间！"
            continue
        fi
        TARGET="${domains[$((NUM-1))]}"
        while true; do
            read -rp "确定要删除域名 [${TARGET}] 吗？(Y/N): " DEL_CHOICE
            case "$DEL_CHOICE" in
                [Yy]* )
                    rm -f "src/ReadFile/TencentDomain/${TARGET}"
                    if [ -e "src/ReadFile/TencentDomain/${TARGET}" ]; then
                        echo "错误：文件删除失败！可能原因：文件被锁定或权限不足"
                    else
                        echo "域名 [${TARGET}] 已成功删除"
                    fi
                    break;;
                [Nn]* )
                    echo "已取消删除操作"
                    break;;
                * )
                    echo "请输入Y或N进行确认！";;
            esac
        done
        break
    done
    pause
}

###############################
# 功能6：查看已添加域名
function show_domains(){
    clear
    echo "===================================="
    echo "            查看已添加域名"
    echo "===================================="

    if [ ! -d "src/ReadFile/TencentDomain" ]; then
        echo "错误：域名配置目录不存在！"
        pause
        return
    fi

    count=0
    echo "当前已配置域名："
    for domain in src/ReadFile/TencentDomain/*; do
        if [ -f "$domain" ]; then
            ((count++))
            echo "  [$count] $(basename "$domain")"
        fi
    done

    if [ "$count" -eq 0 ]; then
        echo "（空）"
    fi

    echo "----------------------------------------"
    pause
}

###############################
# 功能7：环境配置检测（检测 Java 环境及账户配置）
function create_service(){
    echo "[功能7] 检测环境和配置..."
    if java -version > /dev/null 2>&1; then
        echo "Java环境已安装"
        if [ "$(find "src/ReadFile/IdAndKey" -mindepth 1 -maxdepth 1 -type d 2>/dev/null)" ]; then
            echo "腾讯云配置账号配置正常！"
            detection_domain
        else
            echo "未检测到腾讯云账号，请执行[功能1]"
            pause
        fi
    else
        echo "Java环境未安装,请安装java环境后再试。"
        pause
    fi
}

# 检测域名配置
function detection_domain(){
    count=$(ls -1 "src/ReadFile/TencentDomain" 2>/dev/null | wc -l)
    if [ "$count" -eq 0 ]; then
        echo "没有域名，请执行[功能4]！"
        pause
        return
    fi
    echo "域名正常"
    build_jar
}

###############################
# 构建 jar 包（如果不存在则执行 gradle build）

function build_jar(){
    ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
    if [ -f "${ROOT_DIR}/PublicIP.jar" ]; then
        echo "PublicIP.jar 已存在，无需构建。"
        panding
        return
    fi
    echo "PublicIP.jar 不存在，开始构建..."
    gradle build
    if [ "$?" -ne 0 ]; then
        echo "构建失败，说明你没有 gradle 环境，请直接使用原来的 jar 包或自行打包"
        pause
        return
    fi
    if [ -f "${ROOT_DIR}/build/libs/PublicIP.jar" ]; then
        echo "正在移动 PublicIP.jar 到根目录..."
        mv "${ROOT_DIR}/build/libs/PublicIP.jar" "${ROOT_DIR}/"
        echo "移动完成。"
        panding
    else
        echo "未找到 build/libs/PublicIP.jar 文件，请检查构建输出。"
        pause
        return
    fi
}

###############################
# 询问是否直接运行 jar 包
function panding(){
    while true; do
        read -rp "是否直接运行？(Y/N) " ANSWER
        case "$ANSWER" in
            [Yy]* )
                start_run
                break;;
            [Nn]* )
                echo "操作已取消"
                pause
                break;;
            * )
                echo "请输入 Y 或 N";;
        esac
    done
}

###############################
# 功能8：启动运行
function start_run(){
    echo "请选择运行方式："
    echo "1、前台运行(会有日志提示，随着窗口关闭而停止运行)"
    echo "2、后台运行(没有日志提示，窗口关闭后在后台运行)"
    echo "3、配置系统运行(随系统启动，意外关闭重启)"
    echo "4、重启配置服务(新增域名或相关配置后重启服务)"
    read -rp "请输入选项（1 或 2）： " run_choice
    if [ "$run_choice" == "1" ]; then
        echo "前台运行中。"
        java -jar PublicIP.jar
        echo "结束运行"
        pause
    elif [ "$run_choice" == "2" ]; then
        echo "后台运行中。"
        nohup java -jar PublicIP.jar >/dev/null 2>&1 &
        echo "查询后台进程："
        # 这里列出包含 PublicIP.jar 的 java 进程
        pgrep -fl "PublicIP.jar"
        pause
    elif [ "$run_choice" == "3" ]; then
	# 提示用户输入路径
	APP_PATH=$(pwd)
	# 检查路径是否以斜杠结尾，如果没有则添加
	if [[ "$APP_PATH" != */ ]]; then
	  APP_PATH="$APP_PATH/"
	fi

	# 获取当前用户名
	CURRENT_USER=$(whoami)

	# 创建并写入myapp.service文件
	sudo bash -c "cat > /etc/systemd/system/myapp.service <<EOF
	[Unit]
	Description=My Java Application
	After=network.target

	[Service]
	ExecStart=/usr/bin/java -jar ${APP_PATH}PublicIP.jar
	WorkingDirectory=${APP_PATH}
	User=$CURRENT_USER
	Restart=always

	[Install]
	WantedBy=multi-user.target
EOF"

	# 重新加载systemd配置
	sudo systemctl daemon-reload

	# 启用并启动服务
	sudo systemctl enable myapp.service
	sudo systemctl start myapp.service
	echo "myapp.service 已创建并启动。"
	echo "查询后台进程："
        # 这里列出包含 PublicIP.jar 的 java 进程
        pgrep -fl "PublicIP.jar"
        pause

    elif [ "$run_choice" == "4" ]; then
    	sudo systemctl restart myapp.service
    	echo "重启服务完成，检测服务状态"
    	sudo systemctl status myapp.service
    	echo "查询后台进程："
        # 这里列出包含 PublicIP.jar 的 java 进程
        pgrep -fl "PublicIP.jar"
        pause
    else
        echo "无效选项，请重新输入。"
        pause
        start_run
    fi
}

###############################
# 功能9：后台进程检测/删除
function thread_que(){
    echo "查询后台进程："
    pgrep -fl "PublicIP.jar"
    while true; do
        read -rp "是否删除进程？(Y/N): " del_choice
        case "$del_choice" in
            [Nn]* ) return;;
            [Yy]* ) break;;
            * ) echo "请输入 Y 或 N";;
        esac
    done

    read -rp "请输入PID: " pid1
    echo "PID1=$pid1"
    if kill -0 "$pid1" 2>/dev/null; then
        echo "正在终止第一个进程..."
        kill -9 "$pid1"
    else
        echo "进程 $pid1 不存在"
    fi

    echo "进程已终止。如果进程未关闭，请手动执行命令：kill -9 <PID>"
    pause
}

###############################
# 主循环菜单
while true; do
    clear
    echo "===================================="
    echo "       腾讯云DDNS配置工具"
    echo "===================================="
    echo
    echo "1. 添加腾讯云ID和Key"
    echo "2. 删除腾讯云ID和Key"
    echo "3. 查看腾讯云ID和Key"
    echo "4. 添加域名"
    echo "5. 删除域名"
    echo "6. 查看已添加域名"
    echo "7. 环境配置检测"
    echo "8. 启动运行"
    echo "9. 后台进程检测/删除"
    echo "0. 退出"
    echo
    echo "===================================="
    read -rp "请输入选项数字（0-9）： " CHOICE

    if [ -z "$CHOICE" ]; then
        echo "错误：无效的输入，请重新输入..."
        pause
        continue
    fi

    case "$CHOICE" in
        1) add_secret ;;
        2) del_secret ;;
        3) show_secret ;;
        4) add_domain ;;
        5) del_domain ;;
        6) show_domains ;;
        7) create_service ;;
        8) start_run ;;
        9) thread_que ;;
        0) exit 0 ;;
        *) echo "错误：无效的输入，请重新选择..." ; pause ;;
    esac
done

