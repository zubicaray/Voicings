import { Component } from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { TranslationProvider } from '../../providers/translation/translation';

import { Storage } from '@ionic/storage';
import { TunningListPage } from '../tunning-list/tunning-list';

declare var paypal_sdk: any;

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})


export class RegisterPage  {


  payPalConfig: any;
  PAYPAL_CLIENT_ID_TEST = "9L776DDJ2C4Y2"
  PAYPAL_CLIENT_ID_LIVE = "AcjInm0WPRMWkQcyVi0mFdmR-jQCU5R5uH-7wS_yAyWpNBU35D5BIk2E6EjuHuGsnX29oGBE_qVmMD6F"
  PAYPAL_CLIENT_ID = this.PAYPAL_CLIENT_ID_LIVE 

  constructor(public navCtrl: NavController, private alertCtrl: AlertController,
    private storage: Storage , 
    private ionLoading: LoadingController,
    private TP: TranslationProvider) {

      this.amount="3";
      let enviroment = ""
      if (this.PAYPAL_CLIENT_ID == this.PAYPAL_CLIENT_ID_TEST) {
        enviroment = "sandbox"
      }
      else {
        enviroment = "live"
      }
      this.payPalConfig = {
        env: enviroment,
        client: {
          sandbox: this.PAYPAL_CLIENT_ID,
        },
        commit: false,
         createOrder: (data, actions)=> {
          return actions.order.create({
              purchase_units: [{
                  amount: {
                      value: this.amount,
                      currency: 'EUR' 
                  }
              }]
          });
      },
        // Finalize the transaction
        onApprove: (data, actions) => {
          //console.log(data)
          //console.log(actions)
          return actions.order.capture()
            .then((details) => {
              // Show a success message to the buyer
              console.log(details)
              let status = details["status"]
              if (status == "COMPLETED") {
                console.log(details);
                // Successfully paid
                this.storage.set("PAID","DONE");
                //loader.dismiss();
                this.amount = "";
                this.alert(this.TP.tr("Thanks a lot!!"),this.TP.tr("You can set and use your own tunning now ..."))
					      this.navCtrl.setRoot(TunningListPage);
              }
              else {
                //Status not completed...
              }
              console.log('Transaction completed by ' + details.payer.name.given_name + '!');
            })
            .catch(err => {
              console.log(err);
              // deal with error
            })
        }
        ,
        onError: (err) => {
          // Show an error page here, when an error occurs
          console.log(err)
          // deal with error
        }
      }
  
  }

  alert(inTitle:string,msg:string){	
		let alertPopup = this.alertCtrl.create({
			title: inTitle,
			cssClass: 'alertCustomCss',
			message: msg,
			buttons: [
			{
				text: this.TP.tr('Ok'),			
				handler: () => {
				}
			}]
		});

		// Show the alert
		alertPopup.present();
	}
  validPurchase(id) {
    // Purchase confirm 
    //Do whatever you want to do
  }
  ionViewDidEnter() {
    
    paypal_sdk.Buttons(this.payPalConfig).render('#paypal-button');
  }

  amount: any;

  

}