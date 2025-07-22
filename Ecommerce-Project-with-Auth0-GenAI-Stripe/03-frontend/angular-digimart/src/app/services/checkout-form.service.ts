import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutFormService {

  private countriesUrl = environment.digimartApiUrl + "/countries";
  private statesUrl = environment.digimartApiUrl + "/states";
  // digimartApiUrl is defined in environment.ts file(also in all other custom environmnt files. It takes different values basd on the environment in which w are runningm our app)

  constructor(private httpClient : HttpClient) { }

  getCountries() : Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(map(response => response._embedded.countries));
  }

  getStates(theCountryCode : string) : Observable<State[]>{

    // create the search url based on the passed country code.
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(map(response => response._embedded.states)); // this embedded.states refers to states filed that is present in returned JSON response

  }

  getCreditCardMonths(startMonth : number) : Observable<number[]>{
    let data : number[] = [];
    // build an array for "Month" dropdown list(this dropdown is defined in checkout-component.html)
    //start at current month and loop unitl 12th month

    for(let theMonth = startMonth; theMonth<=12; theMonth++){
      data.push(theMonth);
    }

    return of(data);  //the of operator will wrap the data array as an observable and we will then return this observable( note that in this methos declaration, the rturn type is Observable<number[]>, which is exactly what we are rturning, data is a number array, and of(data) is an obsrvable of number array)

  }

  getCreditCardYears() : Observable<number[]> {

    let data : number[] = [];

    //build an array for "year" dropdown list
    // start at currnt year and loop for next 10 years

    const startYear : number = new Date().getFullYear(); // gives current year
    const endYear : number = startYear + 10;

    for(let theYear = startYear; theYear<=endYear; theYear++){
      data.push(theYear);
    }

    return of(data);
  }

}

interface GetResponseCountries{
  _embedded : {
    countries : Country[];
  }

}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }

}
