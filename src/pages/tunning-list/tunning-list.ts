import { Component } from '@angular/core';
import { NavController,AlertController, NavParams , LoadingController,ToastController} from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { EditVoicingPage}  from    '../edit-voicing/edit-voicing' 
import { TunningType,ConfigurationProvider} from    '../../providers/configuration/configuration'
import { Storage } from '@ionic/storage';
import { LoadingCtrlPage}  from    '../loading-ctrl/loading-ctrl';
import { TunningPage}  from    '../tunning/tunning';
import { TranslationProvider } from '../../providers/translation/translation';


@Component({
  selector: 'page-tunning-list',
  templateUrl: 'tunning-list.html',
})

export class TunningListPage extends LoadingCtrlPage{

	tunningList:TunningType[];

	loading:any;	


	constructor(private alertCtrl: AlertController,
		public modalCtrl : ModalController,
		public navCtrl: NavController, public navParams: NavParams,private storage: Storage, public toastCtrl: ToastController,
		public loadingCtrl: LoadingController,private configurationProvider:ConfigurationProvider,
		private TP: TranslationProvider) {

		super(loadingCtrl);		
		
		this.showLoader(this.TP.tr("Loading tunning list ..."));
		setTimeout(() => {
			//this.load();
		}, 100);


	}




	save(){
		this.showLoader(this.TP.tr("Saving tunning list ..."));
		setTimeout(() => {
			this.storage.set("tunningList",this.tunningList);

		}, 100)

	}



	public newtunning(){
		

		let alert = this.alertCtrl.create({
			title: this.TP.tr('New tunning'),
			cssClass: 'alertCustomCss',
			inputs: [
			{
				name: 'Name',
				placeholder: this.TP.tr('Name')
			}
			],
			buttons: [
			{
				text: this.TP.tr('Cancel'),
				role: 'cancel',
				handler: data => {
					console.log('Cancel clicked');
				}
			},
			{
				text: this.TP.tr('New'),
				handler: data => {
				
					
					var newtunning :TunningType= {name:"",strings:[]};

					
					if(this.validation(data.Name,newtunning)){
						this.navCtrl.push(TunningPage, {
							tunning: newtunning
						});
						
						
					}
					
				}
			}
			]
		});
		alert.present();	
	}


	presentToast(msg:string) {
		let toast = this.toastCtrl.create({
			message: msg,
			duration: 1000,
			position: 'top'
		});

		toast.onDidDismiss(() => {
			//console.log('Dismissed toast');
		});

		toast.present();
	}




	validation(  inVal:string, tunningClone:TunningType,rename:boolean=false	){
		if(inVal==''){
			this.presentToast(this.TP.tr('Name is  empty!'));
			return false;
		}
		else{


			if(this.tunningList.every( s => { return s.name != inVal}) ==false) {
				inVal=""; 
				this.presentToast(this.TP.tr('tunning name already exists !'));
				return false;
			}
			else{
				tunningClone.name=inVal;
				if(!rename) this.tunningList.push(tunningClone);
				return true;

			}

		}

	}

	

	rename(tunning:TunningType) {
		let alert = this.alertCtrl.create({
			title:this.TP.tr( 'Rename tunning'),
			cssClass: 'alertCustomCss',
			inputs: [
			{
				name: 'Name',
				placeholder: this.TP.tr('Name'),
				value:tunning.name
			}
			],
			buttons: [
			{
				text: this.TP.tr('Cancel'),
				role: 'cancel',
				handler: data => {
					console.log('Cancel clicked');
				}
			},
			{
				text: this.TP.tr('Rename'),
				handler: data => {

					return this.validation(data.Name,tunning,true);
				}
			}
			]
		});
		alert.present();
	}

	remove(chords:any){

		let alertPopup = this.alertCtrl.create({
			title: this.TP.tr('Remove'),
			cssClass: 'alertCustomCss',
			message: this.TP.tr('Are you really sure? This can\'t be undone.'),
			buttons: [{
				text: this.TP.tr('Yes'),
				handler: () =>  {
					for(var i:number = 0; i < this.tunningList.length; i++) {

						if(this.tunningList[i] == chords){
							this.tunningList.splice(i, 1);
						}

					}
				}
			},
			{
				text: this.TP.tr('No'),			
				handler: () => {
				}
			}]
		});

		// Show the alert
		alertPopup.present();


	}


	itemTapped( tunningtunning) {    

		this.navCtrl.push(EditVoicingPage, {
			tunningtunning: tunningtunning
		});


	}


}


