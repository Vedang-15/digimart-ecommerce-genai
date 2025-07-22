import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = environment.digimartApiUrl + "/orders";
  // digimartApiUrl is defined in environment.ts file(also in all other custom environmnt files. It takes different values basd on the environment in which w are runningm our app)

  constructor(private httpClient : HttpClient) { }

  getOrderHistory(email: string): Observable<GetResponseOrderHistory> {
  const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${email}`;
  return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
}


}

interface GetResponseOrderHistory {
  _embedded : {
    orders : OrderHistory[];  // Here we are mapping the JSON data returned by spring boot api top an OrderHistory array and this mapped data will be assigned to orderHistory array (orderHistoryList) defined in order-history-aomponent.ts file(inside the subscription part).
  }

}



/*
Q...
While populating productCategories, we made a call to spring boot backend in product-service, and we wrote the following return statement :
return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(map(response => response._embedded.productCategory));

But during populating the OrderHistory array by making api call to backend, e are riting the following rturn statement:
return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);

Why have we omitted the.pipe() part that we have been using earlier?



Ans...
If the API response(ie the response from spring boot backend api) already has the desired structure and no transformation is needed, you can return the Observable directly without using.pipe(map(...)).

• Use.pipe(map(...)) when you need to transform or extract data from the API response.
• Omit.pipe(map(...)) when the API response is already in the desired format.

*/
