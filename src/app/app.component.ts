import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';




import { HomePage } from '../pages/home/home';
import { VoicingsListPage } from '../pages/voicings-list/voicings-list';
import { TunningPage } from '../pages/tunning/tunning';
import { RegisterPage } from '../pages/register/register';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any =VoicingsListPage;//HomePage;//

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,private backgroundMode: BackgroundMode) {
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
      if (this.platform.is('cordova')) { 
       this.backgroundMode.enable(); }
      this.splashScreen.hide();
    });
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
    this.nav.setRoot(TunningPage);
  }
  openPurchasePage() {
    this.nav.setRoot(RegisterPage);
  }
  exit(){
     this.platform.exitApp();
  }

}
