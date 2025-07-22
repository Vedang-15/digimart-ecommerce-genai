package com.example.digimart.dto;

public class ProductAIRequest {

    //define fields
    private String productName;
    private String productCategory;

    // Constructors

    public ProductAIRequest(String productName, String productCategory) {
        this.productName = productName;
        this.productCategory = productCategory;
    }

    public ProductAIRequest() {}

    // getters and setters

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductCategory() {
        return productCategory;
    }

    public void setProductCategory(String productCategory) {
        this.productCategory = productCategory;
    }
}
