import { Component, ViewChild } from '@angular/core';
import { Nav, Platform,AlertController, App  } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
import { TranslationProvider } from '../providers/translation/translation';
import { HomePage } from '../pages/home/home';
import { VoicingsListPage } from '../pages/voicings-list/voicings-list';
import { TunningListPage } from '../pages/tunning-list/tunning-list';
import { RegisterPage } from '../pages/register/register';




@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any =HomePage;
  checkSum:string;

  pages: Array<{title: string, component: any}>;


  constructor(private TP: TranslationProvider, private alertCtrl: AlertController,public storage :Storage,
    public app:App,public platform: Platform, public statusBar: StatusBar) {
    //this.splashScreen.show();
    this.initializeApp();

    
   
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage }
    ];

  }


  initializeApp() {
   

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      // if (this.platform.is('cordova')) { 
      // this.backgroundMode.enable(); }
      
      



      this.platform.registerBackButtonAction(() => {
        const overlay = this.app._appRoot._overlayPortal.getActive();
        const nav = this.app.getActiveNav();
      
        if(overlay && overlay.dismiss) {
          overlay.dismiss();
        } else if(nav.canGoBack()){
          //alert("go back")
         
          nav.pop();
        } else  {

          this.confirmQuitting();
         
        }
        //this.splashScreen.hide();
       
      });
     

    });
   
  }
  confirmQuitting(){	
		let alertPopup = this.alertCtrl.create({
      title: this.TP.tr('Leave the app? No changes to save?'),
			cssClass: 'alertCustomCss',
	
			buttons: [
			{
				text: this.TP.tr('Quit'),			
				handler: () => {
          this.platform.exitApp();
				}
			},
      {
				text: this.TP.tr('Cancel'),			
				handler: () => {
				}
			}]
		});

		// Show the alert
		alertPopup.present();
	}

  openHomePage() {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(HomePage);
  }

  openVoicingsList() {
    this.nav.setRoot(VoicingsListPage);
  }

  openTunningPage() {
    this.nav.setRoot(TunningListPage);
  }
  openPurchasePage() {
    this.nav.setRoot(RegisterPage);
  }
  exit(){
     this.platform.exitApp();
  }

}
