package com.uphf.blockchain.Entity;

import java.util.List;

public class Body {
    CoinBase CoinBaseTrans;
    List<Transaction> TransactionList;


    public CoinBase getCoinBaseTrans() {
        return CoinBaseTrans;
    }
    public void setCoinBaseTrans(CoinBase coinBaseTrans) {
        CoinBaseTrans = coinBaseTrans;
    }
    public List<Transaction> getTransactionList() {
        return TransactionList;
    }
    public void setTransactionList(List<Transaction> transactionList) {
        TransactionList = transactionList;
    }




    public Body(CoinBase coinBaseTrans, List<Transaction> list) {
        CoinBaseTrans = coinBaseTrans;
        TransactionList = list;
    }
}
