import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';


// the main purpose of defining service classes, is to have a dedicated classes that do the side job of our application. Like fetching the data from spring boot app, fetching current date/years from any other api tc all these things are done in service classes defined seperately to ensure that these functionalities do not get mixed with our actual application logoc. All service classes are basically helper classs. And using services to seperate side job logic from application logic is encouraged by angular as well. Hence they gave us ng generate service command.
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = environment.digimartApiUrl + "/products";   
  // this is the URL from which angulars HttpClientModule will try to obtain JSON data. This JSON data will have list of products

  
  // digimartApiUrl is defined in environment.ts file(also in all other custom environmnt files. It takes different values basd on the environment in which w are runningm our app)

  private catgoryUrl = environment.digimartApiUrl  + "/product-category";
  // Http client modul will us this url to gt list of all ProductCategory objects from the spring boot rest api.


  constructor(private httpClient : HttpClient) { }


  // here we define the getProductList mthgod used inside product-list-component.ts and the getProductCategories method used inside product-category-menu-component.ts files.

  getProductList(theCategoryId : number) : Observable<Product[]>{
    
    //need to biuld url based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(map(response => response._embedded.products));
    // now the angular http client will make a request to spring boot app with this searchUrl and whatevr the data is returned by spring boot app, it will be mapped to products array now. Earlier the data returned by baseUrl was being mapped as we hass this.baseUrl instead of searchUrl in this expression. We already know that spring boot app will return prducts depending on category when we visit the url of /search/findByCategoryId?id=something(this happened due to the findByCategoryId method that we implemented in ProductRepository in spring boot app).Thus all products blonging to a catgory will b returnd, mapped and stord in products array(This array has been dclared in product-list-componnt.ts). If we used this.baseUrl, we gett all products, but if w use searchUrl, we get products blonging to id prsnt in sarchUrl.

  }

  getProductCategories() : Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.catgoryUrl).pipe(map(response => response._embedded.productCategory));  
    // this productCatgory in  _embedded.productCategory is the same name as declared in GetResponseProductCatgory LHS belo.
    // the data returnd by spring boot rest api will be mapped to productCategories array. The returnd data will have objects corresponding to all product categories thatw e have in our database

  }


//below method is for pagination while displaying list of products based on category
  getProductListPaginate(thePage: number, thePageSize: number, theCategoryId: number): Observable<GetResponseProducts> {

    console.log(`Getting products from - ${this.baseUrl}`);
    
    //need to biuld url based on category id, page number and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}` +  `&page=${thePage}&size=${thePageSize}`;
    // earlier when we were not passing page number and size through url, spring data rest as always rturning the 1st page with default size 20. With this modified url, it will rturn the rquested page of requested siz edepoending on passed values of page numbr and size.

    
    return this.httpClient.get<GetResponseProducts>(searchUrl);
    //We are not using pipe in above line , ie we are writing above line instead of  return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(map(response => response._embedded.products)); This is beacuse when we use the sybtax with pipe, we are actuallt mapping product array presnt in returnd JSON to our defined products array. This happens in the part : response => response._embedded.products. Note that only the products array is not present in the returned response.The returned response also has the page section(having page number, total pages, total elements etc). Uptil now , it was of no use to us(while finding products by categoryId, or while searching by kyword). But during pagination, that info is usful as we assign that returned info parameters to thePagNumber, thePageSize, and theTotalElements fields declared in product-list-component.ts file. Hence w need it. Thats why, we dont map only the products array, we send the entire obtained info(including both products and page info) to the function that calls this getProductListPaginate() methos, ie to listProducts() methos, wher it is used. Thus, since that info is useful, we dont use pipe and send/map the entire rceived JSOn info. Also note the return type of this function is GetResponseProducts (written inside Observable part in function declaration) and not Products[](like that written inside Observable of getProductList() method) as we are returning the entire obtained JSON response, not just the populated products array.

  }

  searchProducts(theKeyword: string): Observable<Product[]> {

    //need to biuld url based on the passed keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;


    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(map(response => response._embedded.products));
    // will map the returned data to products array. The returnbed data will have all the product objects whose names contain the passed keyword "theKeyword".
    // This uses the same GetResponseProducts methos as usd by getProductList() method since in both of thse cases, we are getting a list of products only from the spring boot rest api.
  }


// below method is for pagination while searching by keyword
  SearchProductListPaginate(thePage: number, thePageSize: number, theKeyword: string): Observable<GetResponseProducts> {

    //need to biuld url based on keyword, page number and size
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}` + `&page=${thePage}&size=${thePageSize}`;
    

    return this.httpClient.get<GetResponseProducts>(searchUrl);
    

  }

  getProduct(theProductId : number) : Observable<Product>{

    //need to build url based on the passed product id
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
    //Here, we get a single product whose id is same as the passed id(ie theProductId).
    // note that since we are getting back a single product here, we dont need to unwrap the_embedded info(there is not _embedde tag in returned JSON as the JSOn contains a single product and hence we dont neet a GetResponseProduct function here like we used in getProductList. We used it there as that was getting a list of products in JSON format from rest api and hence we needed to unwraping  _embedded info and map it to Product array. Hence we used an interface there)
  }




}

// note : getProductList() and searchProducts() methods were being used befor pagination support was added. Now we are using getProductListPaginate() and searcgProductListsPaginate() methods.

interface GetResponseProducts {
  _embedded : {
    products : Product[];
  },
  page : {
    size : number,
    totalElements : number,
    totalPages : number,
    number : number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];   // define LHS as productCatgory only , not as productCategories. LHS name must match with JSON data header that is returnd inside embedded. Returned JSON data header has -productCategory, hence we must use productCategory instead of poductCategories. Also, for product case, JSON header has -products, so we used products in above interface. Here we are mapping the JSON data returned by spring boot api to a ProductCategory array(hence e write productCategory: ProductCategory[];). Then this data will the be assigned to productCategories array defined in product-category-menu.component.ts file(in subscription part) and this popultaed ProductCategories array of product-category-menu.component.ts file ill be used ahead.
  }
}


/*
Q... 
  Why are we using the folloing interface :
  interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
  }

Ans...
  We use this to map the REST API JSON results to an array of ProductCategory objects in TypeScript.

  If we write in code

  return this.httpClient.get(this.baseUrl)...

  then response will be a general Object that is not usable.To avoid this situation we need use generic option:

  return this.httpClient.get < SOME DTO > (this.baseUrl)

  Where "SOME DTO" is a name of DTO class for automagic conversion from JSON to Object.
  In our case this class will be used only in ProductService, that's why it was declared in product.service.ts file.

>>>>>> Why we can't use class instead interface for DTO object i don't know.May be it is some Angular specific for JSON conversion process.
Reply : 
You can also use a class for this solution.The common trend in the Angular world is to use interfaces.But either approach will work.

>>>>>> Can I think this get < DTO > serves a function of casting ?
Reply : 
In general you can loosely think of it that way.We are effectively reading the JSON and converting to an object of type DTO. 
** If we ar using "get<GetResponseProducts>", means we are converting/mapping the received JSON   data to an array of type Product, ie mapping tp Product[].
** If we ar using "get<GetResponseProductCategory>", means we are converting/mapping the received JSON data to an array of type Product, ie mapping tp ProductCategory[].
** But if we are using, get<Product>(productUrl) , we get a single product and since we are getting back a single product here, we dont need to unwrap the_embedded info(there is not _embedde tag in returned JSON as the JSOn contains a single product and hence we dont need a GetResponseProduct function here like we used in getProductList. We used it there as that was getting a list of products in JSON format from rest api and hence we needed to unwraping  _embedded info and map it to Product array. Hence we used an interface there). Thus we do not define any interface in this case.


*/






