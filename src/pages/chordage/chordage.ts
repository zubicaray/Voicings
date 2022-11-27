import { Component } from '@angular/core';
import { NavController, NavParams ,AlertController} from 'ionic-angular';
import { Chordage as DEFAULT_CHORDAGE }       from    '../../providers/configuration/configuration' 
import { OctavesNotes }       from    '../../providers/configuration/configuration' 
import { Storage } from '@ionic/storage';
import { TranslationProvider } from '../../providers/translation/translation';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-chordage',
  templateUrl: 'chordage.html',
})
export class ChordagePage {

	Chordage:number[]=[];
	OctavesNotes:{pitch:number,key:string,label:string}[]=OctavesNotes;
  	constructor(
  		public navCtrl: NavController, private storage: Storage,public navParams: NavParams,
		private TP: TranslationProvider,public alertCtrl: AlertController) {

		this.storage.get("PAID").then( 
			(res)=>{
				
				console.log("res="+res);
				if (res==null){
					this.alert(this.TP.tr("Réservé à la version payante"),this.TP.tr("Vous devez avoir un compte PayPal pour ce faire."))
					this.navCtrl.setRoot(HomePage);
				}
				else{
					this.storage.get("Chordage").then(
			

						tunning => {
							
							if(tunning == null){
								this.Chordage=DEFAULT_CHORDAGE;
							}
							else{		
								this.Chordage=tunning;
							}
						})
				}
			}
			,
			()=> {
			
				this.alert(this.TP.tr("Réservé à la version payante"),this.TP.tr("Vous devez avoir un compte PayPal pour ce faire."))
				this.navCtrl.setRoot(HomePage);
			}
			);

	
		
	}
	save() {
		this.storage.set("Chordage",this.Chordage);
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
