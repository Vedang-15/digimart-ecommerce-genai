import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentInfo } from '../common/payment-info';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  // send current purchase data to backend using suitable url
  private purchaseUrl = environment.digimartApiUrl + "/checkout/purchase"; // we will make post request to backend using this url

  private paymentIntentUrl = environment.digimartApiUrl + "/checkout/payment-intent"; // // we will make post request to backen using this url and the bosy of that post request will have PaymentInfo class object.

  // digimartApiUrl is defined in environment.ts file(also in all other custom environmnt files. It takes different values based on the environment in which w are runningm our app)

  constructor(private httpClient : HttpClient) { }

  placeOrder(purchase : Purchase) : Observable<any>{

    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }

  createPaymentIntent(paymentInfo : PaymentInfo) : Observable<any>{

    console.log("hii");
    console.log(paymentInfo);


    return this.httpClient.post<PaymentInfo>(this.paymentIntentUrl, paymentInfo);
  }
}
