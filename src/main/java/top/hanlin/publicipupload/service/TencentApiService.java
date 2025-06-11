package top.hanlin.publicipupload.service;

import org.springframework.web.bind.annotation.RequestParam;
import top.hanlin.publicipupload.model.ApiResponse;

public interface TencentApiService {
    /**
     * 校验腾讯云id和key是否可用
     * @param secretId 腾讯云id
     * @param secretKey 腾讯云key
     * @return 成功true 失败false
     */
    boolean validateCredentials(String secretId,String secretKey);

    /**
     *添加id和key到本地
     * @param secretId 腾讯云id
     * @param secretKey 腾讯云key
     * @return 是否添加成功
     */
    boolean addIdAndKey(String name,String secretId,String secretKey);
    ApiResponse<?> getDescribeDomainList(String id , String key  );
    ApiResponse<?> getModifyDomainStatus(String id , String key,String domain,String status);
}
