package com.hanlin.util;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

/**
 * 作者: 霖洛洛
 * 日期: 2025年03月03日
 * 联系：865075128@qq.com
 * 描述: 读取域名
 */
public class readDomain {

    public static String[] TencentDomain;
    public readDomain(){
        TencentDomain=temp();
    }
    public String[] temp(){
        List<String> fileList = new ArrayList<>();
        String directoryPath = "src/ReadFile/TencentDomain";
        Path directory = Paths.get(directoryPath);
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(directory)) {
            for (Path path : stream) {
                if (Files.isRegularFile(path)) {
                    // 获取文件名并去除扩展名
                    String fileName = path.getFileName().toString();
                    fileList.add(fileName);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return fileList.toArray(new String[0]);
    }
}
