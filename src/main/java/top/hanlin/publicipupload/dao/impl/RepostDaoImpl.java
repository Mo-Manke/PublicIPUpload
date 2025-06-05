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

        return content.toString();
    }
}
