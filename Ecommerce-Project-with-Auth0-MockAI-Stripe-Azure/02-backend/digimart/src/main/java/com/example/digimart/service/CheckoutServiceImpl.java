package com.example.digimart.service;

import com.example.digimart.dao.CustomerRepository;
import com.example.digimart.dto.PaymentInfo;
import com.example.digimart.dto.Purchase;
import com.example.digimart.dto.PurchaseResponse;
import com.example.digimart.entity.Customer;
import com.example.digimart.entity.Order;
import com.example.digimart.entity.OrderItem;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.annotation.PostConstruct; 
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value; // KEEP THIS IMPORT
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    private CustomerRepository theCustomerRepo;

    @Value("${stripe.key.secret}")
    private String stripeSecretKey;

    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository) {
        this.theCustomerRepo = customerRepository;
        // Do NOT set Stripe.apiKey here. It will be null at this point.
    }

    // This method will be called by Spring AFTER dependency injection is complete
    // and after the constructor has run.
    @PostConstruct // <--- NEW ANNOTATION
    public void init() {
        Stripe.apiKey = stripeSecretKey; // <--- Set the API key here!
        System.out.println("Stripe API Key set via @PostConstruct. Key starts with: " + (stripeSecretKey != null ? stripeSecretKey.substring(0, 7) + "..." : "null"));
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        //retrieve the order info from dto
        Order order = purchase.getOrder();

        //generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        //populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        //populate order with billingAddress and shippingAdfdress
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        //populate customer with order
        Customer customer = purchase.getCustomer();

        //check if this customer already exists in the database(based on his email)
        String theEmail = customer.getEmail();
        Customer customerFromDB = theCustomerRepo.findByEmail(theEmail);
        if(customerFromDB != null){
            // we found it, lets assign it to the customer obtained from purchase. If we don't do this, same person might get entered as 2 different entries in the customer table.
            customer = customerFromDB;
        }
        // if not found, existing customer(obtained from purchase) will be entered in database
        customer.add(order);

        //save to database
        theCustomerRepo.save(customer);

        //return the response
        return new PurchaseResponse(orderTrackingNumber);

    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {

        // create the PaymentInfo using th info present in the PaymentInfo object( this as received from frontend)
        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");

        Map<String, Object> params = new HashMap<>();
        params.put("amount", paymentInfo.getAmount());
        params.put("currency", paymentInfo.getCurrency());
        params.put("payment_method_types", paymentMethodTypes);
        params.put("description", "Digimart Purchase");
        params.put("receipt_email", paymentInfo.getReceiptEmail());

        System.out.println("DEBUG: Calling PaymentIntent.create(params)...");
        PaymentIntent result = PaymentIntent.create(params);// this will create the paymentIntent object and return it.
        System.out.println("DEBUG: PaymentIntent.create(params) returned successfully.");

        return result;
    }

    private String generateOrderTrackingNumber(){

        //generate a random UUID number
        return UUID.randomUUID().toString();
    }
}