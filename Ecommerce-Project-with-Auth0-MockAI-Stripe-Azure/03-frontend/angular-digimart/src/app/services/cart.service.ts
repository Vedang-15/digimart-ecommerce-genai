import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems : CartItem[] = [];

  totalPrice : Subject<number> = new BehaviorSubject<number>(0); // Subject is a subclass of Observable. We can use Subject to publish events in our code. The event will be sent to all of the subscribers.

  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage : Storage = localStorage;

  constructor() {

    // read the data from the browsers session storage an populate the above declared cartItems with the data(ie the value crresponding to the key 'cartItems') present in the browsers session storage
    let data = JSON.parse(this.storage.getItem('cartItems')!);  // JSON.parse converts the data pbtained from storage(using the key 'cartItems'), into an object. The data is present as a string in the storage hence we convrt it to an object after rtreival.

    if(data != null){
      this.cartItems = data;

      //compute totals based on the data retreived from storage
      this.computeCartTotals();  
      // since we are computing cart totals here, all methods that had subscribd to computeCarTotals() method as well as totalQunatity and totalPrice fields(which are in turn evaluated/modified inside/by computeCartTotals() method, remember the to ways of subscription), will get the updated values. Since cartStatus had also subscribed(inside cart-status-component.ts, we had subscribed to totalQunatity and totalPrice fields, which get modified hen computeCartTotals() method is called), hence cart status will also get updated. Thus, if anything was presenmt in browser storage, it value will get reflected in the cart status fiels in header bar. This all is happening before the user has started adding items to cart. we are just showing him what is present in the cart already(might be he add it to the cart during previous browsing session, or he might have refreshed, anything), byw reading it from the browser local storage. Since we ant to check if there is anything in the browser local storage and display it before the user starts adding/modifying the contents of cart, hence we put this code ion constructor itself). This ensures, as soon as the app starts, browser memory is checked for existing cartyItems. If something is present, the cartItems array is  populated with the existing data, and cart-status also gets updated due to subscription(as we call computCartTotals() method inside constructor). Then user is free to do anything no as app has startd. Any changes that he makes to cart are the subsequently shown using all code e have writtn earlier(like adding/deleting/removing items etc). Thus, normal flow begins. We did this to avoid data regfreshing due to browser refresh proble. Now data is saved in browser local storage and retreived when app starts/browsr refreshes.
    }
  }

  persistCartItems(){
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems)); //whenever this method is called, we take the cartItems object, convert it to a string using JSON.stringify and add the obtained string to browser session storage against the key 'cartItems'. So basically if storage does not have an entry with the key 'cartItems', It gets added, and if it does have an entry, the value corresponding to existing key 'cartItems' gets updated with this newly obtained string.
  }


  addToCartHelper(theCartItem : CartItem){
    
    // check if we already have the item in our cart
    let alreadyExistsInCart : boolean = false;
    let existingCartItem : CartItem = undefined!;

    if(this.cartItems.length > 0){
      // find the item in cart based on item id;
      for(let tempCartItem of this.cartItems){
        if(tempCartItem.id == theCartItem.id){
          existingCartItem = tempCartItem;
          break;
        }
      }
    }

    //check if we found it
    alreadyExistsInCart = (existingCartItem != undefined);
    if(alreadyExistsInCart){
      existingCartItem.quantity++;
      
    }
    else{
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and quantity
    this.computeCartTotals();
  }


  computeCartTotals() {
    // compute the total values
    let totalPriceValue : number = 0;
    let totalQuantityValue : number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += (currentCartItem.quantity * currentCartItem.unitPrice);
      totalQuantityValue += currentCartItem.quantity;
    }

    //publish the new values, all subscribers will recive the new data.
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    // the next command written in above two lines is used to publish/send the totalPrice and totalQuantity to all the subscribers. In our case the cart-status-component is the subscriber. Once these values are published and it receives these valus, it rnders these obtained values in its cart-status-componnt.html file. To send information to the subsrciber, there are basically two ways, 1) you call a method alongwith the subscriber that returns an observable(which we did in case of list-product-component : this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId).subscribe(). There inside the handleListProducts() methos, we used to call subscribe on getProductListPaginate() method, and this method(defined inside products-service.ts file) used to return an observable), and bottom line is that both calling the mthod and subscription are happening at same time in that single line .2) You directly call service.ValueToBeReturned.subscribe (as we in cart-status-component.ts file : this.cartService.totalPrice.subscribe() and make the cartService return a Subject using next command instead of an observable.) Here, for cart-status, we are usign 2nd method of publishing a subject instead of returning an observable.Both are used to populate the values. 

    // The difference between them is : In first case, I am saying, publish the result (or evaluate those values) rightnow and return them to me, I will populate them right now. In second case, we are saying, whenver these values are evaluated(these values might be evaluated when some other component calls a method that calculates these values), just send them to these declared values, ie whenever these values will be published, just populate/update my declared fields as well. I dont want those values right now(hence in seond case we do not call any function that evaluated these values, we simply subscribe and expect that whenever these values are evaluated, just update my fields with updated values). I dont need those values right now. In first case, we wanted to get those values evaluated and populated right now.

    // A use case for this can be seen as : In product-list-components, product-category-menu-component tc, we needed those values right then tot display the categories and products on our app. Hnce we used first case. Also consider cart-details, whenever add to cart is clicked, we want th totalPrice and totalQuantity values. So for this, we did not use first type, but as soon as we subscribed, we explicitly called the computeCartTotals() method, that evaluated and published these values, so though we did not explicitly use first type, we did the same thing(by calling the evaluating mthod ourslves). So this is quivalent to first type onnly. If we had not ecplicitly called the computeCartTotals() method, the values of totalQuantity and totalPrice defined in cart-details-component.ts file would have been 0, as this cart-details-component is being instantiated later(after the cart has been field), so its value is 0. After instantiation, if the cart content gts altered, then that new changes will be rflected in cart-details's totalPricePrice and totalQuantity(as we have subcribed to the cartService). But just subscrtibing(that is the second way, where we dont call any evaluyating function) ensur4es taht all future events iull be received in th subscribed fields, noty the past events. If we want the current vales(which is comnbination of all things happened in past), e have to call the evaluating function(hich then becopmes equivalent to first type, which is what we have done here) .
    
    // On the other hand, consider cart-status component. Here we simply need to dispay the existing totalPrice and totalQuantity(we dont need to first calculate and then dispaly, we just need to display whateecer the cart status is, but we also beed to ensure, whenver the totslPricve and totalQuantity change, styatus should be updated.)So in cart-status-component.ts file, we used the second type. We only subcrtibed to totalPrice and totalQUANTITY, We did not call any function(computeCartTotals()) that is going to evaluate those values. Actual evaluation happens when we click add to cart button(as computeCartTotals() is called there, hnce we explicity call the method there, making that process first-type equivalent). But in cas of cart-status, we use second type, and just subscribe, we dont call any evaluating method. Whenever the method(computeCartTotals()) is called by clicking add to cart button, status gets updated as in status-component.ts, w have subscribed to cartService methos(inside this computeCartTotals() is defined which evaluates and publishes those values).

    //Even in the case of reviewing cart content section in checkout-form, we use first type equivalnt. Since that component is instantiated later, if we only subscribe without calling any evaluating function(ie use second type method), the initial values of toptalPrice and totalQuantity defined in checkout-component.ts file) will be 0(since this component is being instantiated later, hence all future changees to the cart will be reflected due to subscription , but past will not be counted, hence values will be 0). To avoid this, we can either use behaviour subject in cartService.ts or simply call computeCartTotals() method cplicity inside checkout-component.ts file, thus making first method equivalent(this is what i have done). Once computeCartTotals() is called, values of totalQuantity and totalPrice defined in chckout-component.ts will be populated and then later used/displayed in checkout form of checkout-component.html file.This is similar to cart-details scenario. In both cases, problem as occuring as those components were getting instatntiated later(after some operations on cart had been performd and we were not calling any valuating function explicitly, we were just subscribing, due to which latest valus(of totalprice and totalquantity) were not being reflected. To solve it, w used first-type equivalent, by explicitly calling the evaluation compoteCartyTotals() function just after subscriptuon. Due to it, latest values were valuated, published and these fileds(totalPricve and totalQuantity) were populated with latest values.

    //But since cart-status was being initiated just after application started , we did not need to call the evaluating function there, we just used the second type, ie we only subscribes, ww did not call evaluating function. Any changes made to cart happened after initialisation of cart status component(since it was initialised at very start of application), hence all changs wre future changes and were clearly reflected in cart-status fields due to subscription. but cart -details and checkout-component wrere not instantiated at start, they were instantiated later, hence we had to use first-type equivalent, and call computeCartTotals() explicitly, to get info of current values(which came as a result of past changes-ie the changes that occured before instantiation of cxart-deatils and checkout components).



    //persist the cart data
    this.persistCartItems();

    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue : number, totalQuantityValue : number) {
    console.log("contents of the cart : ");
    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name : ${tempCartItem.name}, quantity = ${tempCartItem.quantity}, unitPrice = ${tempCartItem.unitPrice}, subtotalprice : ${subTotalPrice}`);

    }
    console.log(`totalPrice : ${totalPriceValue.toFixed(2)}, totalQuantity = ${totalQuantityValue}`);
    console.log("------------------");
  }

  decrementFromCartHelper(theCartItem : CartItem){

    // In typescript, Objects and arrays are passed by reference. Primitive values like number, string, boolean are passed by value. 
    //So, since theCartItem is an object that is passed, any change made to this passed theCartItem object will be reflected in cartItems Array. Note that, we are passing this cartIterm from the html file, when minus button is clicked. So effectively, we rendered the objects present in array, and are passing one of those array objects only when minus symbol is clicked, and since in typescript, objects are passed by refernec, it is th same object that is being passed(without creating any copy). Hence any change made to this object will be reflected in array as changinjg this object means we are changing the actual array object(that was passed when minus was clicked) as both are same due to pass by reference.

    theCartItem.quantity--;

    if(theCartItem.quantity == 0){
      this.removeFromCartHelper(theCartItem);
    }
    else{
      this.computeCartTotals();
      // since we are decrementing an item, we again need to calculate total price and quantity and publish it to all subscribers so that they can update this info in their respective component views.
    }
  }

  removeFromCartHelper(theCartItem : CartItem){  
    // since objects are passd by refernec in typescript, this theCartItem that was passed, is actually the same item which is present in array.

    // get the index of this item in array
    const itemIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id == theCartItem.id);

    if(itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
      // since we are removing an item, we again need to calculate total price and quantity and publish it to all subscribers so that they can update this info in their respective component views.
    }

  }

  
}


