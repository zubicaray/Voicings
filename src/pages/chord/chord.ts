import { Component } from '@angular/core';
import { NavController, NavParams ,LoadingController,AlertController,ToastController} from 'ionic-angular';
import { ChordModel} from '../../models/chordModel';
import { ChordFamilyList,ChordSettings,KeysId,NB_FRETTES,SongType,OctavesNotes,ConfigurationProvider}  from    '../../providers/configuration/configuration' 
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
	Tunning:number[];
	ScaleNotes:string[];

 	chord:ChordModel;
 	
 	constructor(public navCtrl: NavController, public navParams: NavParams,
 		public loadingCtrl: LoadingController,public toastCtrl: ToastController,public alertCtrl: AlertController,
 		public configurationProvider:ConfigurationProvider,
		protected TP: TranslationProvider
 	) 
 	{
 		super(loadingCtrl);
		var voicings:SongType=navParams.get('Voicings')
		
		
		this.Tunning=voicings.settings.tunning
		
		this.ScaleNotes=voicings.ScaleNotes;
 		
 		if(navParams.get('chord') != undefined){
 			this.chord=navParams.get('chord');

 			this.init();
			
 		} 
 		else {
			
			//PAS D'ACCORD PASSE => on est un mode add new
			//l'accord sera initialisé dans adding-chord
			this.ChordSettings=this.ChordFamilyList[0].chords;
			
		}

 	}

	/**
	* returns the possible octaves list on the neck for a given note
	*/
	getOctaves(note:number):number[]{
		
		let sortedStrings=this.chord.tunning.sort();
		let min=sortedStrings[0];
		let max=sortedStrings[sortedStrings.length-1];
		var res:number[]=[];
		var o,octaveOffset:number=0;
		o=0;
		// octave la plus basse sur l'accordage
		for(var i:number=0;i<OctavesNotes.length;i++){
			if( mod(i,12) == note &&OctavesNotes[i].pitch>=min)
			{
				octaveOffset=~~(OctavesNotes[i].pitch/12)-1;
				break;
			}
		}

		for(i=min;i<=max+NB_FRETTES;i++){
			if( mod(i,12) == note ){
				res.push(octaveOffset+o);
				o++;
				i+=11;
			}
		}
		return res;
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
 		for(var i:number=0;i<KeysId.length;i++){
 			this.mNoteOctaves.push(this.getOctaves(i));
 		}
 	}

 	updateChordNotes(){ 		
 		this.chord.init(this.Tunning);
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

 		this.chord.init(this.Tunning);
 		
 	}
 	setKey(i){
 		
 		this.chord.keyid=i;
 		this.chord.init(this.Tunning);


 		if( !this.chord.isGuidingNoteStillOk() ){
 			this.guidingNote=null;
 			this.guidingNoteOctave=null;
 		}
 	}

 	setFamilyType(i){
 		
 		this.chord.idFamily=i;
 		this.chord.idtype=0;
 		this.chord.init(this.Tunning);
 		this.ChordSettings=this.ChordFamilyList[this.chord.idFamily].chords;
 		if( !this.chord.isGuidingNoteStillOk() ){
 			this.guidingNote=null;
 			this.guidingNoteOctave=null;
 		}
 	}

 	setType(i){
 		
 		this.chord.idtype=i;
 		this.chord.init(this.Tunning);
 		if( !this.chord.isGuidingNoteStillOk() ){
 			this.guidingNote=null;
 			this.guidingNoteOctave=null;
 		}
 	}


 }
