import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { ChordModel} from '../../models/chordModel';
import { Settings}  from    '../../providers/configuration/configuration'


@Component({
  selector: 'page-chord-frame',
  templateUrl: 'chord-frame.html',
})
export class ChordFramePage {


  chords: ChordModel[];	
  settings:Settings;
  selectedChords:ChordModel[];	


  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl : ViewController) {
    this.chords = navParams.get('chords');
    this.settings=navParams.get('settings');
    this.selectedChords=navParams.get('selectedChords');
  
   
  }

  private setIndex(index:number){

    let begin=this.settings.chordRangeForLine.begin;
    let end=this.settings.chordRangeForLine.end;

    if(index==begin && index <=end){
      this.settings.chordRangeForLine.begin++
      return 
    }
    if(index==end && index >=begin){
      this.settings.chordRangeForLine.end--
      return 
    }

    if(index<begin){
      this.settings.chordRangeForLine.begin=index
      return 
    }
    if(index>end){
      this.settings.chordRangeForLine.end=index
      return 
    }


    let distFromBegin=index-begin
    let distFromEnd=end-index

    if(distFromBegin>distFromEnd)
    {
      this.settings.chordRangeForLine.end=index
    }
    else{
      this.settings.chordRangeForLine.begin=index
    }


  }
 
  public closeModal(index:number){

    this.selectedChords=[];  
    
     
   
    for(var i:number =this.settings.chordRangeForLine.begin;i<=this.settings.chordRangeForLine.end;i++)
    {
      this.selectedChords.push(this.chords[i]);
     // console.log("this.selectedChords has "+this.selectedChords.length+ "chords")
    }
    this.viewCtrl.dismiss();

	}

}
