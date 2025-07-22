import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  currProduct! : Product;

  constructor(private productService : ProductService, private route : ActivatedRoute, private cartService : CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() =>{
      this.handleProductDeatils();
    })
  }

  handleProductDeatils() {
    
    //get the "productId" param string. convert the obtained string to a number using the "+" symbol
    const theProductId : number = +this.route.snapshot.paramMap.get('productId')!;

    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.currProduct = data;
      }
    )
  }

  addToCart(theProduct: Product) {
    console.log(`Adding to cart, ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCartHelper(theCartItem);

  }

}
