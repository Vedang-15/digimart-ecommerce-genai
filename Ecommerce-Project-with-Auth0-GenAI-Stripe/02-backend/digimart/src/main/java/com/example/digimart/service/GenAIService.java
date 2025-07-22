package com.example.digimart.service;

import com.example.digimart.entity.Product;
import com.example.digimart.dao.ProductRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
public class GenAIService {

    private final WebClient webClient;
    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper;

    public GenAIService(ProductRepository productRepository) {
        this.productRepository = productRepository;
        this.webClient = WebClient.builder()
                .baseUrl("http://localhost:1234")  // LM Studio chat server
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public void generateAndSaveMissingDescriptions() {
        List<Product> productsWithoutDesc = productRepository.findByDescriptionIsNullOrDescription("");

        for (Product product : productsWithoutDesc) {
            try {
                String category = product.getCategory() != null ? product.getCategory().getCategoryName() : "general";
                String aiDescription = generateDescription(product.getName(), category);
                product.setDescription(aiDescription);
            } catch (Exception e) {
                e.printStackTrace();
                product.setDescription("Couldn't generate description.");
            }
        }

        productRepository.saveAll(productsWithoutDesc);
    }

    public String generateDescription(String productName, String category) {
        String prompt = String.format(
                "Write a short, engaging product description of around 260 to 280 characters for a product named \"%s\" in the category \"%s\". " +
                        "Make it sound like a modern e-commerce website. Avoid repetition and generic phrases.",
                productName, category
        );

        String requestBody = """
            {
              "model": "mistral-7b-instruct-v0.2",
              "messages": [
                { "role": "user", "content": "%s" }
              ],
              "temperature": 0.7,
              "stream": false
            }
            """.formatted(prompt.replace("\"", "\\\""));

        try {
            String response = webClient.post()
                    .uri("/v1/chat/completions")
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            System.out.println("Raw LLM response:\n" + response);

            JsonNode root = objectMapper.readTree(response);
            JsonNode contentNode = root.path("choices").get(0).path("message").path("content");

            String description = contentNode.asText().trim();

            return description.length() > 280 ? description.substring(0, 280).trim() : description;

        } catch (Exception e) {
            System.err.println("Error generating description for: " + productName);
            e.printStackTrace();
            return "Couldn't generate description.";
        }
    }
}
