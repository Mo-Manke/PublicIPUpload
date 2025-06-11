package top.hanlin.publicipupload.controller;


import com.tencentcloudapi.dnspod.v20210323.models.DescribeDomainListResponse;
import com.tencentcloudapi.dnspod.v20210323.models.DomainInfo;
import com.tencentcloudapi.dnspod.v20210323.models.DomainListItem;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;


import top.hanlin.publicipupload.model.ApiResponse;
import top.hanlin.publicipupload.model.Domain;
import top.hanlin.publicipupload.entity.UserInfo;
import top.hanlin.publicipupload.service.RepostService;
import top.hanlin.publicipupload.service.TencentApiService;
import top.hanlin.publicipupload.service.impl.RepostServiceImpl;
import top.hanlin.publicipupload.service.impl.TencentApiServiceImpl;

import java.util.Arrays;
import java.util.List;

@Slf4j
@Controller
public class RepostController {
    RepostService repostService = new RepostServiceImpl();
    TencentApiService tencentApiService=new TencentApiServiceImpl();
    public static boolean flag = false;
    private String status;
    private String error;

    @PostMapping("/ModifyDomainStatus")
    public String getModifyDomainStatus(@RequestParam String type, String id, String key, String domain,String status,Model model){
        log.info("修改域名状态 type: {},id: {}, key: {}domain{},status:{}", type,id, key,domain,status);
        if(type.equals("1")){
            ApiResponse<?> modifyDomainStatus = tencentApiService.getModifyDomainStatus(id, key, domain, status);
            if(modifyDomainStatus.getCode()!=200){
                model.addAttribute("error", "id或key错误");
                System.out.println("到这1");
                return "pages/domainList";
            }
            System.out.println("到这2");
            return "pages/domainList";
        }
        System.out.println("到这3");
        return "redirect:pages/domainList";
    }

    @PostMapping("/domainList")
    public String getDomainList(@RequestParam String type, String id, String key,
                                Model model) {
        log.info("获取所有解析域名 id: {}, key: {}", id, key);
        // 这里可以调用服务层根据 type, id, key 查询数据
        if(type.equals("1")){
            ApiResponse<?> describeDomainList = tencentApiService.getDescribeDomainList(id, key);
            if(describeDomainList.getCode()!=200){
                model.addAttribute("error", "id或key错误");
                return "pages/domainList";
            }

// 获取 DescribeDomainListResponse 列表（通常是一个元素）
            List<DescribeDomainListResponse> dataList = (List<DescribeDomainListResponse>) describeDomainList.getData();

// 提取 domainList
            DomainListItem[] domainList = dataList.get(0).getDomainList();

            model.addAttribute("domainList", domainList);
            return "pages/domainList";
        }




        // 示例数据
        model.addAttribute("domains", Arrays.asList(
                new Domain("example.com", "已解析", "基础版", "2023-05-15 10:30"),
                new Domain("test.com", "未解析", "无", "2023-06-01 09:00")
        ));
        return "pages/domainList";
    }

    @GetMapping("/addDomain")
    public String test2(Model model) {
        model.addAttribute("status", status);
        error=null;
        status=null;

        return "pages/addDomain";
    }
    @GetMapping("/lock")
    public String getLock() {
        log.info("密码上锁");
        flag=false;
        return "redirect:/pages/console";
    }
    @PostMapping("/modify/password")
    public String modifyPassword(@RequestParam String password ,String modify) {
        log.info("修改密码");
        if(repostService.login(password)){
            status="修改成功";
            repostService.modifyPassword(modify);
        }else {
            error="原密码不正确，修改失败";
        }

        return "redirect:/pages/console";
    }


    // 新增这个方法
    @GetMapping("/pages/console")
    public String console(Model model) {
        if (!flag) {
            model.addAttribute("error", "请登录");
            return "index";
        }
        List<UserInfo> allUser = repostService.getAllUser();
        model.addAttribute("status", status);
        model.addAttribute("users", allUser);

        return "pages/console";
    }

    @GetMapping("/")
    public String index() {
        return "index";  // 返回templates目录下的index.html模板
    }


    @PostMapping("/login")
    public String login(@RequestParam String password, Model model) {
        log.info("前端密码" + password);
        boolean results = repostService.login(password);
        if (results) {
            flag = true;
            status="登录成功";
            return "redirect:/pages/console";
        } else {
            model.addAttribute("password", password);
            model.addAttribute("error", "用户名或密码错误");
            return "index"; // 返回登录页
        }
    }

    /**
     * @param name 腾讯云或阿里云
     * @param id   id
     * @param key  key
     * @return
     */
    @PostMapping("/addAccount")
    public String addAccount(@RequestParam String name, String id, String key, Model model) {
        log.info("添加腾讯云或阿里云id和key"+name+id+key);
        if (name == null || name.isEmpty()) {
            model.addAttribute("error", "未选择云商");
            model.addAttribute("users", repostService.getAllUser()); // 确保 users 存在
            return "pages/console";
        }
        if (name.equals("1")) {
            if(tencentApiService.validateCredentials(id,key)){
                if(tencentApiService.addIdAndKey("腾讯云",id,key)){
                    status="添加成功";
                } else {
                    error="添加失败";
                }
                return "redirect:/pages/console";
            }
            model.addAttribute("error","id或key无效，请检查");
            model.addAttribute("users", repostService.getAllUser());
            return "pages/console";
        } else {
            model.addAttribute("users", repostService.getAllUser());
            return "pages/console";
        }
    }

//        @PostMapping("/getAllInformation")
//        public


}
