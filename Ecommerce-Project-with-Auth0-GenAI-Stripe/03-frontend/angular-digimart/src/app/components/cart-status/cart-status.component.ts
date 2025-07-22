import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  totalPrice : number = 0.00;
  totalQuantity : number = 0;

  constructor(private cartService : CartService) { }

  ngOnInit(): void {
    this.updateCartStatus();
  }

  updateCartStatus() {
    // subscribe for events on cart service

    // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    //subscribe to th cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );


    //In this methos, we are only subscribing to cartService, we ar not calling calling computeCartTotals() methos that evaluated these defined fields. We are saying, I dont need those values now, but whenevr these will be pubished, uodate my declared fields with published values as I have subscribd to those values.
  }

}
