package com.vente.controller;

import com.vente.entity.*;
import com.vente.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/commandes")
public class CommandeController {

    @Autowired
    private CommandeRepository commandeRepository;

    @Autowired
    private PanierItemRepository panierItemRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    // Créer une commande à partir du panier de l'utilisateur connecté
    @PostMapping
    public Commande creerCommande(@RequestParam Long utilisateurId) {

        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        List<PanierItem> panierItems = panierItemRepository.findByUtilisateurId(utilisateurId);

        if (panierItems.isEmpty()) {
            throw new RuntimeException("Le panier est vide");
        }

        Commande commande = new Commande();
        commande.setUtilisateur(utilisateur);
        commande.setDateCommande(LocalDateTime.now());
        commande.setStatut("EN_ATTENTE");

        double total = 0;
        for (PanierItem item : panierItems) {
            LigneCommande ligne = new LigneCommande();
            ligne.setCommande(commande);
            ligne.setProduit(item.getProduit());
            ligne.setQuantite(item.getQuantite());
            ligne.setPrixUnitaire(item.getProduit().getPrix());
            total += item.getProduit().getPrix() * item.getQuantite();

            if (commande.getLignes() == null) {
                commande.setLignes(new java.util.ArrayList<>());
            }
            commande.getLignes().add(ligne);
        }

        commande.setTotal(total);
        Commande commandeEnregistree = commandeRepository.save(commande);

        // Vider le panier une fois la commande créée
        panierItemRepository.deleteAll(panierItems);

        return commandeEnregistree;
    }

    // Historique des commandes d'un utilisateur
    @GetMapping
    public List<Commande> mesCommandes(@RequestParam Long utilisateurId) {
        return commandeRepository.findByUtilisateurIdOrderByDateCommandeDesc(utilisateurId);
    }
}