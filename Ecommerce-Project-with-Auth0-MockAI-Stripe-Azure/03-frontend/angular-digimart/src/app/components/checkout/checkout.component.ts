import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutFormService } from 'src/app/services/checkout-form.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { DigimartValidators } from 'src/app/validators/digimart-validators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup! : FormGroup; // FormGroup is a clooection of form elments/other groups
  // The ! is known as the non-null assertion operator. For example, if we define a variable, the ! operator tells the compiler to ignore the possibility of it being undefined.

  totalPrice : number = 0;
  totalQuantity : number = 0;

  storage_l: Storage = localStorage;
  storage_s: Storage = sessionStorage;

  creditCardYears : number[] = [];
  creditCardMonths : number[] = [];

  countries : Country[] = [];
  shippingAddressStates : State[] = [];
  billingAddressStates: State[] = [];

  //initialize Stripe Api
  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo : PaymentInfo = new PaymentInfo();
  cardElement : any;
  displayError : any = "";

  // paramater to disable the Purchase button
  isDisabled : boolean = false;   // we want the purchase button to be disabled(not clickable) until REST api calls have been made(ie, we dont want that button to be active for the following time - the time after clicking purchase button and appearanc of order placd message(the message having order tracking number)). Because, if the button is active, user might click it multiple times after he has already clicked it the first time(the first times request is already under process, and in the meantime the user is again clicking it multipl times). We dont want that. Such activity can result in multiple orders being placed. Hence we want the button to be disabled after user has clickd it for the first time.

  constructor(private formBuilder : FormBuilder, 
    private checkoutFormService : CheckoutFormService, 
    private cartService : CartService, 
    private checkoutService : CheckoutService, 
    private router : Router) {}



  ngOnInit(): void {

    //setup stripe payment form
    this.setupStripePaymentForm();   // we want this stripe form to displayed in credit card section of checkout form as soon as the pag is loaded, hence e call this method inside the ngOnInit().

    // read the users email address from browsers session storage(this will used to pre-populate the email field in the checkout form)
    const theEmail = JSON.parse(this.storage_s.getItem('userEmail')!);


    // build the form using unjectd formBuilder
    this.checkoutFormGroup = this.formBuilder.group({  // we are creating a group of groups here
      customer : this.formBuilder.group({
        firstName : new FormControl('', [Validators.required, Validators.minLength(2), DigimartValidators.notOnlyWhitespace]),   // every field that we mntion in a form is a formControl class object
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), DigimartValidators.notOnlyWhitespace]),
        email: new FormControl(theEmail, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])   // we gave this email field an initial value of theEmail(which we obtained from session storage). Hnece we have pre-populated the email field.
      }),
      shippingAddress : this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), DigimartValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), DigimartValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), DigimartValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), DigimartValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), DigimartValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), DigimartValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        /*
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), DigimartValidators.notOnlyWhitespace]), 
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
        */
      }),
    });
    


    /*

    Commented due to Stripe

    //populate credit card months
    const startMonth : number = new Date().getMonth() + 1 ; //since months in Date are 0 Based, we add 1;
    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retreived credit card months : " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    //populate credit card years
    this.checkoutFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retreived credit card years : " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    */

    //populate countries array
    this.checkoutFormService.getCountries().subscribe(data => {
      this.countries = data;
  });


    this.reviewCartDetails();


  }

  setupStripePaymentForm() {
    //get a handle to stripe elements
    var elements = this.stripe.elements();

    //create a card element and hide postal code field
    this.cardElement = elements.create('card', {hidePostalCode : true});

    //add an instance of card UI component into the 'card-element'div (ie the div having id as "card-element". This div is present in checkout-component.html file)
    this.cardElement.mount('#card-element');   // this step will mount/insert/add the created cardElement(this.cardElement) into the div(of checkout-component.html file) that has an id "card-element"

    //add event binding for the 'change' evenbt on the card element
    this.cardElement.on('change', (event : any) =>{

      //get a handle to card-errors element
      this.displayError = document.getElementById('card-errors');   // corresponds to the div with id as "card-errors" in the checkout-component.html file
      if(event.complete){
        this.displayError.textContent = "";
      }
      else if(event.error){
        //show validation error to customer
        this.displayError.textContent = event.error.message;
      }

    });
  }


  //define getter methods to access the above FormControl fields
  // customer group
  get firstName(){
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  //shipping address group
  get ShippingAddressStreet(){
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get ShippingAddressCity( ) {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get ShippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }
  get ShippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }
  get ShippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  //billing address group
  get BillingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get BillingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get BillingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }
  get BillingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }
  get BillingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  //credit card group
  get CreditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
  get CreditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }
  get CreditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
  get CreditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }
  



  copyShippingAddressToBillingAddress(event) { // the event mentioned here captures any change in the state of chckbox(like if we tick or unitck the checkbop, both cases represent vents thus this fucntion gets executed for both checking and unchecking th box.)

      if(event.target.checked){
        this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
        this.billingAddressStates = this.shippingAddressStates;
        
      }
      else{
        this.checkoutFormGroup.controls['billingAddress'].reset();
        this.billingAddressStates = [];
      }
  }

  handleMonthsAndYears() {

    const cerditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const selectedYear : number = Number(cerditCardFormGroup?.value.expirationYear); // read the selected year from the form
    const currentYear = new Date().getFullYear();

    let startMonth : number = 1;

    if(selectedYear == currentYear){
      startMonth = new Date().getMonth() + 1;
    }

    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retreived months : " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName: string) {
  const formGroup = this.checkoutFormGroup.get(formGroupName);
  const countryCode = this.checkoutFormGroup.get('shippingAddress.country').value;


  console.log(`${formGroupName} selected country code : ${countryCode}`);

  this.checkoutFormService.getStates(countryCode).subscribe(data => {
    console.log("Retrieved states: " + JSON.stringify(data));

    if (formGroupName === "shippingAddress") {
      this.shippingAddressStates = data;
    } else {
      this.billingAddressStates = data;
    }

    formGroup?.get('state')?.setValue(data[0]);
  });
}


  reviewCartDetails() {
    // subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    // subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );

    // compute cart total Price and Quantity
    this.cartService.computeCartTotals(); 

    // instead of using Behaviour Subject(which has been used in videos) in cartService, we are explicitly calling computeCartTotals() function to get the latest totalQuantity and totalPrice values of the cart(these values returned/published after calling computeCartTotals() function above are then assigned to totalPrice and totalQuantity fields defined in this class(since we have subscribed to them in above code), and then are used in checkout-component.html file in review orders section/formGroup).
  }

  resetCart(){

    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    //reset the form
    this.checkoutFormGroup.reset();

    // remove cartItems from local storage as user is done with checkout . Hence his cart should be empty now(as order has been)
    this.storage_l.removeItem('cartItems');

    //navigate back to the products page
    this.router.navigateByUrl("/products");

  }

  onSubmitForm() {
    console.log("submitted");

    // check the validation status when submit button is clicked
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();  // touching all fields triggers the display of the error messages. 

      //If any user dos not touch any field that was required during filling the form, error will not appear(as for pour validator to show error on requird fields, the field must have been touched/mad dirty). So, when he clicks the submit button, we ourselvs mark all fields as touched, so that any empty required field that did not show error as it has not ben touched will now show error(as now everything has been touched).So the usr cannot escape without filling any required field.

      return;

    }
    
    //set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    console.log(`Total price is : ${this.totalPrice}`);

    //get cart items
    const cartItems = this.cartService.cartItems;

    //create orderItems from cartItems
    let orderItems : OrderItem[] = [];
    for(let i=0;i<cartItems.length;i++){
      orderItems[i] = new OrderItem(cartItems[i]);
    }

    //set up purchase
    let purchase = new Purchase();

    //populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    //populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    //populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;


    // compute the payment info(total amount) so that we can populate the paymentInfo object and send it using post request(by calling the checkout service method) to thye spring boot backend. This backend will in turn use this pass paymentInfo object info to create the  paymentIntent, which it will send to/get verfied from the strip servers.
    this.paymentInfo.amount = this.totalPrice;
    this.paymentInfo.currency = "INR";
    this.paymentInfo.receiptEmail = purchase.customer.email;
    // In order for stripe to send payment recpipt by email to the client, stripe must know the email address of the customer. Now we are directly providing the customers info(email, name, address) to strip directly through the confirmCardPayment method written below, but that info(along with credit card info) is going directly to strip servers. But for stripe to send payment receipt via email, th customers mail must b included in the paymentIntent, wheras in above case w are sending it dirctly to stripe servers via confirmCardPayment method. Thus, we include a ne field (receiptEmail) in paymentInfo object. This object ill be passed to backend and the valu of this new receiptEmail field will be usd by backend while creating paymentIntent (at th backnd). In this way, email will be present/included in paymentIntent and stripe will use that email to send payment receipt to the customer.

    



    // if the form is valid, then,
    //-create payment intent by calling the spring boot REST api(using our service class function). The spring boot api will crfeate the paymentIntent in backend.
    //-confirm card payment
    //-place order

    if(!this.checkoutFormGroup.invalid && this.displayError.textContent === ""){

      this.isDisabled = true;

      // We are just passing the PaymentInfo object from frontend to backend using the Backend REST api Post endpoint. Using the data prsent in the passed PaymentInfo object, PaymentIntent will be created in the backend.For the function createPaymentIntent() defined in checkoutService, the name "create" dos not mran we are actually creating the PaymentIntent in frontend, we are just passing the info to backnd where the PaymentIntent will be actually created. This function is a type of middle man, hence we named it "create". Lityeral creation is not happening here.It happens at backend.
      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(     // here we are calling the REST api via checkout service to make a post request so as to send the paymentInfo object to the backend. 
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret, {
            // this is a method of stripe api (confirmCardPayment) that will send the entered credit card data (which is stored in cardElement) and the billing details(which we manually populate in the below code directly to the stripe servers. The credit card data will not be sent to our local server.
            payment_method : {
              //firstly, send the card data
              card : this.cardElement,

              // along with credit card data, we will also send manually populated billing details data directly to stripe servers.
              billing_details : {
                email : purchase.customer.email,
                name : `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                address : {
                  line1 : purchase.billingAddress.street,
                  city: purchase.billingAddress.city,
                  state: purchase.billingAddress.state,
                  postal_code: purchase.billingAddress.zipCode,
                  country : this.BillingAddressCountry.value.code
                  
                }
              }
            }

          }, { handleActions : false}).then(function(result){
            if(result.error){
              // inform the customer that there was an error
              alert(`There was an error : ${result.error.message}`);
              this.isDisabled = false;
            }
            else{
              // call the REST API via checkoutService to store the purchase order in the database
              this.checkoutService.placeOrder(purchase).subscribe({
                next : (response : any) => {
                  alert(`Your order has been received.\nOrder tracking number : ${response.orderTrackingNumber}`);

                  //reset the cart after order has been placed successfully
                  this.resetCart();

                  this.isDisabled = false;
                },
                error : (err : any) => {
                  alert(`There was an error : ${err.message}`)
                  this.isDisabled = false;
                }
              });
            }

          }.bind(this)); 
        }
      );
    }
    else{
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

  }


}





/*
We did 4 main things related to Stripe and order placing here(all 4 were done in this file only, a small part(createPaymentIntent function) was written in checkoutService) : 
1. We mounted/inserted the stripe element in our checkout-component.html file(this replaced our created credit card section from the checkout form)
2. We made a REST api call to backend by passing a paymentInfo object(we did this by calling the createPaymentIntent function using in checkoutService ). This call pass the PaymntInfo object to backend amnd the backnd created a PaymentIntent using the passed info
3. We directly transferred th credit card details of the users to stripe servers (using this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,.....)
4. We made a REST api call to backend for saving the purchase order in the database(happened by calling this.checkoutService.placeOrder(purchase).subscribe...)
*/






