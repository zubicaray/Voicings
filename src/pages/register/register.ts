import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { TranslationProvider } from '../../providers/translation/translation';
import { PayPal,PayPalPayment,PayPalConfiguration} from '@ionic-native/paypal';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})


export class RegisterPage  {

  constructor(public navCtrl: NavController, 
    private storage: Storage, public payPal: PayPal  , 
    private ionLoading: LoadingController,
    private TP: TranslationProvider) {
  
  }

  amount: any;

  pay(){

    let loader = this.ionLoading.create({
      content: this.TP.tr('Please Wait ...')
    });


    this.payPal.init({
      PayPalEnvironmentProduction: 'zubicaray@gmail.com',
      PayPalEnvironmentSandbox: 'AcjInm0WPRMWkQcyVi0mFdmR-jQCU5R5uH-7wS_yAyWpNBU35D5BIk2E6EjuHuGsnX29oGBE_qVmMD6F'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let payment = new PayPalPayment('3.33', 'EUR', 'Description', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then((res) => {
          console.log(res);
          // Successfully paid
          console.log(res);
          loader.dismiss();
          this.amount = "";
          // Example sandbox response
          //
          // {
          //   "client": {
          //     "environment": "sandbox",
          //     "product_name": "PayPal iOS SDK",
          //     "paypal_sdk_version": "2.16.0",
          //     "platform": "iOS"
          //   },
          //   "response_type": "payment",
          //   "response": {
          //     "id": "PAY-1AB23456CD789012EF34GHIJ",
          //     "state": "approved",
          //     "create_time": "2016-10-03T13:33:33Z",
          //     "intent": "sale"
          //   }
          // }
        }, (err) => {
          console.log(err);
          loader.dismiss();
          this.amount = "";
        });
      }, (err) => {
        console.log("ici"+err);
        loader.dismiss();
      this.amount = "";
      });
    }, (err) => {
      console.log("ici 2"+err);
      loader.dismiss();
      this.amount = "";
      this.storage.set("PAID","DONE");
    });
    
    
  }


}