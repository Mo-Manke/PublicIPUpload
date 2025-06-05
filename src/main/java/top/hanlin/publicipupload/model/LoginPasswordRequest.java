package top.hanlin.publicipupload.model;

public class LoginPasswordRequest {
    private String password;

    public LoginPasswordRequest() {
    }

    public LoginPasswordRequest(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
