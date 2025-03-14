package com.hanlin;

import cn.hutool.core.lang.Console;
import cn.hutool.cron.CronUtil;
import cn.hutool.cron.task.Task;
import com.hanlin.util.readConfig;
import com.hanlin.util.readDomain;
import com.hanlin.util.readIdAndKey;

public class PublicIpv4Upload {
    // 私有静态变量，用于存储腾讯云账号的SecretId
    private static  String SECRET_ID ;
    // 腾讯云账号secretKey
    private static  String SECRET_KEY ;
    // 腾讯云解析的域名
    private static  String[] DOMAIN ;
    // 腾讯云解析的子域名(如果有，请自行修改，在getServerIP()方法下)


    /**
     * 作者: 霖洛洛
     * 日期: 2025年03月03日
     * 联系：865075128@qq.com
     * 描述: 这是启动程序
     */
    public static void main(String[] args) {
        new readConfig();
        String[] tencentIdKey = readIdAndKey.TencentIdKey;
        DOMAIN= readDomain.TencentDomain;
        SECRET_ID= tencentIdKey[0];
        SECRET_KEY= tencentIdKey[1];
        //动态定时任务
        //每10分钟执行一次
        CronUtil.schedule("0 */10 * * * * ", new Task() {

            @Override
            public void execute() {

                //如果不通了  返回false
                new DDNS(SECRET_ID,SECRET_KEY,DOMAIN);
            }
        });
        // 支持秒级别定时任务
        CronUtil.setMatchSecond(true);
        CronUtil.start();
        // 防止主线程退出
        while (true) {
            try {
                Thread.sleep(1000); // 主线程休眠，避免占用过多CPU
            } catch (InterruptedException e) {
                Console.log("Main thread interrupted: " + e.getMessage());
            }
        }

    }
}
