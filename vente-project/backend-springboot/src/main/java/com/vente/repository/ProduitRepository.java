package com.vente.repository;

import com.vente.entity.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProduitRepository extends JpaRepository<Produit, Long> {
    List<Produit> findByCategorie_Id(Long categorieId);
    List<Produit> findByNomContainingIgnoreCase(String nom);
}
