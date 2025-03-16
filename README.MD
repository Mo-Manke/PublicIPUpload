# WindowsPublicIP 项目说明文档

## 项目简介
WindowsPublicIP 是一个用于获取和更新公网 IPv4 地址的 Java 项目。它支持通过腾讯云的 DNS 服务来实现动态域名系统 (DDNS) 功能。该项目可以定时检查并更新域名解析记录，以确保域名始终指向当前的公网 IP 地址。

## 功能特点
- 获取本机的公网 IPv4 地址。
- 通过腾讯云 API 更新域名解析记录。
- 支持定时任务，自动更新域名解析。
- 提供命令行工具进行配置和管理。

## 项目环境
- JDK 21.0.5
- Gradle 8.5
- 腾讯云API SDK 3.1.5
- 其他环境兼容性问题自测

## 文件结构
```
WindowsPublicIP
├── A.sh             #Ubuntu运行脚本
├── A.bat            # Windows运行脚本
├── build.gradle             # Gradle 构建脚本
├── gradle
│   └── wrapper
│       └── gradle-wrapper.properties
├── gradlew                  # Gradle 包装器
├── gradlew.bat              # Windows 环境下的 Gradle 包装器
├── settings.gradle          # Gradle 设置脚本
└── src
    ├── main
    │   └── java
    │       └── com
    │           └── hanlin
    │               ├── DDNS.java            # DDNS 功能实现
    │               ├── DomainIP.java        # 域名 IP 记录类
    │               ├── PublicIpv4Upload.java# 主程序入口
    │               └── util
    │                   ├── readConfig.java   # 配置读取工具
    │                   ├── readDomain.java   # 域名读取工具
    │                   └── readIdAndKey.java# 腾讯云 ID 和 Key 读取工具
    └── ReadFile
        ├── IdAndKey   # 腾讯云 ID 和 Key 文件
        └── TencentDomain  # 域名文件
```

## 使用指南

### 环境配置
在运行项目之前，请确保已安装 Java 和 Gradle。可以通过以下命令检查是否已安装：
```shell
java -version
```

### 配置腾讯云账号
1. 在 `src/ReadFile/IdAndKey` 目录下添加腾讯云的 ID 和 Key。
2. 运行 `A运行文件.bat` 脚本，选择“添加腾讯云ID和Key”选项进行配置。

### 添加域名
1. 运行 `A运行文件.bat` 脚本，选择“添加域名”选项。
2. 输入要添加的域名，例如 `example.com`。

### 启动项目
1. 运行 `A运行文件.bat` 脚本，选择“启动运行”选项。
2. 选择前台或后台运行方式。

### 后台进程管理
1. 运行 `A运行文件.bat` 脚本，选择“后台进程检测/删除”选项。
2. 可以查看或终止后台运行的进程。

## 注意事项
- 请确保腾讯云账号的 ID 和 Key 的安全性，不要泄露。
- 定时任务的执行间隔可以根据实际需求进行调整。
- 项目运行过程中可能会产生网络请求，请确保网络连接正常。

## 贡献者
- 项目由 Mo-Manke 开发和维护。

## 许可证
- 本项目遵循 MIT 许可证。

## 联系方式
- 如有问题或需要帮助，请通过项目的 Issue 跟踪器提交。

---

请注意，本文档中已删除所有个人可识别信息（PII）和网站超链接，以保护隐私和安全。