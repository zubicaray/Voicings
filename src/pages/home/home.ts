import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';




@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

      

  }
  //@ts-ignore
  private openURL(){
    window.open('https://www.youtube.com/channel/UC2S0nC_cM0HtrRYD4flUz2w','_system');
  }


  

}
