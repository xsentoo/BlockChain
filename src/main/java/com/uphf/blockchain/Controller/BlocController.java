package com.uphf.blockchain.Controller;

import com.uphf.blockchain.Entity.*;
import com.uphf.blockchain.Service.BlocService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller


public class BlocController {
    @Autowired
    private  BlocService blocService;

    @GetMapping("/1")
    public void  afficher() {
        Bloc blocTest = blocService.genererBlocTest();
        blocService.afficherBlock(blocTest);
    }

    @GetMapping("/2")
    public void afficher2(){
        Bloc blocTest = blocService.genererBlocTest();
        blocService.afficherBlock(blocTest);
        blocService.test();
    }
}
