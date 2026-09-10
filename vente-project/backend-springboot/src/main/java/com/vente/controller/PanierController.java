package com.vente.controller;

import com.vente.dto.AjoutPanierRequest;
import com.vente.entity.PanierItem;
import com.vente.entity.Produit;
import com.vente.entity.Utilisateur;
import com.vente.repository.PanierItemRepository;
import com.vente.repository.ProduitRepository;
import com.vente.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/panier")
public class PanierController {

    @Autowired
    private PanierItemRepository panierItemRepository;

    @Autowired
    private ProduitRepository produitRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    // Récupérer le panier (invité via sessionId, ou connecté via utilisateurId)
    @GetMapping
    public List<PanierItem> getPanier(
            @RequestParam(required = false) String sessionId,
            @RequestParam(required = false) Long utilisateurId) {

        if (utilisateurId != null) {
            return panierItemRepository.findByUtilisateurId(utilisateurId);
        }
        return panierItemRepository.findBySessionId(sessionId);
    }

    // Ajouter un produit au panier
    @PostMapping("/ajouter")
    public PanierItem ajouter(
            @RequestParam(required = false) String sessionId,
            @RequestParam(required = false) Long utilisateurId,
            @RequestBody AjoutPanierRequest request) {

        Produit produit = produitRepository.findById(request.getProduitId())
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));

        PanierItem existant;
        if (utilisateurId != null) {
            existant = panierItemRepository
                    .findByUtilisateurIdAndProduitId(utilisateurId, request.getProduitId())
                    .orElse(null);
        } else {
            existant = panierItemRepository
                    .findBySessionIdAndProduitId(sessionId, request.getProduitId())
                    .orElse(null);
        }

        if (existant != null) {
            existant.setQuantite(existant.getQuantite() + request.getQuantite());
            return panierItemRepository.save(existant);
        }

        PanierItem item = new PanierItem();
        item.setProduit(produit);
        item.setQuantite(request.getQuantite());

        if (utilisateurId != null) {
            Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
            item.setUtilisateur(utilisateur);
        } else {
            item.setSessionId(sessionId);
        }

        return panierItemRepository.save(item);
    }

    // Modifier la quantité
    @PutMapping("/{id}")
    public PanierItem modifierQuantite(@PathVariable Long id, @RequestParam Integer quantite) {
        PanierItem item = panierItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article introuvable"));
        item.setQuantite(quantite);
        return panierItemRepository.save(item);
    }

    // Supprimer un article
    @DeleteMapping("/{id}")
    public void supprimer(@PathVariable Long id) {
        panierItemRepository.deleteById(id);
    }

    // Fusionner le panier invité dans le panier de l'utilisateur au login
    @PostMapping("/fusionner")
    public List<PanierItem> fusionner(
            @RequestParam String sessionId,
            @RequestParam Long utilisateurId) {

        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        List<PanierItem> itemsInvite = panierItemRepository.findBySessionId(sessionId);

        for (PanierItem itemInvite : itemsInvite) {
            PanierItem existant = panierItemRepository
                    .findByUtilisateurIdAndProduitId(utilisateurId, itemInvite.getProduit().getId())
                    .orElse(null);

            if (existant != null) {
                existant.setQuantite(existant.getQuantite() + itemInvite.getQuantite());
                panierItemRepository.save(existant);
                panierItemRepository.delete(itemInvite);
            } else {
                itemInvite.setUtilisateur(utilisateur);
                itemInvite.setSessionId(null);
                panierItemRepository.save(itemInvite);
            }
        }

        return panierItemRepository.findByUtilisateurId(utilisateurId);
    }
}