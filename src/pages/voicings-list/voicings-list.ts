import { Component } from '@angular/core';
import { NavController,AlertController, NavParams , LoadingController,ToastController} from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { ChordModel} from '../../models/chordModel';
import { EditVoicingPage}  from    '../edit-voicing/edit-voicing' 
import { Settings ,SongType,STANDARD_TUNNING,DEFAULT_SETTINGS} from    '../../providers/configuration/configuration'
import { Storage } from '@ionic/storage';
import { LoadingCtrlPage}  from    '../loading-ctrl/loading-ctrl';
import { SONGS } from '../../assets/data/songs';
import { TranslationProvider } from '../../providers/translation/translation';



import * as cloneDeep from 'lodash/cloneDeep';
import { ChooseTonePage } from '../choose-tone/choose-tone';

import * as deepEqual from 'fast-deep-equal';



@Component({
	selector: 'page-voicings-list',
	templateUrl: 'voicings-list.html'


})


export class VoicingsListPage extends LoadingCtrlPage{

	VoicingsList:SongType[];
	VoicingsListLastSaved:SongType[];

	loading:any;	
	innerPages:boolean=false;
	isNewSong:boolean=false;

	constructor(private alertCtrl: AlertController,
		public modalCtrl : ModalController,
		public navCtrl: NavController, public navParams: NavParams,private storage: Storage, public toastCtrl: ToastController,
		public loadingCtrl: LoadingController,
		private TP: TranslationProvider) {

		super(loadingCtrl);		

	
		
		this.showLoader(this.TP.tr("Loading voicings list ..."));
		setTimeout(() => {
			this.load();
		}, 100);


	}

	static fromJSON(inRawSongs:any[])
	{
		var songs:SongType[]=[];

		inRawSongs.forEach( (inSong)=>{
			var song:SongType
			inSong.chords.forEach(function(element) {

				song=
				{songName:inSong.songName,chords:[],ScaleNotesId:inSong.ScaleNotesId,ScaleNotes:inSong.ScaleNotes,settings:inSong.settings};

				inSong.chords.forEach(function(element) {

					var chord:ChordModel= new ChordModel(
						element.Id, 
						element.keyid,
						element.ScaleNotes,						        
						element.idFamily,
						element.idtype,
						element.idDiag, element.idDiag_Y,
						element.diagrams,
						element.HasRoot,
						element.HasFifth,
						element.maxStretch,
						element.melodyType,
						element.guidingPitch,
						element.openStrings,
						element.stringDispo,
						element.allowOctaves,
						element.chordSize,
						element.tunning

						);

					song.chords.push(chord);

					})
				
				})
			songs.push(song);
		})
			


		
		return songs;
	}


	load(){
		//debugger
		
		//console.log(this.storage)
		//this.storage.remove("VoicingsList");
		//this.storage.remove("PAID");
		//this.storage.remove("TunningList");
		this.storage.get("VoicingsList").then( 

			(list:SongType[])=> {
				

				if(  list == null  || list==undefined || list.length==0){
					console.log("loading from config !!")

					this.VoicingsList=VoicingsListPage.fromJSON(SONGS);					
					this.storage.set("VoicingsList",this.VoicingsList);
				}
				else{
					var lVL:any=[];
					list.forEach(songRes=> {
						//debugger
						
						if(songRes.settings.mTunning==null){
							
							songRes.settings.mTunning={name:'Standard',strings:STANDARD_TUNNING}
							delete songRes.settings.mTunning
						}

						var song:{songName:string,chords:ChordModel[],ScaleNotesId:number,ScaleNotes:string[],settings:Settings}=
						{songName:songRes.songName,chords:[],ScaleNotesId:songRes.ScaleNotesId,
							ScaleNotes:songRes.ScaleNotes,settings:songRes.settings};

						songRes.chords.forEach(function(element) {

							if(element.tunning == null)
							{
								debugger
							}

							var chord:ChordModel= new ChordModel(
								element.Id, 
								element.keyid,
								element.ScaleNotes,					        
								element.idFamily,
								element.idtype,
								element.idDiag, 
								element.idDiag_Y,
								element.diagrams,
								element.HasRoot,
								element.HasFifth,
								element.maxStretch,
								element.melodyType,
								element.guidingPitch,
								element.openStrings,
								element.stringDispo,
								element.allowOctaves,
								element.chordSize,
								element.tunning
								);

							
							song.chords.push(chord);

						});

						lVL.push(song);

					});
					
					//console.log( JSON.stringify(lVL));
					lVL.sort( (a,b) => a.songName<b.songName? -1:1);
					this.VoicingsList=lVL;	
					
				}

				//debugger
				this.VoicingsListLastSaved= cloneDeep(this.VoicingsList);
			});


	}




	save(){

		this.showLoader(this.TP.tr("Saving voicings list ..."));
		setTimeout(() => {
			this.storage.set("VoicingsList",this.VoicingsList);
			this.VoicingsListLastSaved== cloneDeep(this.VoicingsList);
		}, 100)

	}


	


	setGuidingLine(line:number[],chords:ChordModel[]){
		for(let i in line){
			chords[i].guidingPitch=line[i];
		}
	}



	public newSong(){
		

		let alert = this.alertCtrl.create({
			title: this.TP.tr('New song'),
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
				
					
					var newSong :SongType= {songName:"",chords:[],ScaleNotes:[],ScaleNotesId:0,settings:DEFAULT_SETTINGS};

					
					if(this.validation(data.Name,newSong)){
						
						this.navCtrl.push(ChooseTonePage, {
							songVoicings: newSong,ScaleNotes:[]
						});
						this.innerPages=true;
						this.isNewSong=true;
						
					
					}
					
				}
			}
			]
		});
		alert.present();	
	}

	setKey(song){
		this.innerPages=true;
		this.navCtrl.push(ChooseTonePage, {
			songVoicings: song
		});
		
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




	validation(  inVal:string, songClone:SongType,rename:boolean=false	){
		if(inVal==''){
			this.presentToast(this.TP.tr('Name is  empty!'));
			return false;
		}
		else{


			if(this.VoicingsList.every( s => { return s.songName != inVal}) ==false) {
				inVal=""; 
				this.presentToast(this.TP.tr('Song name already exists !'));
				return false;
			}
			else{
				songClone.songName=inVal;
				if(!rename) this.VoicingsList.push(songClone);
				return true;

			}

		}

	}

	presentCopyPrompt(song:SongType) {
		let alert = this.alertCtrl.create({
			title: this.TP.tr('Copy song'),
			cssClass: 'alertCustomCss',
			inputs: [
			{
				name: 'Name',
				placeholder: this.TP.tr('Name'),
				value:song.songName
			}
			],
			buttons: [
			{
				text: this.TP.tr('Cancel'),
				role: 'cancel',
				handler: data => {
					//console.log('Cancel clicked');
				}
			},
			{
				text: this.TP.tr('Copy'),
				handler: data => {
					var clonedSong :SongType= cloneDeep(song);
					return this.validation(data.Name,clonedSong);
				}
			}
			]
		});
		alert.present();
	}

	rename(song:SongType) {
		let alert = this.alertCtrl.create({
			title:this.TP.tr( 'Rename song'),
			cssClass: 'alertCustomCss',
			inputs: [
			{
				name: 'Name',
				placeholder: this.TP.tr('Name'),
				value:song.songName
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

					return this.validation(data.Name,song,true);
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
			message: this.TP.tr('Are you really sure?'),
			buttons: [{
				text: this.TP.tr('Yes'),
				handler: () =>  {
					for(var i:number = 0; i < this.VoicingsList.length; i++) {

						if(this.VoicingsList[i] == chords){
							this.VoicingsList.splice(i, 1);
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

	itemTapped( songVoicings) { 
		this.innerPages=true;   
		this.navCtrl.push(EditVoicingPage, {
			songVoicings: songVoicings
		});
		
	}

	ionViewWillLeave() {

		//UGLY : on désactive le check pour les pages internee
		if(this.innerPages == false ){
			//this.innerPages == false
			if( ! deepEqual(this.VoicingsList,this.VoicingsListLastSaved)){						
				this.saveBeforeQuitting();			
			}
		}
		
		
		
	}

	ionViewWillEnter() {

		
		if(this.isNewSong){
			this.innerPages = true
			this.isNewSong=false
		}
		else this.innerPages = false
		
		
	}

	public saveBeforeQuitting(){
		

		let alert = this.alertCtrl.create({
			title: this.TP.tr('You have unsaved changes !'),
			cssClass: 'alertCustomCss',
			
			buttons: [
      		{
				text: this.TP.tr('Save ...'),
				role: 'save',
				handler: data => {
					this.storage.set("VoicingsList",this.VoicingsList);
					this.VoicingsListLastSaved= cloneDeep(this.VoicingsList);
					
                }
			}
          	,
			{
				text: this.TP.tr('Do not save'),
				role: 'cancel',
				handler: data => {
					

					
				}
			}
		]});
		alert.present();	
	}
}
