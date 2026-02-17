package com.uphf.blockchain;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BlockChainApplication {

    public static void main(String[] args) {
        SpringApplication.run(BlockChainApplication.class, args);
    }

}
