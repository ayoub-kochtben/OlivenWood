package com.vente.repository;

import com.vente.entity.PanierItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PanierItemRepository extends JpaRepository<PanierItem, Long> {

    List<PanierItem> findBySessionId(String sessionId);

    List<PanierItem> findByUtilisateurId(Long utilisateurId);

    Optional<PanierItem> findBySessionIdAndProduitId(String sessionId, Long produitId);

    Optional<PanierItem> findByUtilisateurIdAndProduitId(Long utilisateurId, Long produitId);

    void deleteBySessionId(String sessionId);
}