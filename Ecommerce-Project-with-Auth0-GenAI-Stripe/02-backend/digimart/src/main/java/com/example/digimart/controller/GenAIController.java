package com.example.digimart.controller;
import com.example.digimart.service.GenAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/genai")
@CrossOrigin("https://localhost:4200")
public class GenAIController {

    private final GenAIService genAIService;

    @Autowired
    public GenAIController(GenAIService genAIService) {
        this.genAIService = genAIService;
    }

    @PostMapping("/fill-descriptions")
    public String fillDescriptions() {
        genAIService.generateAndSaveMissingDescriptions();
        return "AI descriptions generated and saved successfully.";
    }
}


// To run/trigger product description filling in db using gen ai model, do the following -
//1. Go to LM Studio - Developer tab, Load the model and ensure server is running.
//2. In postman, make a post request to : https://localhost:8443/api/genai/fill-descriptions, do not send any data. just put the header as Content-Type --- application/json
//3. This should do everything - check the db for null descriptions - generate descriptions for those products and fill the db with generated descriptions.


