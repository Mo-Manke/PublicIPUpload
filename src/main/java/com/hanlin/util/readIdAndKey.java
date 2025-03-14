package com.hanlin.util;
import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
/**
 * 作者: 霖洛洛
 * 日期: 2025年03月03日
 * 联系：865075128@qq.com
 * 描述: 读取腾讯云ID和Key
 */
public class readIdAndKey {
    public static String[] TencentIdKey;

    public readIdAndKey(){
        TencentIdKey= temp();
    }
    public String[] temp(){
        String[] TencentIdKey = new String[2];
        // 指定目录路径
        String directoryPath = "src/ReadFile/IdAndKey";
        Path directory = Paths.get(directoryPath);

        try (DirectoryStream<Path> stream = Files.newDirectoryStream(directory)) {
            for (Path path : stream) {
                if (Files.isDirectory(path)) {
                    // 获取并打印文件夹名
                    TencentIdKey[0]= String.valueOf(path.getFileName());

                    // 遍历文件夹下的文件
                    try (DirectoryStream<Path> fileStream = Files.newDirectoryStream(path)) {
                        for (Path filePath : fileStream) {
                            if (Files.isRegularFile(filePath)) {
                                // 获取文件名并去除扩展名
                                String fileName = filePath.getFileName().toString();
                                int dotIndex = fileName.lastIndexOf('.');
                                if (dotIndex > 0) {
                                    fileName = fileName.substring(0, dotIndex);
                                }
                                // 打印文件名（不含扩展名）
                                TencentIdKey[1]=fileName;
                            }
                        }
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return TencentIdKey;

    }

}
