package com.example.digimart.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "state")
public class State {

    //define fields
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;

    //country_id column in state table is the foreign key that binds the country and state tables in database, hence we use @ManyToOne and @JoinColumn annotations ith ith.
    @ManyToOne
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;



    //constructors
    public State() {

    }

    public State(int id, String name, Country country) {
        this.id = id;
        this.name = name;
        this.country = country;
    }



    //generate getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Country getCountry() {
        return country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }
}
