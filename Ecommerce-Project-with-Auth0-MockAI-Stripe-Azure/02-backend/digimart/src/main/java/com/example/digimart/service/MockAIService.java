package com.example.digimart.service;

import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class MockAIService {

    private final CategoryDescriptionService categoryDescriptionService;

    public MockAIService(CategoryDescriptionService categoryDescriptionService) {
        this.categoryDescriptionService = categoryDescriptionService;
    }

    public String generateDescription(String productName, String category) {
        return categoryDescriptionService.getRandomDescription(category);

    }
}
