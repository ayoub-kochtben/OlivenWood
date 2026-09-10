package com.vente.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/agent-ia")
public class AgentIaController {

    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping
    public Map<String, Object> chat(@RequestBody Map<String, String> body) {
        String question = body.get("question");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, String>> request = new HttpEntity<>(Map.of("question", question), headers);

        try {
            Map response = restTemplate.postForObject(aiServiceUrl + "/chat", request, Map.class);
            return response;
        } catch (Exception e) {
            return Map.of("answer", "Le service IA est momentanément indisponible. Réessayez dans un instant.");
        }
    }
}