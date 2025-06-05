package top.hanlin.publicipupload.controller;


import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import top.hanlin.publicipupload.model.ApiResponse;
import top.hanlin.publicipupload.service.RepostService;
import top.hanlin.publicipupload.service.impl.RepostServiceImpl;

@Slf4j
@Controller
public class RepostController {
        RepostService repostService =new RepostServiceImpl();

        @GetMapping("/")
        public String index() {
                return "index";  // 返回templates目录下的index.html模板
        }


        @PostMapping("/login")
        public String login(@RequestBody String password){
                boolean results=repostService.login(password);
                if(results){

                }else {

                }

        }

}
