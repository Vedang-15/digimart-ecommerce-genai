import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItemsArray : CartItem[] = [];
  totalPrice : number = 0;
  totalQuantity : number = 0;

  constructor(private cartService : CartService) { }   // inject the cartService(injecti8ng is equivalent ot creating a new object), ill be useful for accessing CartService class.

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails(){

    // get hold the cart items array(that has the actual cart items) from cartService file(as this array is declared inside cartService.ts file)
    this.cartItemsArray = this.cartService.cartItems;


    // subscribe to cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // subscribe to cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    // compute cart total Price and Quantity
    this.cartService.computeCartTotals();  
    
  }

  incrementQuantity(theCartItem : CartItem){
    this.cartService.addToCartHelper(theCartItem);
  }

  decrementQuantity(theCartItem : CartItem){
    this.cartService.decrementFromCartHelper(theCartItem);

  }

  removeFromCart(theCartItem : CartItem){
    this.cartService.removeFromCartHelper(theCartItem);
  }

}
