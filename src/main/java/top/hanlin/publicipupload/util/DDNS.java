package top.hanlin.publicipupload.util;

import java.io.*;
import java.net.URL;
import java.util.Date;

public class DDNS {

    // 获取公网IP的方法
    public static String getPublicIP() {
        for (IP_SERVICES service : IP_SERVICES.values()) {
            try {
                URL url = new URL(service.getUrl());
                BufferedReader in = new BufferedReader(new InputStreamReader(url.openStream()));
                String ip = in.readLine();
                in.close();

                // 检查IP地址是否有效
                if (ip != null && !ip.isEmpty()) {
                    return ip; // 成功获取后退出方法
                }
            } catch (IOException e) {
                // 当前服务不可用，尝试下一个服务
                System.err.println("Service unavailable: " + service.name());
            }
        }
        System.out.println("所有服务不可用");
        return "";
    }

}
