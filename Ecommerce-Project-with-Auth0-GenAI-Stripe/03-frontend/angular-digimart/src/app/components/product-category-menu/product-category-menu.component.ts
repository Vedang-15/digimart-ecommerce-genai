import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {


  productCategories: ProductCategory[] = []; // declaring th productCategories array. The elements present in this array are renderd in product-category-menu-component view on our angular app(ie on side bar menu). This is done using a for loop defined in product-category-menu-component.html file.
  constructor(private productService : ProductService) { }

  ngOnInit(): void {
    this.listProductCategories();
  }

  listProductCategories(){

    this.productService.getProductCategories().subscribe(  // here we ar call the getProductCatgories() method and subscribing to the result that the method will rturn/publish, at the same time.
      data => {
        console.log("Product Catgories=" + JSON.stringify(data));   // logs can be viewed in chrome devloper tools, not on terminal.
        this.productCategories = data; // the returned data, which is an array of typr ProductCatgory, is assigned to productCategories array defined in this file.
      }
    );
  }

}
