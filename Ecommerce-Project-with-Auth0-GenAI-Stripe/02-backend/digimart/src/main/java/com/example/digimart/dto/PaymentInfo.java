package com.example.digimart.dto;

public class PaymentInfo {

    // define fields
    private int amount;
    private String currency;
    private String receiptEmail;


    // constructors
    public PaymentInfo(int amount, String currency, String receiptEmail) {
        this.amount = amount;
        this.currency = currency;
        this.receiptEmail = receiptEmail;
    }

    public PaymentInfo(){

    }


    // getters and setters
    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getReceiptEmail() {
        return receiptEmail;
    }

    public void setReceiptEmail(String receiptEmail) {
        this.receiptEmail = receiptEmail;
    }
}
