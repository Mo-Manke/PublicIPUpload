package top.hanlin.publicipupload.controller;


import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;


import top.hanlin.publicipupload.entity.UserInfo;
import top.hanlin.publicipupload.service.RepostService;
import top.hanlin.publicipupload.service.TencentApiService;
import top.hanlin.publicipupload.service.impl.RepostServiceImpl;
import top.hanlin.publicipupload.service.impl.TencentApiServiceImpl;

import java.util.List;

@Slf4j
@Controller
public class RepostController {
    RepostService repostService = new RepostServiceImpl();
    TencentApiService tencentApiService=new TencentApiServiceImpl();
    private boolean flag = false;
    private String status;

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
    public String addAccount(@RequestParam String name, String id, String key,Model model) {
        if (name == null || name.isEmpty()) {
            model.addAttribute("error","未选择云商");
            return  "/pages/console";
        }
        if (name.equals("1")) {
            if(tencentApiService.validateCredentials(id,key)){

                if(tencentApiService.addIdAndKey("腾讯云",id,key)){
                    status="添加成功";
                }
                return "redirect:/pages/console";
            }
            model.addAttribute("error","id或key无效，请检查");
            return  "/pages/console";
        }else {
            return  "/pages/console";
        }
        //后续添加阿里
//        if(name.equals("2")){
//
//        }
    }

//        @PostMapping("/getAllInformation")
//        public


}
