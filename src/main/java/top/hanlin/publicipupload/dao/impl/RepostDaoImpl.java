package top.hanlin.publicipupload.dao.impl;

import top.hanlin.publicipupload.dao.RepostDao;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class RepostDaoImpl implements RepostDao {
    @Override
    public String getPassword() {
        File file = new File("password"); // 根目录下的 password 文件

        // 如果文件不存在，则创建新文件并写入默认内容
        if (!file.exists()) {
            createCloudFolders();
            try (FileWriter writer = new FileWriter(file)) {
                writer.write("123456");
            } catch (IOException e) {
                e.printStackTrace();
                return ""; // 创建失败时返回空字符串
            }
        }

        // 读取文件内容
        StringBuilder content = new StringBuilder();
        try (FileReader reader = new FileReader(file)) {
            int c;
            while ((c = reader.read()) != -1) {
                content.append((char) c);
            }
        } catch (IOException e) {
            e.printStackTrace();
            return "";
        }
        System.out.println(content.toString());
        return content.toString();
    }
    private void createCloudFolders() {
        // 创建 "腾讯云" 文件夹
        File tencentFolder = new File("腾讯云");
        if (!tencentFolder.exists()) {
            boolean isCreated = tencentFolder.mkdir(); // 创建单层目录
            if (!isCreated) {
                System.out.println("腾讯云 文件夹创建失败");
            }
        }

        // 创建 "阿里云" 文件夹
        File aliyunFolder = new File("阿里云");
        if (!aliyunFolder.exists()) {
            boolean isCreated = aliyunFolder.mkdir(); // 创建单层目录
            if (!isCreated) {
                System.out.println("阿里云 文件夹创建失败");
            }
        }
    }
}
