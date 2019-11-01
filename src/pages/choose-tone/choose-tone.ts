import { Component } from '@angular/core';
import { ViewController, NavController,AlertController, NavParams } from 'ionic-angular';
import { Keys, SharpKeys,SongType,isBemol } from '../../providers/configuration/configuration';
import { AddingChordPage }from    '../adding-chord/adding-chord';
import { EditVoicingPage}  from    '../edit-voicing/edit-voicing'
 
 @Component({
 	selector: 'page-modal-choose-tone',
 	templateUrl: 'choose-tone.html',
 })
 export class ChooseTonePage {

   Keys: string[];	
   ScaleNotes:string[];
   ScaleKeyId:number;
   Voicings:SongType ;
   private isNew:boolean=true;

 	constructor(public navCtrl: NavController, public navParams: NavParams, 
    public viewCtrl : ViewController,public alertCtrl: AlertController) {

      this.Keys=Keys;
      this.Voicings = navParams.get('songVoicings');
      this.ScaleNotes = this.Voicings.ScaleNotes;
      this.ScaleKeyId = this.Voicings.ScaleNotesId;
      if(this.ScaleNotes.length>0) this.isNew=false;
      

 	}
 	public closeModal(key:number){

    if(isBemol(key)){
      this.Voicings.ScaleNotes=Keys;
    }
    else
    {
      this.Voicings.ScaleNotes=SharpKeys;
    }
    this.Voicings.ScaleNotesId=key;
    this.Voicings.chords.forEach(c=>c.setScaleNotes(this.Voicings.ScaleNotes))

    this.viewCtrl.dismiss();
    this.navCtrl.push(EditVoicingPage, {
      songVoicings: this.Voicings
    });

    if(this.isNew) 
      this.navCtrl.push(AddingChordPage, { chords: this.Voicings.chords,ScaleNotes: this.Voicings.ScaleNotes	 });
	}

 	ionViewDidLoad() {

   }
   
  }
