package top.hanlin.publicipupload.controller;


import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import top.hanlin.publicipupload.model.LoginPasswordRequest;
import top.hanlin.publicipupload.service.RepostService;
import top.hanlin.publicipupload.service.impl.RepostServiceImpl;

import java.util.Map;

@Slf4j
@Controller
public class RepostController {
        RepostService repostService =new RepostServiceImpl();

        @GetMapping("/")
        public String index() {
                return "index";  // 返回templates目录下的index.html模板
        }


        @PostMapping("/login")
        public String login(@RequestBody LoginPasswordRequest loginPasswordRequest, Model model){
                String password=loginPasswordRequest.getPassword();
                log.info("前端密码"+password);
                boolean results=repostService.login(password);
                System.out.println(results);
                if(results){
                        model.addAttribute("password",password);
                        return "redirect:/pages/test";
                }else {
                        model.addAttribute("error", "用户名或密码错误");
                        return "index"; // 返回登录页
                }
        }

}
