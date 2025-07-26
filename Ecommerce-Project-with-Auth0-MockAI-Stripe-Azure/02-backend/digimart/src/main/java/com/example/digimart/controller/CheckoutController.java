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

@CrossOrigin("https://gray-ocean-09ecb650f.1.azurestaticapps.net")
@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

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
    public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentInfo paymentInfo) throws StripeException{
        PaymentIntent paymentIntent = theCheckoutService.createPaymentIntent(paymentInfo);
        String paymentStr = paymentIntent.toJson();
        return new ResponseEntity<>(paymentStr, HttpStatus.OK);
    }
}
