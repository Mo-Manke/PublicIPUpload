package com.hanlin;
/**
 * 作者: 霖洛洛
 * 日期: 2025年03月03日
 * 联系：865075128@qq.com
 * 描述: 这是数据类
 */
public class DomainIP {
    private String Type;
    private String Name;
    private String Value;
    private Long RecordId;

    public DomainIP() {
    }

    public DomainIP(String type, String name, String value, Long recordId) {
        Type = type;
        Name = name;
        Value = value;
        RecordId = recordId;
    }

    public String getType() {
        return Type;
    }

    public void setType(String type) {
        Type = type;
    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }

    public String getValue() {
        return Value;
    }

    public void setValue(String value) {
        Value = value;
    }

    public Long getRecordId() {
        return RecordId;
    }

    public void setRecordId(Long recordId) {
        RecordId = recordId;
    }

    @Override
    public String toString() {
        return "DomainIP{" +
                "Type='" + Type + '\'' +
                ", Name='" + Name + '\'' +
                ", Value='" + Value + '\'' +
                ", RecordId='" + RecordId + '\'' +
                '}';
    }
}
