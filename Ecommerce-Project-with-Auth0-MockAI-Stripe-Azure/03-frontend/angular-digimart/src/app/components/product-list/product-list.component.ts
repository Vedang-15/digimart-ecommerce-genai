import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products : Product[] = [];    // declaring th product array. The elements present in this array are renderd in product-list-component view on our angular app. This is using a for loop defines in product-list-component.html file.

  currentCategoryId : number = 1;
  previousCategoryId: number = 1;
  searchMode : boolean = false;

  // new properties for pagination
  thePageNumber : number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;

  previousKeyword : string = "";



  constructor(private productService : ProductService, private route : ActivatedRoute, private cartService : CartService) { }  // here route now corresponds to the current active route that loaded the component. Useful for accessing route parameters.

  ngOnInit(): void {   // similar to @PostConstruct in java, once initialisation is done, this method  will be called
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts(){

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    }
    
  }

  handleSearchProducts(){

    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // if we have a different keyword than previous, then set thePageNumber to 1
    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1;

    }

    this.previousKeyword = theKeyword;

    console.log(`keyword = ${theKeyword}, thePageNumber = ${this.thePageNumber}`);

    //now search for products using obtained keyword, pageNumber and pageSize
    this.productService.SearchProductListPaginate(this.thePageNumber - 1, this.thePageSize, theKeyword).subscribe(
      data => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      }
    );
    console.log("products : " + this.products);
  }

  handleListProducts(){

    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string and convert the string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else {
      // if category id is not available ... default to category 1
      this.currentCategoryId = 1;
    }




    // check if we have a different catgory id than previous
    // Note : Angular will reuse a component if it is currently being viewed, so if we are viewing a different catgory id that previous and angular is reusing the same component that it used for previous id, even for new category id, it ill rnder the page no. that it rendered for previous id. We dont ant that. If it is a new id, we want to show its first page to user. It will look bad if user clicks on mouse pads, and directly say, page 3 appears(it might happen if angular decides to reuse the same component that it used for last category id, say luggage tag, and we were on page 3 of luggage tags before we clicked mouse pads. So, even though category has changed, since angular is reusing the same component, it will retain the page no. as 3, and show third page even for mouse pads). We dont want this. We want first pag to come up everytime a new category is chosen.To ensure this, we are riting the folloing code.

    if(this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId; // asign current category id to previous, as current ill become previous if someone visits a new category.
    console.log(`currentCategoryId = ${this.currentCategoryId}, thePageNumber = ${this.thePageNumber}`);

    // now get the products for the given categhory id, page number and size
    this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId).subscribe(
      data => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      }
    );
    // we are sending this.thePageNumber - 1, becauyse in pagination component of ng-bootstrap, pages are 1 based, while in spring data rest, pages are 0 based.

  }


  updatePageSize(pageSize : string){
    this.thePageSize = +pageSize;
    this.thePageNumber = 1; // whenever the user selects a page size, we want to again show him the first page (with the modified page size.) Hence we reset thePageNumber to 1.Note that this methos will be called only when user tries to select a page size, so this ppage number reset will happen only the, not at any other time.
    this.listProducts(); //after user selects a new page size, we again ned to render the list component, hence we directly call this.listProducts(), instead of directing him to any route. Also since thePageSize and thePageNumber have been updated in above lines, this listProducts() call will render products in accordance with the updated thePageSize and thePageNumber.
  }


  addToCart(theProduct : Product){
    console.log(`Adding to cart, ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCartHelper(theCartItem);

  }

}
