package com.uphf.blockchain.Entity;

public class Transaction{
    String Expediteur ;
    String Destinataire;
    Double Quantite;

    public Transaction(String expediteur, String destinataire, Double quantite) {
        Expediteur = expediteur;
        Destinataire = destinataire;
        Quantite = quantite;
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
}
