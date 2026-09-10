package com.vente.controller;

import com.vente.entity.Produit;
import com.vente.repository.ProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/produits")
public class ProduitController {

    @Autowired
    private ProduitRepository produitRepository;

    @GetMapping
    public List<Produit> getAll() {
        return produitRepository.findAll();
    }

    @GetMapping("/{id}")
    public Produit getById(@PathVariable Long id) {
        return produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit introuvable : " + id));
    }

    @GetMapping("/categorie/{categorieId}")
    public List<Produit> getByCategorie(@PathVariable Long categorieId) {
        return produitRepository.findByCategorie_Id(categorieId);
    }

    @GetMapping("/recherche")
    public List<Produit> rechercher(@RequestParam String nom) {
        return produitRepository.findByNomContainingIgnoreCase(nom);
    }

    @PostMapping
    public Produit creer(@RequestBody Produit produit) {
        if (produit.getImages() != null) {
            produit.getImages().forEach(img -> img.setProduit(produit));
        }
        return produitRepository.save(produit);
    }

    @PutMapping("/{id}")
    public Produit modifier(@PathVariable Long id, @RequestBody Produit produit) {
        produit.setId(id);
        if (produit.getImages() != null) {
            produit.getImages().forEach(img -> img.setProduit(produit));
        }
        return produitRepository.save(produit);
    }

    @DeleteMapping("/{id}")
    public void supprimer(@PathVariable Long id) {
        produitRepository.deleteById(id);
    }
}