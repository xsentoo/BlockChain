package com.uphf.blockchain.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


public  class Header {
    String MerkleRoot;


    public String getMerkleRoot() {
        return MerkleRoot;
    }

    public void setMerkleRoot(String merkleRoot) {
        MerkleRoot = merkleRoot;
    }

    public LocalDate getTimeStamp() {
        return TimeStamp;
    }

    public void setTimeStamp(LocalDate timeStamp) {
        TimeStamp = timeStamp;
    }

    public String getHashPre() {
        return HashPre;
    }

    public void setHashPre(String hashPre) {
        HashPre = hashPre;
    }

    public String getTarget() {
        return Target;
    }

    public void setTarget(String target) {
        Target = target;
    }

    public int getNonce() {
        return Nonce;
    }

    public void setNonce(int nonce) {
        Nonce = nonce;
    }

    LocalDate TimeStamp;
    String HashPre;
    String Target;
    int Nonce ;


    public Header(String merkleRoot, LocalDate timeStamp, String hashPre, String target, int nonce) {
        MerkleRoot = merkleRoot;
        TimeStamp = timeStamp;
        HashPre = hashPre;
        Target = target;
        Nonce = nonce;

    }

}
