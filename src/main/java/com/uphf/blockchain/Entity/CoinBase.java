package com.uphf.blockchain.Entity;

public class CoinBase{
    Double Recompense;
    int ExtraNonce;

    public CoinBase(Double recompense, int extraNonce) {
        Recompense = recompense;
        ExtraNonce = extraNonce;
    }
    public CoinBase(){

    }

    public Double getRecompense() {
        return Recompense;
    }

    public void setRecompense(Double recompense) {
        Recompense = recompense;
    }

    public int getExtraNonce() {
        return ExtraNonce;
    }

    public void setExtraNonce(int extraNonce) {
        ExtraNonce = extraNonce;
    }
}
