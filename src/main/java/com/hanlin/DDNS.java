package com.hanlin;

import cn.hutool.core.lang.Console;
import com.tencentcloudapi.common.Credential;
import com.tencentcloudapi.common.exception.TencentCloudSDKException;
import com.tencentcloudapi.common.profile.ClientProfile;
import com.tencentcloudapi.common.profile.HttpProfile;
import com.tencentcloudapi.dnspod.v20210323.DnspodClient;
import com.tencentcloudapi.dnspod.v20210323.models.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
/**
 * 作者: 霖洛洛
 * 日期: 2025年03月03日
 * 联系：865075128@qq.com
 * 描述: IPV4更新逻辑
 */
public class DDNS {
    // 缓存的IP地址
    private static String cachedIP ;
    // 存储域名和IP的列表
    static ArrayList<DomainIP> domainIPList = new ArrayList<DomainIP>();
    // 认证信息
    static Credential cred;
    // HTTP配置
    static HttpProfile httpProfile = new HttpProfile();
    // 当前日期
    static Date data = new Date();

    // 实例化一个client选项，可选的，没有特殊需求可以跳过
    static ClientProfile clientProfile = new ClientProfile();

    // 构造函数，初始化认证信息和域名列表
    public DDNS(String SECRET_ID,String SECRET_KEY,String[] DOMAIN){

        // 获取当前公网IP
        getPublicIP();
        // 初始化认证信息
        cred = new Credential(SECRET_ID, SECRET_KEY);
        // 遍历域名列表
        for (int i = 0; i < DOMAIN.length; i++) {
            // 获取域名对应的IP记录
            getServerIP(DOMAIN[i]);
            // 遍历IP记录列表
            for (int j = 0; j < domainIPList.size(); j++) {
                // 更新DNS记录
                ddns(DOMAIN[i],domainIPList.get(j));
            }
            // 清空IP记录列表
            domainIPList.clear();
        }


    }
    // 更新DNS记录
    public static void ddns(String DOMAIN, DomainIP domainIP){

        try{
            // 实例化一个认证对象，入参需要传入腾讯云账户secretId，secretKey,此处还需注意密钥对的保密
            // 密钥可前往https://console.cloud.tencent.com/cam/capi网站进行获取
            httpProfile.setEndpoint("dnspod.tencentcloudapi.com");
            // 实例化一个http选项，可选的，没有特殊需求可以跳过
            clientProfile.setHttpProfile(httpProfile);

            // 实例化要请求产品的client对象,clientProfile是可选的
            DnspodClient client = new DnspodClient(cred, "", clientProfile);
            // 实例化一个请求对象,每个接口都会对应一个request对象
            ModifyRecordRequest req = new ModifyRecordRequest();
            req.setDomain(DOMAIN);
            req.setRecordType(domainIP.getType());
            req.setRecordLine("默认");
            //获取本机的公网ipv4地址
            req.setValue(cachedIP);
            Console.log("新的ip是："+cachedIP);
            req.setRecordId(domainIP.getRecordId());
            if(!domainIP.getName().equals("@")){
                req.setSubDomain(domainIP.getName());
            }
            req.setRemark(data+"");

            // 返回的resp是一个ModifyRecordResponse的实例，与请求对象对应
            ModifyRecordResponse resp = client.ModifyRecord(req);
            // 输出json格式的字符串回包
//            Console.log(ModifyRecordResponse.toJsonString(resp));
            ModifyRecordResponse.toJsonString(resp);
        } catch (TencentCloudSDKException e) {
            Console.log(e.toString());
        }
    }
    public static void getPublicIP() {
        for (String service : IP_SERVICES) {
            try {
                URL url = new URL(service);
                BufferedReader in = new BufferedReader(new InputStreamReader(url.openStream()));
                String ip = in.readLine();
                in.close();

                // 检查IP地址是否有效
                if (ip != null && !ip.isEmpty()) {
                    // 如果缓存中的IP与当前获取的IP不同，则更新缓存
                    if (!ip.equals(cachedIP)) {
                        System.out.println("缓存IP是: " + cachedIP + ", 查询本地公网IP: " + ip);
                        cachedIP = ip;
                    }
                    return;
                }
            } catch (IOException e) {
                // 当前服务不可用，尝试下一个服务
                System.err.println("Service unavailable: " + service);
            }
        }
        System.out.println("所有服务不可用");
    }

    private static void getServerIP(String DOMAIN){
        try {


            // 实例化一个 http 选项，可选的，没有特殊需求可以跳过
            httpProfile.setEndpoint("dnspod.tencentcloudapi.com");

            // 实例化一个 client 选项，可选的，没有特殊需求可以跳过
            clientProfile.setHttpProfile(httpProfile);

            // 实例化要请求产品的 client 对象，clientProfile 是可选的
            DnspodClient client = new DnspodClient(cred, "", clientProfile);

            // 实例化一个请求对象
            DescribeRecordListRequest req = new DescribeRecordListRequest();

            // 设置请求参数，这里需要替换为你要查询的域名
            req.setDomain(DOMAIN);
            // 可根据需要设置子域名，若不设置则查询主域名下所有记录


            // 通过 client 对象调用 DescribeRecordList 接口，得到响应对象
            DescribeRecordListResponse resp = client.DescribeRecordList(req);

            // 获取解析记录列表
            RecordListItem[] recordList = resp.getRecordList();
            if (recordList != null) {
                for (int i = 0; i < recordList.length; i++) {
                    inputDomainIPList(recordList[i]);
                    System.out.println("记录类型: " + recordList[i].getType() +
                            ", 主机记录: " + recordList[i].getName() +
                            ", 记录值: " + recordList[i].getValue() +
                            ", RecordId: " + recordList[i].getRecordId());
                }
            }
        } catch (TencentCloudSDKException e) {
            System.out.println(e.toString());
        }
        for (int i = 0; i < domainIPList.size(); i++) {
            System.out.println(domainIPList.get(i).toString());
        }

    }

    private static void inputDomainIPList(RecordListItem recordList){
        String Type= recordList.getType();
        String Name= recordList.getName();
        String Value= recordList.getValue();
        Long RecordId= recordList.getRecordId();

        if(domainIPList.isEmpty()){
            if(!Type.equals("NS")){
                domainIPList.add(new DomainIP(Type,Name,Value,RecordId));
            }
        }else {
            if(!Type.equals("NS")){
                for (int j = 0; j < domainIPList.size(); j++) {
                    if(domainIPList.get(j).getRecordId().equals(RecordId)){
                        domainIPList.get(j).setValue(Value);
                        domainIPList.get(j).setName(Name);
                        domainIPList.get(j).setType(Type);
                    }else {
                        domainIPList.add(new DomainIP(Type,Name,Value,RecordId));
                    }
                }
            }
        }
    }
    private static final String[] IP_SERVICES = {
            "http://checkip.amazonaws.com",
            "http://icanhazip.com",
            "http://ifconfig.me/ip",
            "http://ipinfo.io/ip"
    };
}
