package com.example.digimart.dto;

public class ProductAIResponse {

    //define fields
    private String description;

    //constructors
    public ProductAIResponse() {}

    public ProductAIResponse(String description) {
        this.description = description;
    }

    //getters and setters
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
