package com.uphf.blockchain.Entity;

public class Transaction {
    String Expediteur;
    String Destinataire;
    Double Quantite;
    Double Fees; // Frais de transaction
    String Signature; // Signature ECDSA de la transaction

    public Transaction(String expediteur, String destinataire, Double quantite) {
        Expediteur = expediteur;
        Destinataire = destinataire;
        Quantite = quantite;
        Fees = 0.0;
    }

    public Transaction(String expediteur, String destinataire, Double quantite, Double fees) {
        Expediteur = expediteur;
        Destinataire = destinataire;
        Quantite = quantite;
        Fees = fees;
    }
    public Transaction(){

    }

    public Double getQuantite() {
        return Quantite;
    }

    public void setQuantite(Double quantite) {
        Quantite = quantite;
    }

    public String getDestinataire() {
        return Destinataire;
    }

    public void setDestinataire(String destinataire) {
        Destinataire = destinataire;
    }

    public String getExpediteur() {
        return Expediteur;
    }

    public void setExpediteur(String expediteur) {
        Expediteur = expediteur;
    }

    public String getSignature() {
        return Signature;
    }

    public void setSignature(String signature) {
        Signature = signature;
    }

    public Double getFees() {
        return Fees;
    }

    public void setFees(Double fees) {
        Fees = fees;
    }
}
