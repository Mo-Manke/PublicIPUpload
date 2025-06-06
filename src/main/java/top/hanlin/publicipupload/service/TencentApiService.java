package top.hanlin.publicipupload.service;

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
}
