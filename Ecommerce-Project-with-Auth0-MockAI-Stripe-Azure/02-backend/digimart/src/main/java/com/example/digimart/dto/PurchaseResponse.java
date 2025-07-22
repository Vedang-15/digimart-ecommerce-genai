package com.example.digimart.dto;

public class PurchaseResponse {

    private String orderTrackingNumber;


    //constructors
    public PurchaseResponse(String orderTrackingNumber) {
        this.orderTrackingNumber = orderTrackingNumber;
    }

    public PurchaseResponse(){

    }



    //getters and setters
    public String getOrderTrackingNumber() {
        return orderTrackingNumber;
    }

    public void setOrderTrackingNumber(String orderTrackingNumber) {
        this.orderTrackingNumber = orderTrackingNumber;
    }
}
