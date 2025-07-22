package com.example.digimart.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

@Service
public class CategoryDescriptionService {

    private final Map<String, List<String>> categoryDescriptions = new HashMap<>();
    private final Random random = new Random();

    @PostConstruct
    public void loadDescriptions() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        categoryDescriptions.putAll(
                mapper.readValue(
                        new ClassPathResource("category_descriptions.json").getInputStream(),
                        new TypeReference<Map<String, List<String>>>() {}
                )
        );
    }

    public String getRandomDescription(String category) {
        List<String> descriptions = categoryDescriptions.getOrDefault(category, List.of(
                "Explore our high-quality products designed for every need and occasion."
        ));
        return descriptions.get(random.nextInt(descriptions.size()));
    }
}
