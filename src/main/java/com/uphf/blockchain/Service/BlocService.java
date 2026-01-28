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
    Header Headertest = new Header("abc", LocalDate.parse("2007-12-03") ,"abc" , "bcb" , 2 );
    Transaction trans1 = new Transaction("a" , "b " , 0.1);
    Transaction trans2 = new Transaction("c" , "b " , 0.5);
    Body Bodytest = new Body(new CoinBase(0.3 , 4) , Arrays.asList(trans1,trans2));
    Bloc test = new Bloc(Headertest  , Bodytest);


    public void afficherHeader(Header header){
        System.out.println(" HEADER:");
        System.out.println("  Hash Precedent:" + header.getHashPre());
        System.out.println("  Merkle Root:" + header.getMerkleRoot());
        System.out.println("  TimeStamp:" + header.getTimeStamp().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        System.out.println("  Target (Complexite):" + header.getTarget());
        System.out.println("  Nonce:" + String.valueOf(header.getNonce()));
    }

    public void afficherCoinbase(Body body){
        CoinBase coinBase = body.getCoinBaseTrans();
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
        Bloc bloc = this.test;
        System.out.println(" BODY:");
        afficherCoinbase(bloc.getBlockBody());
        List<Transaction> transList = bloc.getBlockBody().getTransactionList();
        System.out.println("  TRANSACTIONS:");
        for(int i = 0; i<transList.size(); i++) {
            System.out.println("   Transaction " + String.valueOf(i));
            afficherTransaction(transList.get(i));
        }
    }

    public void afficherBlock(){
        Bloc bloc = this.test;
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

    public String trouverMerkle(int start, int end) {
        List<Transaction> transList = this.test.getBlockBody().getTransactionList();
        if (start ==  end ){
            return hasherTransaction(transList.get(start));
        }
        String result = trouverMerkle(start , (start + end)/2);
        result += trouverMerkle((start + end)/2+1,end);
        return hasher(result);
    }

    public String hasherCoinBase(CoinBase coinBase) {
       String result = String.format("%.9f", coinBase.getRecompense());
       result += String.valueOf(coinBase.getExtraNonce());
       return hasher(result);
    }

    public void  test () {
        String merkleroot = trouverMerkle(0,1);
        System.out.println(merkleroot);
    }
}


