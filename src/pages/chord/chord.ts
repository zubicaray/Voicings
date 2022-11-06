import { Component } from '@angular/core';
import { NavController, NavParams ,LoadingController,AlertController,ToastController} from 'ionic-angular';
import { ChordModel} from '../../models/chordModel';
import { ChordFamilyList,ChordSettings,Keys,KeysId,OctavesNotes,ConfigurationProvider}  from    '../../providers/configuration/configuration' 
import { LoadingCtrlPage}  from    '../loading-ctrl/loading-ctrl';
import { mod}   from    '../../providers/tools/tools' 
import { TranslationProvider } from '../../providers/translation/translation';

 @Component({
 	selector: 'page-chord',
 	templateUrl: 'chord.html',
 })

 export class ChordPage  extends LoadingCtrlPage {

 	ChordFamilyList:{name:string,chords:ChordSettings[]}[]=ChordFamilyList;
 	ChordSettings:ChordSettings[];
 	Keys:any=null;
 	OctavesNotes:any=OctavesNotes;

 	guidingNoteOctave:number=null;
 	guidingNote:number=null;
 	mNoteOctaves:number[][]=[];
 	Octaves:number[];

 	chord:ChordModel;
 	
 	constructor(public navCtrl: NavController, public navParams: NavParams,
 		public loadingCtrl: LoadingController,public toastCtrl: ToastController,public alertCtrl: AlertController,
 		public configurationProvider:ConfigurationProvider,
		protected TP: TranslationProvider
 	) 
 	{
 		super(loadingCtrl);

 		for(var i:number=0;i<KeysId.length;i++){
 			this.mNoteOctaves.push(this.configurationProvider.Octaves(i));
 		}
 		if(navParams.get('chord') != undefined){
 			this.chord=navParams.get('chord');
 			this.init();
			
 		} 
 		else this.ChordSettings=this.ChordFamilyList[0].chords;

 	}

 	init(){

 		if(this.chord.guidingPitch!=0){
 			this.guidingNoteOctave= ~~(this.chord.guidingPitch/12) -1
	 		this.guidingNote=mod(this.chord.guidingPitch,12);
	 		this.Octaves=this.mNoteOctaves[this.guidingNote];	 		
 		}
 		else{
 			this.Octaves=[];
 		}
		this.Keys=this.chord.ScaleNotes;
 		this.ChordSettings=this.ChordFamilyList[this.chord.idFamily].chords;
 		
 	}

 	updateChordNotes(){ 		
 		this.chord.init();
 		this.checkPossible();
 	}

 	presentToast() {
 		let toast = this.toastCtrl.create({
 			message: this.TP.tr('Chords found !'),
 			duration: 1000,
 			position: 'top'
 		});

 		toast.onDidDismiss(() => {
 			
 		});

 		toast.present();
 	}
 	buildDiagrams(chord:ChordModel){
 		if( this.guidingNoteOctave ==null  ){
 			this.alert(this.TP.tr("Cannot building diagrams"),this.TP.tr("You must choose the octave number."));
 			return;
 		}
 		if(this.guidingNote==null  ){
 			this.alert(this.TP.tr("Cannot building diagrams"),this.TP.tr("No guiding note chosen."));
 			return;
 		}
 		this.showLoader(this.TP.tr("finding guiding notes ..."))
 		setTimeout(()=>{
 				chord.findChordDiagrams();
	 			if(chord.diagrams.length==0){
	 				this.alert(this.TP.tr("Error building diagrams"),this.TP.tr("No chord found."));
		 		}
		 		else{
		 			this.presentToast() ;	
		 			 this.navCtrl.pop();
		 		}
	 		}
	 		,100);
 		
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

 	checkStringsAvailable(){
 		if( this.guidingNote !=null && this.guidingNoteOctave !=null && this.chord.checkNumberAvailableStrings() ==false){
 			this.alert(this.TP.tr("Warning"),this.TP.tr(this.chord.getError()));
 			return;
 		}
 		this.checkPossible();
 	}

 	checkPossible(){
 		if( this.guidingNote !=null && this.guidingNoteOctave!=null && this.chord.checkPossible() ==false){
 			this.alert(this.TP.tr("Warning"),this.TP.tr(this.chord.getError()));
 		}
 	}

 	setGuidingPitchFromNote(i){

 		this.guidingNote=i;
 		this.Octaves=this.mNoteOctaves[this.guidingNote];
 		if(this.guidingNoteOctave>this.Octaves[this.Octaves.length-1])
 			this.guidingNoteOctave--;
		
 		
 		this.reinitChord();
 		this.checkPossible();
 		
 	}
 	setGuidingPitchFromOctave(i){

 		this.guidingNoteOctave=i;

 		this.reinitChord();
 		this.checkPossible();
 		
 	}
 	reinitChord(){
 		//debugger
 		this.chord.guidingPitch=(this.guidingNoteOctave+1)*12+this.guidingNote;

 		this.chord.init();
 		
 	}
 	setKey(i){
 		
 		this.chord.keyid=i;
 		this.chord.init();


 		if( !this.chord.isGuidingNoteStillOk() ){
 			this.guidingNote=null;
 			this.guidingNoteOctave=null;
 		}
 	}

 	setFamilyType(i){
 		
 		this.chord.idFamily=i;
 		this.chord.idtype=0;
 		this.chord.init();
 		this.ChordSettings=this.ChordFamilyList[this.chord.idFamily].chords;
 		if( !this.chord.isGuidingNoteStillOk() ){
 			this.guidingNote=null;
 			this.guidingNoteOctave=null;
 		}
 	}

 	setType(i){
 		
 		this.chord.idtype=i;
 		this.chord.init();
 		if( !this.chord.isGuidingNoteStillOk() ){
 			this.guidingNote=null;
 			this.guidingNoteOctave=null;
 		}
 	}


 }
