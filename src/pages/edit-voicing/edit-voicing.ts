import { Component } from '@angular/core';
import { NavController, reorderArray,NavParams,LoadingController,AlertController,ToastController} from 'ionic-angular';
import { ChordModel} from '../../models/chordModel';
import { ChordPage} from '../chord/chord';
import { GuidingLinePage} from '../guiding-line/guiding-line';
import { PlayParametersPage}  from    '../play-parameters/play-parameters';

import { settings  as SETTINGS } from    '../../providers/configuration/configuration';
import { LoadingCtrlPage}  from    '../loading-ctrl/loading-ctrl';

import { AddingChordPage }from    '../adding-chord/adding-chord';
import { DiagramsPage}  from    '../diagrams/diagrams';
import { TranslationProvider } from '../../providers/translation/translation';
import { ToolsProvider}   from    '../../providers/tools/tools' 

@Component({
  selector: 'page-edit-voicing',
  templateUrl: 'edit-voicing.html',
})
export class EditVoicingPage extends LoadingCtrlPage {

	songName:string;
	chords:ChordModel[];
	settings:SETTINGS;

	showReOrder:boolean=false;
	editView:boolean=true;

	constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController, 
		public toastCtrl: ToastController,public alertCtrl: AlertController,
		private TP: TranslationProvider,private toolsProvider:ToolsProvider) {

		super(loadingCtrl);

		var Voicings:{ songName:string,chords:ChordModel[],settings:SETTINGS} = navParams.get('songVoicings');
		this.songName=Voicings.songName;
		this.chords=Voicings.chords;
		this.settings=Voicings.settings; 

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

	changeView(){
		this.editView=!this.editView;
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
		toast=null;
	}

	setPlayer(){

		var ptiches:string[][]=this.chords.map(chord=>chord.getCanvasPitches());
		this.navCtrl.push(PlayParametersPage, {player: this.settings.player,notes:ptiches});


	}


	playVoicings(){

		if(!this.toolsProvider.isLoaded)
	      	this.alert(this.TP.tr('Instruments are loading'),this.TP.tr("Wait few seconds and try again."));
	    else
		{
			var ptiches:string[][]=this.chords.map(chord=>chord.getCanvasPitches());
			this.toolsProvider.playProgression(ptiches,this.settings.player);

		}
		/*
		if(this.chords.some(c=>c.diagrams.length==0)){
			this.presentToast(this.TP.tr("No diagram found for some chord."));
			return;
		}
		*/
	}	

	save(){

	}

	order(){
		this.showReOrder=!this.showReOrder;
	}

	reorderItems($event) {
		reorderArray(this.chords,$event);
	}

	removeItem(chord:ChordModel){

		for(var i:number = 0; i < this.chords.length; i++) {
			if(this.chords[i] == chord){
				this.chords.splice(i, 1);
			}
		}

	}

	goRight(chord:ChordModel){

		if(chord.diagrams.length==0) return

		if(chord.idDiag<chord.diagrams.length-1){
			chord.idDiag++;
			chord.canvas=chord.diagrams[chord.idDiag];
			
		} 
		var ptiches:string[]=chord.getCanvasPitches();
		this.toolsProvider.playChord(ptiches);
		
	}

	goLeft(chord:ChordModel){
		if(chord.diagrams.length==0) return
		if(chord.idDiag>0){
			chord.idDiag--;
			chord.canvas=chord.diagrams[chord.idDiag];

		}
		var ptiches:string[]=chord.getCanvasPitches();
		this.toolsProvider.playChord(ptiches);
	}

	
	

	ionViewDidLoad() {
	}
 
	showDiagrams(chord:ChordModel){ 		

		this.showLoader(this.TP.tr("Opening chord ..."));
		setTimeout(() => {			
	    	this.navCtrl.push(DiagramsPage, {chord: chord});
	    },100);
	    
 	}

	itemTapped(event, chord) {   		
	   	this.navCtrl.push(ChordPage, {chord: chord}); 	   	 	
	}

	add(event){		
		this.navCtrl.push(AddingChordPage, { chords: this.chords });
	}
	

	openGuidingLineSetUp(event ) {  
		  		
		this.navCtrl.push(GuidingLinePage, {  songVoicings: this.chords ,settings:this.settings});
		this.dismissLoader();
		
		
    };
}
