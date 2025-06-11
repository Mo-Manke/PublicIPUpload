package top.hanlin.publicipupload.service.impl;

import com.tencentcloudapi.common.Credential;
import com.tencentcloudapi.common.exception.TencentCloudSDKException;
import com.tencentcloudapi.common.profile.ClientProfile;
import com.tencentcloudapi.common.profile.HttpProfile;
import com.tencentcloudapi.cvm.v20170312.CvmClient;
import com.tencentcloudapi.cvm.v20170312.models.DescribeInstancesRequest;
import com.tencentcloudapi.cvm.v20170312.models.DescribeInstancesResponse;
import com.tencentcloudapi.dnspod.v20210323.DnspodClient;
import com.tencentcloudapi.dnspod.v20210323.models.DescribeDomainListRequest;
import com.tencentcloudapi.dnspod.v20210323.models.DescribeDomainListResponse;
import com.tencentcloudapi.dnspod.v20210323.models.ModifyDomainStatusRequest;
import com.tencentcloudapi.dnspod.v20210323.models.ModifyDomainStatusResponse;
import top.hanlin.publicipupload.dao.FileOperationDao;
import top.hanlin.publicipupload.dao.impl.FileOperationDaoImpl;
import top.hanlin.publicipupload.model.ApiResponse;
import top.hanlin.publicipupload.service.TencentApiService;

import java.util.Collections;

public class TencentApiServiceImpl implements TencentApiService {
    FileOperationDao fileOperationDao=new FileOperationDaoImpl();
    @Override
    public boolean validateCredentials(String secretId,String secretKey) {
        try {
            // 初始化认证信息
            Credential cred = new Credential(secretId, secretKey);

            // 设置请求的地域
            String region = "ap-guangzhou";

            // 初始化 HTTP 配置
            HttpProfile httpProfile = new HttpProfile();
            httpProfile.setEndpoint("cvm.tencentcloudapi.com");

            // 初始化客户端配置
            ClientProfile clientProfile = new ClientProfile();
            clientProfile.setHttpProfile(httpProfile);

            // 创建客户端
            CvmClient client = new CvmClient(cred, region, clientProfile);

            // 创建请求对象
            DescribeInstancesRequest req = new DescribeInstancesRequest();

            // 发送请求
            DescribeInstancesResponse resp = client.DescribeInstances(req);

            // 打印返回结果
            System.out.println(DescribeInstancesResponse.toJsonString(resp));
            return true;
        } catch (TencentCloudSDKException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean addIdAndKey(String name,String secretId, String secretKey) {
        return fileOperationDao.addIdAndKey(name,secretId,secretKey);
    }

    @Override
    public ApiResponse<?> getDescribeDomainList(String id, String key) {
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
            return ApiResponse.error(e.getMessage());
        }
    }

    @Override
    public ApiResponse<?> getModifyDomainStatus(String id, String key,String domain,String status) {
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
            req.setStatus(status.equals("enable")?"disable":"enable");

            // 返回的resp是一个ModifyDomainStatusResponse的实例，与请求对象对应
            ModifyDomainStatusResponse resp = client.ModifyDomainStatus(req);
            // 输出json格式的字符串回包
            System.out.println(Collections.singletonList(resp));
            return ApiResponse.success(Collections.singletonList(resp));
        } catch (TencentCloudSDKException e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}
