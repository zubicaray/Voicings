import { Component } from '@angular/core';
import { NavController, reorderArray,NavParams,LoadingController,AlertController,ToastController} from 'ionic-angular';
import { ChordModel} from '../../models/chordModel';
import { ChordPage} from '../chord/chord';
import { GuidingLinePage} from '../guiding-line/guiding-line';
import { PlayParametersPage}  from    '../play-parameters/play-parameters';

import { Settings, SongType } from    '../../providers/configuration/configuration';
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
	settings:Settings;
	ScaleNotes:string[];
	Voicings:SongType

	showReOrder:boolean=false;
	editView:boolean=false;

	constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController, 
		public toastCtrl: ToastController,public alertCtrl: AlertController,
		private TP: TranslationProvider,private toolsProvider:ToolsProvider) {

		super(loadingCtrl);

		this.Voicings = navParams.get('songVoicings');
		
		this.songName=this.Voicings.songName;
		//console.log(this.songName);
		this.chords=this.Voicings.chords;
		this.settings=this.Voicings.settings; 
		this.ScaleNotes=this.Voicings.ScaleNotes;

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



	isSelectedChord(i:number):string{

		if( i>=this.settings.chordRangeForLine.begin && i<=this.settings.chordRangeForLine.end)
		return  '#F0E68C'; else return 'white';

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
	playSelectedVoicings(){

		if(!this.toolsProvider.isLoaded)
	      	this.alert(this.TP.tr('Instruments are loading'),this.TP.tr("Wait few seconds and try again."));
		else
		if ( this.settings.chordRangeForLine.begin== -1){
			
			this.alert(this.TP.tr('No chords selected'),this.TP.tr("Set a guiding line first."));
		}
		else{	
			let selectedChords=[];  
   
			for(var i:number =this.settings.chordRangeForLine.begin;i<=this.settings.chordRangeForLine.end;i++)
			{
			  selectedChords.push(this.chords[i]);
			}
		
			var ptiches:string[][]=selectedChords.map(chord=>chord.getCanvasPitches());
			this.toolsProvider.playProgression(ptiches,this.settings.player);

		}
		/*
		if(this.chords.some(c=>c.diagrams.length==0)){
			this.presentToast(this.TP.tr("No diagram found for some chord."));
			return;
		}
		*/
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

	
	order(){
		this.showReOrder=!this.showReOrder;
	}

	reorderItems($event) {
		reorderArray(this.chords,$event);
	}

	removeItem(chord:ChordModel){

		for(var i:number = 0; i < this.chords.length; i++) {
			if(this.chords[i] == chord){


				if( i>=this.settings.chordRangeForLine.begin && i<=this.settings.chordRangeForLine.end)
				{
					this.settings.chordRangeForLine.end--
					if(this.settings.chordRangeForLine.end<=this.settings.chordRangeForLine.begin)
					{ // no more selected chords for guiding line
						this.settings.chordRangeForLine.end=-1;
						this.settings.chordRangeForLine.begin=-1;
					}
				}
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
		//debugger
	   	this.navCtrl.push(ChordPage, {Voicings: this.Voicings,chord: chord}); 	   	 	
	}

	add(event){		
		//debugger
		this.navCtrl.push(AddingChordPage, { Voicings: this.Voicings});
	}
	

	openGuidingLineSetUp(event ) {  
		  		
		this.navCtrl.push(GuidingLinePage, {  songVoicings: this.chords ,settings:this.settings});
		this.dismissLoader();
		
		
    };
}
