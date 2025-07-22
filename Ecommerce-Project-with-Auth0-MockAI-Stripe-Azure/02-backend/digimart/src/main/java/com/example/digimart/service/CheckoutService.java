package com.example.digimart.service;

import com.example.digimart.dto.PaymentInfo;
import com.example.digimart.dto.Purchase;
import com.example.digimart.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
