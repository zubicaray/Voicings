import { Component, ViewChild } from '@angular/core';
import { Nav, Platform,AlertController, App  } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';



import { TranslationProvider } from '../providers/translation/translation';
import { HomePage } from '../pages/home/home';
import { VoicingsListPage } from '../pages/voicings-list/voicings-list';
import { TunningListPage } from '../pages/tunning-list/tunning-list';
import { RegisterPage } from '../pages/register/register';
import { SongType,ConfigurationProvider} from    '../providers/configuration/configuration'





declare var digest;



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any =HomePage;
  checkSum:string;

  pages: Array<{title: string, component: any}>;


  constructor(private TP: TranslationProvider, private alertCtrl: AlertController,public storage :Storage,public app:App,public platform: Platform, public statusBar: StatusBar, 
    public splashScreen: SplashScreen, private configurationProvider:ConfigurationProvider) {
    this.initializeApp();

    
    this.storage.get("VoicingsList").then( 

      (list:SongType[])=> {
        console.log("MODULE checkSum deb")
        
        this.configurationProvider.setFirstCheckSum(list);

        

      }
    )

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
      this.splashScreen.hide();



      this.platform.registerBackButtonAction(() => {
        const overlay = this.app._appRoot._overlayPortal.getActive();
        const nav = this.app.getActiveNav();
      
        if(overlay && overlay.dismiss) {
          alert("dismiss")
          overlay.dismiss();
        } else if(nav.canGoBack()){
          //alert("go back")
         
          nav.pop();
        } else  {

          this.confirmQuitting();
         
        }
       
      });


    });
   
  }
  confirmQuitting(){	
		let alertPopup = this.alertCtrl.create({
      title: this.TP.tr('Leave the app ?'),
			cssClass: 'alertCustomCss',
	
			buttons: [
			{
				text: this.TP.tr('Ok'),			
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
