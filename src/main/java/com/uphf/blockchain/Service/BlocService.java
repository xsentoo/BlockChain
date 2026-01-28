package com.uphf.blockchain.Service;

import com.uphf.blockchain.Entity.*;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class BlocService {
    public Bloc genererBlocTest()
    {
        Header headertest = genererHeaderTest();
        Body bodyTest = genererBodyTest();
        Bloc bloc = new Bloc(headertest  , bodyTest);
        return bloc;
    }

    public String genererRandomString()
    {
        String charPool = "0123456789abcdefghijklmnopqrstuvwxyz";
        Random randomNumbers = new Random();
        char[] ransString = new char[10];
        for(int i = 0; i<10; i++)
        {
            ransString[i] = charPool.charAt(randomNumbers.nextInt(charPool.length()));
        }
        String result = new String(ransString);
        return hasher(result);
    }

    public Header genererHeaderTest()
    {
        Random randNumber = new Random();
        Header header = new Header(
            genererRandomString(), 
            LocalDate.now(),
            genererRandomString(), 
            genererRandomString(), 
            randNumber.nextInt(1000) );
        return header;
    }

    public Transaction genererTransactionTest()
    {
        Random randNumber = new Random();
        Transaction transaction = new Transaction(
            genererRandomString(), 
            genererRandomString(), 
            randNumber.nextDouble()*100
        );
        return transaction;
    } 

    public CoinBase genererCoinbaseTest()
    {
        Random randNumber = new Random();
        CoinBase coinbase = new CoinBase(randNumber.nextDouble()*100 , randNumber.nextInt(1000));
        return coinbase;
    }

    public Body genererBodyTest()
    {
        List<Transaction> transList = new ArrayList<>();
        for(int i = 0; i< 10; i++)
        {
            transList.add(genererTransactionTest());
        }
        Body body = new Body(genererCoinbaseTest() , transList);
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


