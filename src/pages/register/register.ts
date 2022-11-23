import { Component, OnInit  } from '@angular/core';
import { NavController, NavParams,Platform } from 'ionic-angular';
import { TranslationProvider } from '../../providers/translation/translation';



@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage implements OnInit {

  ErrorMsg:string;
  
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    public platform: Platform,
    private TP: TranslationProvider) 
  {

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad RegisterPage');
  }


  ngOnInit() {
    
  }

}
