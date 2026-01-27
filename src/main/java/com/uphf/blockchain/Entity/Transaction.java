package com.uphf.blockchain.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class Transaction{
    String Expediteur ;

    public Transaction(String expediteur, String destinataire, Double quantite) {
        Expediteur = expediteur;
        Destinataire = destinataire;
        Quantite = quantite;
    }

    String Destinataire;
    Double Quantite;

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
