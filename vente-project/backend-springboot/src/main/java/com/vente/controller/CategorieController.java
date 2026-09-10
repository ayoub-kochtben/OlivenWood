package com.vente.controller;

import com.vente.entity.Categorie;
import com.vente.repository.CategorieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategorieController {

    @Autowired
    private CategorieRepository categorieRepository;

    @GetMapping
    public List<Categorie> getAll() {
        return categorieRepository.findAll();
    }

    @GetMapping("/{id}")
    public Categorie getById(@PathVariable Long id) {
        return categorieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Catégorie introuvable : " + id));
    }

    @PostMapping
    public Categorie creer(@RequestBody Categorie categorie) {
        return categorieRepository.save(categorie);
    }

    @DeleteMapping("/{id}")
    public void supprimer(@PathVariable Long id) {
        categorieRepository.deleteById(id);
    }
    @PutMapping("/{id}")
    public Categorie modifier(@PathVariable Long id, @RequestBody Categorie categorie) {
        categorie.setId(id);
        return categorieRepository.save(categorie);
    }
}
