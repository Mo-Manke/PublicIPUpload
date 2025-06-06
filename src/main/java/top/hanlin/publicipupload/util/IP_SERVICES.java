package top.hanlin.publicipupload.util;

public enum IP_SERVICES {

    AMAZON("http://checkip.amazonaws.com"),
    ICAHNZ("http://icanhazip.com"),
    IFCONFIG("http://ifconfig.me/ip"),
    IPIO("http://ipinfo.io/ip");

    private final String url;

    IP_SERVICES(String url) {
        this.url = url;
    }

    public String getUrl() {
        return url;
    }
}
