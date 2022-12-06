import { Component } from '@angular/core';
import { NavController, NavParams,AlertController } from 'ionic-angular';
import { PlayerSettings  } from    '../../providers/configuration/configuration';
import { TranslationProvider } from '../../providers/translation/translation';
import { ToolsProvider}   from    '../../providers/tools/tools'



@Component({
  selector: 'page-play-parameters',
  templateUrl: 'play-parameters.html',
})
export class PlayParametersPage {

	player:PlayerSettings;
  notes:string[][];

  constructor(public navCtrl: NavController, public navParams: NavParams,
		private TP: TranslationProvider,public alertCtrl: AlertController,public toolsProvider:ToolsProvider) {

  	this.player = navParams.get('player');
    this.notes = navParams.get('notes');

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
  //@ts-ignore
  private playSound(){
    if(!this.toolsProvider.isLoaded)
      this.alert(this.TP.tr('Instruments are loading'),this.TP.tr("Wait few seconds and try again."))
    else
      this.toolsProvider.playProgression(this.notes,this.player);
  }

  ionViewDidLoad() {
  }

}
