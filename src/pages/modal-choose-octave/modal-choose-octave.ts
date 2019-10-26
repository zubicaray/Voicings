import { Component } from '@angular/core';
import { ViewController, NavController,AlertController, NavParams } from 'ionic-angular';
import { ComputationProvider}  from    '../../providers/computations/computations'
import { ChordModel} from '../../models/chordModel';
import { OctavesNotes,OctavesOffset } from '../../providers/configuration/configuration';
import { TranslationProvider } from '../../providers/translation/translation';


 
 @Component({
 	selector: 'page-modal-choose-octave',
 	templateUrl: 'modal-choose-octave.html',
 })
 export class ModalChooseOctavePage {

 	chords: ChordModel[];	
 	pitches:number[][];

 	constructor(public navCtrl: NavController, public navParams: NavParams, 
    public viewCtrl : ViewController,public alertCtrl: AlertController,
 		public computationProvider:ComputationProvider,
    private TP: TranslationProvider) {

 		this.chords = navParams.get('chords');
		this.pitches=navParams.get('pitches');

 	}
 	public closeModal(pitches:number){

  
    this.chords.forEach( (c,index,_)=> {c.guidingPitch=pitches[index]});

    var i:number=1;
    for(let c of this.chords){   
     
      if(c.possibleGuidingNote(c.guidingPitch) ==false){

        const alert = this.alertCtrl.create({
          title:     this.TP.tr("At least, chord N°")+i+ " "+c.getFullName()+this.TP.tr(", is wrong"),
          cssClass:  'alertCustomCss',
          message:  this.TP.tr(c.getError()) ,
          buttons: [
          {
            text: this.TP.tr('Ok')
          }
          ]
        });
        alert.present();

        break;
      }

      i++;

    }
    
   

    this.viewCtrl.dismiss();

	}

 	ionViewDidLoad() {

 	}

 	printOctaves(desc:number[]):string{


      var highestNote=desc[desc.length-1];
      var lowestNote=desc[0];

      if(highestNote == lowestNote) // cas pédale
      {
        return OctavesNotes[highestNote-OctavesOffset].label;
      }
      else
      {
        return OctavesNotes[lowestNote-OctavesOffset].label+' -> '+OctavesNotes[highestNote-OctavesOffset].label;
      }
      

    }


 }
