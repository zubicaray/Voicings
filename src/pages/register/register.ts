import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {  HttpClient,HttpHeaders} from '@angular/common/http';


import 'rxjs/add/operator/map';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { LoadingController } from 'ionic-angular';
import { TranslationProvider } from '../../providers/translation/translation';


@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})


export class RegisterPage  {

  constructor(public navCtrl: NavController, 
    public http: HttpClient  , 
    private iab: InAppBrowser, 
    private ionLoading: LoadingController) {
  }

  amount: any;
  pay(){
    let data = {
      amount: this.amount
    }

    let loader = this.ionLoading.create({
      content: 'Please Wait...'
    });

    loader.present();

   
    //send desired amount to server for payment

    var formData=new FormData();
    formData.append('amount',this.amount);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'responseType': 'json'
      })
    };

    this.http.post('http://localhost:3000/createPayment',  JSON.stringify(data)  ,httpOptions   )

    .subscribe(
      (val) => {
          console.log("POST call successful value returned in body", 
                      val['links'][1]['href']  );

          this.iab.create( val['links'][1]['href']);
            loader.dismiss().then(value => {
              console.log("dismiss worked!");
          }, reason => {
              console.log("dismiss rejected!");
          });
          this.amount = ""  
         
          //var browser = this.iab.create(es.links[1].href);
      },
      response => {
          console.log("POST call in error", response);
      },
      () => {
          console.log("The POST observable is now completed.");

        
      

      });
   
    
  }

}
