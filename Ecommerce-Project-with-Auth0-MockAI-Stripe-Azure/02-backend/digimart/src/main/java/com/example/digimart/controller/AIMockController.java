package com.example.digimart.controller;

import com.example.digimart.dao.ProductRepository;
import com.example.digimart.dto.ProductAIRequest;
import com.example.digimart.dto.ProductAIResponse;
import com.example.digimart.entity.Product;
import com.example.digimart.service.MockAIService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "https://localhost:4200") // In dev only. Use config in prod.
public class AIMockController {

    private final MockAIService mockAIService;
    private final ProductRepository productRepository;

    public AIMockController(MockAIService mockAIService, ProductRepository productRepository) {
        this.mockAIService = mockAIService;
        this.productRepository = productRepository;
    }

    // This is a utility endpoint that generates one product description based on the product name and category.
    // Use Case:
    //Testing how descriptions look.
    //Might be used in the frontend in the future to display dynamic previews.
    //Good for debugging or testing integration with real AI later.
    //It calls MockAIService.generateDescription(name, category). It randomly picks a description from the relevant category in your JSON.It does not modify your database.It simply returns the generated description.
    @PostMapping("/generate-description")
    public ProductAIResponse generateDescription(@RequestBody ProductAIRequest request) {
        String desc = mockAIService.generateDescription(
                request.getProductName(),
                request.getProductCategory()
        );
        return new ProductAIResponse(desc);
    }


    // This is a backend utility endpoint that scans all products in your database and updates their description column if it's empty.
    // It uses a custom ProductRepository.findByDescriptionIsNull() to get products that have no description.For each such product.
    // It calls MockAIService.generateDescription(name, category) (from the JSON).
    // It sets that description on the product.
    // Finally, it saves all updated products back to the DB.
    @PostMapping("/populate-db")
    public String populateDatabaseWithDescriptions() {
        List<Product> productsWithoutDescription = productRepository.findByDescriptionIsNullOrDescription("");

        for (Product product : productsWithoutDescription) {
            String name = product.getName();
            String category = product.getCategory().getCategoryName();  // Assuming you have getCategory().getName()

            String description = mockAIService.generateDescription(name, category);
            product.setDescription(description);
        }

        productRepository.saveAll(productsWithoutDescription);
        return productsWithoutDescription.size() + " products updated with mock AI descriptions.";
    }

}

// To run/trigger product description filling in db using json file (mock ai) do the following -
//1. In postman, make a post request to : https://localhost:8443/api/ai/populate-db, do not send any data. just put the header as Content-Type --- application/json
//2. This should do everything - check the db for null descriptions - obatin descriptions for those products from json and fill the db with those descriptions.

