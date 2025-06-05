package top.hanlin.publicipupload.model;

import java.util.List;

public class ApiResponse<T> {
    private int code;
    private String message;
    private List<T> data;

    public ApiResponse() {
    }

    public ApiResponse(int code, String message, List<T> data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public static <T> ApiResponse<T> success(List<T> data) {
        return new ApiResponse<>(200, "成功", data);
    }
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(200, message, null);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(500, message, null);
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<T> getData() {
        return data;
    }

    public void setData(List<T> data) {
        this.data = data;
    }
} 