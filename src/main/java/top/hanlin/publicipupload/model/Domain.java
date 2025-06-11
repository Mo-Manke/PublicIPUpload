package top.hanlin.publicipupload.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Domain {
    private String name;
    private String status;
    private String packageType;
    private String lastUpdated;
}
