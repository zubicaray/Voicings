import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslationProvider } from '../../providers/translation/translation';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
		private TP: TranslationProvider) {

      

  }

  private openURL(){
    window.open('https://www.youtube.com/channel/UC2S0nC_cM0HtrRYD4flUz2w','_system');
  }

}
