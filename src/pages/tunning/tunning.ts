import { Component } from '@angular/core';
import { NavController, NavParams ,AlertController} from 'ionic-angular';
import { OctavesNotes,TunningType }       from    '../../providers/configuration/configuration' 
import { TranslationProvider } from '../../providers/translation/translation';


@Component({
  selector: 'page-tunning',
  templateUrl: 'tunning.html',
})
export class TunningPage {

	tunning:number[]=[];
	mTunning:TunningType;
	TunningList:TunningType[];
	toAdd:boolean=false;
	OctavesNotes:{pitch:number,key:string,label:string}[]=OctavesNotes;
  	constructor(
  		public navCtrl: NavController,public navParams: NavParams,
		private TP: TranslationProvider,public alertCtrl: AlertController) {

				

			this.mTunning=navParams.get('tunning');
			this.tunning=this.mTunning.strings;
	
		
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
}
