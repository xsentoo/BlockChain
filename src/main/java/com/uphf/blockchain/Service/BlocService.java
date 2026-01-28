package com.uphf.blockchain.Service;

import com.uphf.blockchain.Entity.*;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class BlocService {
    public Bloc genererBlocTest()
    {
        Header headertest = genererHeaderTest();
        Body bodyTest = genererBodyTest();
        Bloc bloc = new Bloc(headertest  , bodyTest);
        return bloc;
    }

    public Header genererHeaderTest()
    {
        Header header = new Header(
            "abc", 
            LocalDate.parse("2007-12-03"),
            "abc", 
            "bcb", 
            2 );
        return header;
    }

    public Transaction genererTransactionTest()
    {
        Transaction transaction = new Transaction("a" , "b " , 0.1);
        return transaction;
    } 

    public CoinBase genererCoinbaseTest()
    {
        CoinBase coinbase = new CoinBase(0.3 , 4);
        return coinbase;
    }

    public Body genererBodyTest()
    {
        Transaction trans1 = genererTransactionTest();
        Transaction trans2 = new Transaction("c" , "b " , 0.5);
        Body body = new Body(genererCoinbaseTest() , Arrays.asList(trans1,trans2));
        return body;
    }
    
    public void afficherHeader(Header header){
        System.out.println(" HEADER:");
        System.out.println("  Hash Precedent:" + header.getHashPre());
        System.out.println("  Merkle Root:" + header.getMerkleRoot());
        System.out.println("  TimeStamp:" + header.getTimeStamp().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        System.out.println("  Target (Complexite):" + header.getTarget());
        System.out.println("  Nonce:" + String.valueOf(header.getNonce()));
    }

    public void afficherCoinbase(CoinBase coinBase){
        System.out.println("  COINBASE:");
        System.out.println("   Recompense:" + String.format("%.9f", coinBase.getRecompense()));
        System.out.println("   ExtraNonce:" + String.valueOf(coinBase.getExtraNonce()));
    }

    public void afficherTransaction(Transaction transaction){
        System.out.println("    Expediteur:" + transaction.getExpediteur());
        System.out.println("    Destinataire:" + transaction.getDestinataire());
        System.out.println("    Quantite:" + String.format("%.9f", transaction.getQuantite()));
    }

    public void afficherBody(Body body){
        System.out.println(" BODY:");
        afficherCoinbase(body.getCoinBaseTrans());
        List<Transaction> transList = body.getTransactionList();
        System.out.println("  TRANSACTIONS:");
        for(int i = 0; i<transList.size(); i++) {
            System.out.println("   Transaction " + String.valueOf(i));
            afficherTransaction(transList.get(i));
        }
    }

    public void afficherBlock(Bloc bloc){
        System.out.println("AFFICHAGE DE BLOC");
        afficherHeader(bloc.getBlockHeader());
        afficherBody(bloc.getBlockBody());
    }

    public String hasher(String mot){
        try{
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodehash = digest.digest(mot.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder(2*encodehash.length);
            for (int i = 0 ; i < encodehash.length ; i++){
                String hex = Integer.toHexString(0xff & encodehash[i]);
                if(hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        }catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Erreur de hachage ", e);
        }
    }

    public String hasherTransaction(Transaction transaction) {
        String result = transaction.getExpediteur() + transaction.getDestinataire();
        result += String.format("%.9f", transaction.getQuantite());
        return hasher(result);
    }

    public String trouverMerkle(List<Transaction> transList, int start, int end) {
        if (start ==  end ){
            return hasherTransaction(transList.get(start));
        }
        String result = trouverMerkle(transList, start , (start + end)/2);
        result += trouverMerkle(transList, (start + end)/2+1,end);
        return hasher(result);
    }

    public String hasherCoinBase(CoinBase coinBase) {
       String result = String.format("%.9f", coinBase.getRecompense());
       result += String.valueOf(coinBase.getExtraNonce());
       return hasher(result);
    }

    public String hasherBody(Body body)
    {
        String result = hasherCoinBase(body.getCoinBaseTrans());
        List<Transaction> transList = body.getTransactionList();
        result += trouverMerkle(transList, 0, transList.size()-1);
        return hasher(result);
    }

    public void  test () {
        Body bodyTest = genererBodyTest();
        String merkleroot = hasherBody(bodyTest);
        System.out.println("Merkle root trouvée:" + merkleroot);
    }
}


