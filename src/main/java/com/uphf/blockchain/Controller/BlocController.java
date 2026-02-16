package com.uphf.blockchain.Controller;

import com.uphf.blockchain.Entity.*;
import com.uphf.blockchain.Service.BlocService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/bloc")
@CrossOrigin(origins = "http://localhost:5173")


public class BlocController {
    @Autowired
    private  BlocService blocService;

    @GetMapping("/generer")
    public Bloc  genererBloc() {
        Bloc bloc = blocService.genererBlocTest();
       return bloc;
    }

    @GetMapping("/miner")
    public Bloc minerBloc(){
        Bloc bloc = blocService.genererBlocTest();
      String merkleroot = blocService.trouverMerkle(
              bloc.getBlockBody().getTransactionList(),
              0,bloc.getBlockBody().getTransactionList().size() - 1
      );
        bloc.getBlockHeader().setMerkleRoot(merkleroot);
        blocService.consensus(bloc);
        return bloc;
    }
    @GetMapping("/3")
    public void afficher3(){
        blocService.test3();
    }


}
