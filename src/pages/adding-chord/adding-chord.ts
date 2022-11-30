import { Component } from '@angular/core';
import { NavController, NavParams ,LoadingController,ToastController ,AlertController} from 'ionic-angular';
import { ChordModel} from '../../models/chordModel';
import { ChordPage}  from    '../chord/chord';
import { ConfigurationProvider,SongType} from    '../../providers/configuration/configuration'
import { TranslationProvider } from '../../providers/translation/translation';
import * as cloneDeep from 'lodash/cloneDeep';

 @Component({
 	selector: 'page-adding-chord',
 	templateUrl: 'adding-chord.html',
 })
 export class AddingChordPage extends ChordPage {


	chords:ChordModel[];
	
 	constructor(public navCtrl: NavController, public navParams: NavParams,
 		public toastCtrl: ToastController,public loadingCtrl: LoadingController,
 		public alertCtrl: AlertController,public configurationProvider:ConfigurationProvider,
		protected TP: TranslationProvider) {	
 		
 		super(navCtrl, navParams,loadingCtrl,toastCtrl,alertCtrl,configurationProvider,TP); 

		
		var voicing:SongType=navParams.get('Voicings');
 		this.chords=voicing.chords;
 		this.ScaleNotes=voicing.ScaleNotes;
		this.Tunning=voicing.settings.mTunning.strings;
		this.chord=ChordModel.new(this.ScaleNotes,this.Tunning);
		this.init();
 	}

	 	
	presentToast() {
	  let toast = this.toastCtrl.create({
	    message: this.TP.tr('Chord has been added'),
	    duration: 600,
	    position: 'top'
	  });

	  toast.onDidDismiss(() => {
	    //console.log('Dismissed toast');
	  });

	  toast.present();
	}

	add(){

		this.chords.push(this.chord);
	
		
		
		var clone = cloneDeep(this.chord);
		this.chord=clone;
	
		//debugger
		//this.init();
		this.presentToast();

	}

 }
