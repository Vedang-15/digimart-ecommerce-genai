package com.example.digimart.controller;

import com.example.digimart.dto.PaymentInfo;
import com.example.digimart.dto.Purchase;
import com.example.digimart.dto.PurchaseResponse;
import com.example.digimart.service.CheckoutService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger; // New import
import org.slf4j.LoggerFactory; // New import

@CrossOrigin("https://gray-ocean-09ecb650f.1.azurestaticapps.net")
@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private static final Logger logger = LoggerFactory.getLogger(CheckoutController.class); // New logger

    private CheckoutService theCheckoutService;

    public CheckoutController(CheckoutService checkoutService){
        theCheckoutService = checkoutService;
    }

    @PostMapping("/purchase")
    public PurchaseResponse placeOrderHelper(@RequestBody Purchase purchase){   // this requestbody corresponds to body of the request that was made to this route.
        PurchaseResponse purchaseResponse = theCheckoutService.placeOrder(purchase);
        return purchaseResponse;
    }

    @PostMapping("/payment-intent")
    public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentInfo paymentInfo) {
        try {
            logger.info("Received request for /payment-intent with amount: {}, currency: {}, email: {}",
                    paymentInfo.getAmount(), paymentInfo.getCurrency(), paymentInfo.getReceiptEmail());

            PaymentIntent paymentIntent = theCheckoutService.createPaymentIntent(paymentInfo);
            String paymentStr = paymentIntent.toJson();
            logger.info("Successfully created PaymentIntent. Client Secret: {}", paymentIntent.getClientSecret());
            return new ResponseEntity<>(paymentStr, HttpStatus.OK);
        } catch (StripeException e) {
            logger.error("StripeException occurred during payment intent creation: {}", e.getMessage(), e); // THIS IS VITAL
            logger.error("Stripe Exception Full Stack Trace:", e); // Print full stack trace
            return new ResponseEntity<>("Stripe Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            logger.error("An unexpected error occurred during payment intent creation: {}", e.getMessage(), e); // THIS IS VITAL
            logger.error("General Exception Full Stack Trace:", e); // Print full stack trace
            return new ResponseEntity<>("Internal Server Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
