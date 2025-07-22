import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];

  constructor(
    private orderHistoryService: OrderHistoryService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      if (user && user.email) {
        this.handleOrderHistory(user.email);
      } else {
        console.warn('User email not found or user not logged in');
      }
    });
  }

  handleOrderHistory(email: string) {
    // retreive data from orderHistoryService
    this.orderHistoryService.getOrderHistory(email).subscribe(
      data => {
        this.orderHistoryList = data._embedded.orders;
        console.log("List");
        console.log(this.orderHistoryList);  // here we are assigning the data returned by orderHistoryService to our orderHistoryList. orderHistoryService itself got the data from spring boot api. The service then mapped the JSON data (that it received from spring boot api) to an OrderHistory array (this happened inside the defined interface), and sent the mapped data to this order-history-component.ts file (when we made a call to service). Once we received the mapped data (i.e., the data mapped to an OrderHistory array), we simply assigned it to orderHistoryList defined here.
      },
      error => {
        console.error("Failed to fetch order history:", error);
      }
    );
  }

}
