package com.vente.controller;

import com.vente.dto.LoginRequest;
import com.vente.dto.LoginResponse;
import com.vente.entity.Utilisateur;
import com.vente.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @PostMapping("/register")
    public Utilisateur register(@RequestBody Utilisateur utilisateur) {
        // TODO: encoder le mot de passe (BCrypt) avant mise en production
        return utilisateurRepository.save(utilisateur);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));

        if (!utilisateur.getMotDePasse().equals(request.getMotDePasse())) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }

        utilisateur.setMotDePasse(null);

        // Jeton simplifié - à remplacer par un vrai JWT en production
        String token = UUID.randomUUID().toString();

        return new LoginResponse(
                utilisateur.getId(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getEmail(),
                token
        );
    }
}
