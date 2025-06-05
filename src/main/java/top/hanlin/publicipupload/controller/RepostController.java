package top.hanlin.publicipupload.controller;


import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import top.hanlin.publicipupload.model.ApiResponse;

@Slf4j
@RestController
@RequestMapping("/api")
public class RepostController {


        @PostMapping("/login")
        public ApiResponse login(@RequestBody String password){



        }

}
