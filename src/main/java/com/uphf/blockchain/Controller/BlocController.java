package com.uphf.blockchain.Controller;

import com.uphf.blockchain.Entity.*;
import com.uphf.blockchain.Service.BlocService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.util.Arrays;

@Controller


public class BlocController {
    @Autowired
    private  BlocService blocService;

    @GetMapping("/1")
    public void  afficher() {
        blocService.afficherBlock();

    }


    @GetMapping("/2")
    public void afficher2(){
        blocService.afficherBlock();
        blocService.test();
    }

}
