package top.hanlin.publicipupload.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInfo {
    private String name;
    private String id;
    private String key;

    @Override
    public String toString() {
        return  name +
                "id:" + id+
                "key:" + key;
    }
}
