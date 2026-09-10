package com.vente.dto;

import lombok.Data;

@Data
public class AjoutPanierRequest {
    private Long produitId;
    private Integer quantite;
}