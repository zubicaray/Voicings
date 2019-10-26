import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Chordage as DEFAULT_CHORDAGE }       from    '../../providers/configuration/configuration' 
import { OctavesNotes }       from    '../../providers/configuration/configuration' 
import { Storage } from '@ionic/storage';
//import { TranslationProvider } from '../../providers/translation/translation';

@Component({
  selector: 'page-chordage',
  templateUrl: 'chordage.html',
})
export class ChordagePage {

	Chordage:number[]=[];
	OctavesNotes:{pitch:number,key:string,sharp:boolean,label:string}[]=OctavesNotes;
  	constructor(
  		public navCtrl: NavController, private storage: Storage,public navParams: NavParams/*,
		private TP: TranslationProvider*/) {

  	this.storage.get("Chordage").then( 

		tunning => {
			
			if(tunning==[] || tunning == null){
				this.Chordage=DEFAULT_CHORDAGE;
			}
			else{		
				this.Chordage=tunning;
			}
		});
  	}

	save() {
		this.storage.set("Chordage",this.Chordage);
	}

}
