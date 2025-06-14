package top.hanlin.publicipupload.controller;


import com.tencentcloudapi.common.AbstractModel;
import com.tencentcloudapi.common.Credential;
import com.tencentcloudapi.common.exception.TencentCloudSDKException;
import com.tencentcloudapi.common.profile.ClientProfile;
import com.tencentcloudapi.common.profile.HttpProfile;
import com.tencentcloudapi.dnspod.v20210323.DnspodClient;
import com.tencentcloudapi.dnspod.v20210323.models.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import top.hanlin.publicipupload.entity.UserInfo;
import top.hanlin.publicipupload.model.ApiResponse;

import java.lang.reflect.Parameter;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

import static top.hanlin.publicipupload.controller.RepostController.flag;

@Slf4j
@RestController
@RequestMapping("/api/tencent")
public class TencentApiController {
    @PostMapping("/DeleteDomain")
    public Object getDeleteDomain(@RequestParam String id,String key,String domain){
        try{
            log.info("删除域名");
            // 实例化一个认证对象，入参需要传入腾讯云账户 SecretId 和 SecretKey，此处还需注意密钥对的保密
            // 代码泄露可能会导致 SecretId 和 SecretKey 泄露，并威胁账号下所有资源的安全性
            // 以下代码示例仅供参考，建议采用更安全的方式来使用密钥
            // 请参见：https://cloud.tencent.com/document/product/1278/85305
            // 密钥可前往官网控制台 https://console.cloud.tencent.com/cam/capi 进行获取
            Credential cred = new Credential(id, key);
            // 使用临时密钥示例
            // Credential cred = new Credential("SecretId", "SecretKey", "Token");
            // 实例化一个http选项，可选的，没有特殊需求可以跳过
            HttpProfile httpProfile = new HttpProfile();
            httpProfile.setEndpoint("dnspod.tencentcloudapi.com");
            // 实例化一个client选项，可选的，没有特殊需求可以跳过
            ClientProfile clientProfile = new ClientProfile();
            clientProfile.setHttpProfile(httpProfile);
            // 实例化要请求产品的client对象,clientProfile是可选的
            DnspodClient client = new DnspodClient(cred, "", clientProfile);
            // 实例化一个请求对象,每个接口都会对应一个request对象
            DeleteDomainRequest req = new DeleteDomainRequest();
            req.setDomain(domain);
            // 返回的resp是一个DeleteDomainResponse的实例，与请求对象对应
            DeleteDomainResponse resp = client.DeleteDomain(req);
            // 输出json格式的字符串回包
            return ApiResponse.success(Collections.singletonList(resp));
        } catch (TencentCloudSDKException e) {
            log.error("腾讯云 API 调用失败", e);
            return ApiResponse.error(e.getMessage());
        }

    }

    @PostMapping("/ModifyDomainStatus")
    public Object getModifyDomainStatus(@RequestParam String id ,String key ,String domain,String status){
        log.info("修改域名转态id{},key{},domain{},status{}",id,key,domain,status);
        try{
            // 实例化一个认证对象，入参需要传入腾讯云账户 SecretId 和 SecretKey，此处还需注意密钥对的保密
            // 代码泄露可能会导致 SecretId 和 SecretKey 泄露，并威胁账号下所有资源的安全性
            // 以下代码示例仅供参考，建议采用更安全的方式来使用密钥
            // 请参见：https://cloud.tencent.com/document/product/1278/85305
            // 密钥可前往官网控制台 https://console.cloud.tencent.com/cam/capi 进行获取
            Credential cred = new Credential(id, key);
            // 使用临时密钥示例
            // Credential cred = new Credential("SecretId", "SecretKey", "Token");
            // 实例化一个http选项，可选的，没有特殊需求可以跳过
            HttpProfile httpProfile = new HttpProfile();
            httpProfile.setEndpoint("dnspod.tencentcloudapi.com");
            // 实例化一个client选项，可选的，没有特殊需求可以跳过
            ClientProfile clientProfile = new ClientProfile();
            clientProfile.setHttpProfile(httpProfile);
            // 实例化要请求产品的client对象,clientProfile是可选的
            DnspodClient client = new DnspodClient(cred, "", clientProfile);
            // 实例化一个请求对象,每个接口都会对应一个request对象
            ModifyDomainStatusRequest req = new ModifyDomainStatusRequest();
            req.setDomain(domain);
            status = status.toLowerCase();
            System.out.println(status);
            req.setStatus(status.equals("enable")?"disable":"enable");

            // 返回的resp是一个ModifyDomainStatusResponse的实例，与请求对象对应
            ModifyDomainStatusResponse resp = client.ModifyDomainStatus(req);
            // 输出json格式的字符串回包
            return ApiResponse.success(Collections.singletonList(resp));
        } catch (TencentCloudSDKException e) {
            log.error("腾讯云 API 调用失败", e);
            return ApiResponse.error(e.getMessage());
        }
    }
    @PostMapping("/CreateDomain")
    public Object getCreateDomain(@RequestParam String id ,String key ,String domain){
        log.info("添加域名");
        try{
            // 实例化一个认证对象，入参需要传入腾讯云账户 SecretId 和 SecretKey，此处还需注意密钥对的保密
            // 代码泄露可能会导致 SecretId 和 SecretKey 泄露，并威胁账号下所有资源的安全性
            // 以下代码示例仅供参考，建议采用更安全的方式来使用密钥
            // 请参见：https://cloud.tencent.com/document/product/1278/85305
            // 密钥可前往官网控制台 https://console.cloud.tencent.com/cam/capi 进行获取
            Credential cred = new Credential(id, key);
            // 使用临时密钥示例
            // Credential cred = new Credential("SecretId", "SecretKey", "Token");
            // 实例化一个http选项，可选的，没有特殊需求可以跳过
            HttpProfile httpProfile = new HttpProfile();
            httpProfile.setEndpoint("dnspod.tencentcloudapi.com");
            // 实例化一个client选项，可选的，没有特殊需求可以跳过
            ClientProfile clientProfile = new ClientProfile();
            clientProfile.setHttpProfile(httpProfile);
            // 实例化要请求产品的client对象,clientProfile是可选的
            DnspodClient client = new DnspodClient(cred, "", clientProfile);
            // 实例化一个请求对象,每个接口都会对应一个request对象
            CreateDomainRequest req = new CreateDomainRequest();
            //需要添加的域名
            req.setDomain(domain);
            // 返回的resp是一个CreateDomainResponse的实例，与请求对象对应
            CreateDomainResponse resp = client.CreateDomain(req);
            // 输出json格式的字符串回包
            return ApiResponse.success(Collections.singletonList(resp));
        } catch (TencentCloudSDKException e) {
            log.error("腾讯云 API 调用失败", e);
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/DescribeDomainList")
    public Object getDescribeDomainList(@RequestParam String id ,String key  ) {
//        if (!flag) {
//            log.info("未登录");
//            return  "redirect:/pages/console";
//        }
        log.info("获取所有解析域名 id: {}, key: {}", id, key);

        try{
            // 实例化一个认证对象，入参需要传入腾讯云账户 SecretId 和 SecretKey，此处还需注意密钥对的保密
            // 代码泄露可能会导致 SecretId 和 SecretKey 泄露，并威胁账号下所有资源的安全性
            // 以下代码示例仅供参考，建议采用更安全的方式来使用密钥
            // 请参见：https://cloud.tencent.com/document/product/1278/85305
            // 密钥可前往官网控制台 https://console.cloud.tencent.com/cam/capi 进行获取
            Credential cred = new Credential(id, key);
            HttpProfile httpProfile = new HttpProfile();
            httpProfile.setEndpoint("dnspod.tencentcloudapi.com");
            // 实例化一个client选项，可选的，没有特殊需求可以跳过
            ClientProfile clientProfile = new ClientProfile();
            clientProfile.setHttpProfile(httpProfile);
            // 实例化要请求产品的client对象,clientProfile是可选的
            DnspodClient client = new DnspodClient(cred, "", clientProfile);
            // 实例化一个请求对象,每个接口都会对应一个request对象
            DescribeDomainListRequest req = new DescribeDomainListRequest();

            // 返回的resp是一个DescribeDomainListResponse的实例，与请求对象对应
            DescribeDomainListResponse resp = client.DescribeDomainList(req);
            // 输出json格式的字符串回包
//            System.out.println(AbstractModel.toJsonString(resp));
            return ApiResponse.success(Collections.singletonList(resp));
        } catch (TencentCloudSDKException e) {
            log.error("腾讯云 API 调用失败", e);
            return ApiResponse.error(e.getMessage());
        }
    }

}
