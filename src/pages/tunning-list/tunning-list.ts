import { Component } from '@angular/core';
import { NavController, NavParams ,AlertController, LoadingController,ToastController} from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { EditVoicingPage}  from    '../edit-voicing/edit-voicing' 
import { TunningType,ConfigurationProvider,STANDARD_TUNNING} from    '../../providers/configuration/configuration'
import { Storage } from '@ionic/storage';
import { LoadingCtrlPage}  from    '../loading-ctrl/loading-ctrl';
import { TunningPage}  from    '../tunning/tunning';
import { TranslationProvider } from '../../providers/translation/translation';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-tunning-list',
  templateUrl: 'tunning-list.html',
})

export class TunningListPage extends LoadingCtrlPage{

	TunningList:TunningType[];

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
		
		this.storage.get("PAID").then( 
			(res)=>{
				
				console.log("res="+res);
				if (res==null){
					this.alert(this.TP.tr("Réservé à la version payante"),this.TP.tr("Vous devez avoir un compte PayPal pour ce faire."))
					this.navCtrl.setRoot(HomePage);
				}
				else{
					this.storage.get("TunningList").then(
						TunningList => {
							//TODO
							if(TunningList == null){
								this.TunningList =[];
							}
							else{		
								this.TunningList=TunningList;
							}
						})
				}
			}
			,
			()=> {
			
				this.alert(this.TP.tr("Erreur en base de donnée"),this.TP.tr("Contactez le développeur ;-)."))
				this.navCtrl.setRoot(HomePage);
			}
		);
	}




	save(){
		this.showLoader(this.TP.tr("Saving tunning list ..."));
		setTimeout(() => {
			
			this.storage.set("TunningList",this.TunningList);

		}, 100)

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
									
					var newtunning :TunningType= {name:"",strings:STANDARD_TUNNING};
					
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


			if(this.TunningList.every( s => { return s.name != inVal}) ==false) {
				inVal=""; 
				this.presentToast(this.TP.tr('tunning name already exists !'));
				return false;
			}
			else{
				tunningClone.name=inVal;
				if(!rename) this.TunningList.push(tunningClone);
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
					for(var i:number = 0; i < this.TunningList.length; i++) {

						if(this.TunningList[i] == chords){
							this.TunningList.splice(i, 1);
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


	itemTapped( tunning) {    

		this.navCtrl.push(TunningPage, {
			tunning: tunning
		});


	}


}


