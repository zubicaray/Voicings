import { Component } from '@angular/core';
import { NavController,AlertController, NavParams ,LoadingController} from 'ionic-angular';
import { ChordModel} from '../../models/chordModel'; 
import { ComputationProvider}  from    '../../providers/computations/computations'
import { Settings}  from    '../../providers/configuration/configuration'
import { LoadingCtrlPage}  from    '../loading-ctrl/loading-ctrl';
import { ChooseGuidingLinePage}  from    '../choose-guiding-line/choose-guiding-line';
import { TranslationProvider } from '../../providers/translation/translation';
/**
* component from choosing the desired guiding line
*/
@Component({
  selector: 'page-guiding-line',
  templateUrl: 'guiding-line.html',
})
export class GuidingLinePage  extends LoadingCtrlPage  {

  chords: ChordModel[];	
  possibleBeginningChords: ChordModel[];  
  possibleEndingChords: ChordModel[];  
  selectedChords: ChordModel[];  
  settings:Settings;

  beginIndex:number=0;
  endIndex:number=0;

  canLeave:boolean;


  constructor(  public navCtrl: NavController, public navParams: NavParams,
                public computationProvider:ComputationProvider,
                public alertCtrl: AlertController,public loadingCtrl: LoadingController,
                private TP: TranslationProvider
  ) 
  {

    super(loadingCtrl);

    this.chords = navParams.get('songVoicings');

    this.settings=navParams.get('settings');

    if(this.settings.chordRangeForLine.end == -1)
      this.settings.chordRangeForLine.end=this.chords.length-1;

    if(isNaN(this.settings.chordRangeForLine.end)){
      this.settings.chordRangeForLine.end=this.chords.length-1;
    }
    
    if(isNaN(this.settings.chordRangeForLine.begin)){
      this.settings.chordRangeForLine.begin=0;
    }
   
    this.beginIndex=this.settings.chordRangeForLine.begin;
    this.endIndex=this.settings.chordRangeForLine.end-this.settings.chordRangeForLine.begin-1;


    this.selectedChords=[];  
    this.possibleBeginningChords=[];  
    this.possibleEndingChords=[]; 

    for(var i:number =this.settings.chordRangeForLine.begin;i<=this.settings.chordRangeForLine.end;i++)
    {
      this.selectedChords.push(this.chords[i]);
    }

    for(var j:number =0;j<this.settings.chordRangeForLine.end;j++)
    {
      this.possibleBeginningChords.push(this.chords[j]);
    }

    for(i =this.settings.chordRangeForLine.begin+1;i<this.chords.length;i++)
    {
      this.possibleEndingChords.push(this.chords[i]);
    }

    this.configureComputation();

    
  }

  selectChordForLine(isBegin:boolean){

    this.selectedChords=[];  
    this.possibleBeginningChords=[];  
    this.possibleEndingChords=[]; 
    this.resetGuidingLine();

    if(isBegin){
      this.endIndex+=this.settings.chordRangeForLine.begin-this.beginIndex;
      this.settings.chordRangeForLine.begin=this.beginIndex;
    }
    else {     
        this.settings.chordRangeForLine.end=this.beginIndex+this.endIndex+1;
    }
 
    for(var i:number =this.settings.chordRangeForLine.begin;i<=this.settings.chordRangeForLine.end;i++)
    {
      this.selectedChords.push(this.chords[i]);
    }

    for(var j:number =0;j<this.settings.chordRangeForLine.end;j++)
    {
      this.possibleBeginningChords.push(this.chords[j]);
    }

    for(i =this.settings.chordRangeForLine.begin+1;i<this.chords.length;i++)
    {
      this.possibleEndingChords.push(this.chords[i]);
    }
   

  }

  consoleLog(s:string){     console.log(s);  }

  configureComputation(){
      this.computationProvider.setMaxToneStep(this.settings.maxToneStep);
      this.computationProvider.setAscendingMelody(this.settings.ascendingMelody);
      this.computationProvider.setToneStep(this.settings.toneStep);

  }


  resetGuidingLine(){
    
    this.settings.guidingLine={IdStrength:-1,IdKey:-1,IdLine:-1};
  }

  /**
    * @ignore
  */
  openChooseLine(){

    this.save();

    if(this.checkMinimalNumberOfStrings()){
     
      this.canLeave=true;
      this.configureComputation();
      this.navCtrl.push(ChooseGuidingLinePage, {  chords: this.selectedChords ,settings:this.settings});
    }
    else
       this.confirmLeaveGuitar(this.TP.tr('Not enough available strings.'),this.TP.tr('You must untoggle some strings, a chord must have three notes at least.'));

     
  }


  async savePhysicalConstraints(){  

    const shouldLeave = await this.confirmSaveGuitar();
    if(shouldLeave){
      // sauvegarde des contraintes "physiques", celles liées à la guitare
      var chords=this.selectedChords;
      var settings=this.settings;
      var activeStrings:boolean[]=[
      settings.string1,settings.string2,settings.string3,
      settings.string4,settings.string5,settings.string6];

      for( let c in chords){

        chords[c].maxStretch=settings.chordStretch;
        chords[c].openStrings=settings.openStrings;     
        chords[c].allowOctaves=settings.allowOctaves; 

        for(let i in activeStrings){
          chords[c].stringDispo[i]=activeStrings[i];
        }


      }
    }
      
   }
  /**
    *
  */

  /**
    * @ignore
  */
  private save(){	

    // sauvegarde des contraintes "physiques", celles liées à la guitare
    var settings=this.settings;
    var activeStrings:boolean[]=[
    settings.string1,settings.string2,settings.string3,
    settings.string4,settings.string5,settings.string6];
    
  
    // paramètre mélodique
    this.selectedChords.forEach(c =>{
      c.melodyType=settings.melodyType
      c.maxStretch=settings.chordStretch;
      c.openStrings=settings.openStrings;      
      c.allowOctaves=settings.allowOctaves; 

      for(let i in activeStrings){
        c.stringDispo[i]=activeStrings[i];
      }

    });
  }

  // we must have at least three disposable strings
  private checkMinimalNumberOfStrings():boolean{

    var activeStrings:boolean[]=[
    this.settings.string1,this.settings.string2,this.settings.string3,
    this.settings.string4,this.settings.string5,this.settings.string6];

    let nb=activeStrings.reduce( (acc,cur) => { if(cur) return acc+1; else return acc; },0);

    return nb >=3;
  }

  /**
  * warns the user if a chord has not its guiding note set
  */
  async ionViewCanLeave() {

    this.save();

    if( ! this.selectedChords.some( c => c.guidingPitch==0)) 
      return true;

    if( this.canLeave=true){
      this.canLeave=false;
      return true;
    }
    const shouldLeave = await this.confirmLeave();
    return shouldLeave;
  }

  confirmSaveGuitar(): Promise<Boolean> {
      let resolveLeaving;
      const canLeave = new Promise<Boolean>(resolve => resolveLeaving = resolve);
      const alert = this.alertCtrl.create({
        title:     this.TP.tr('Save guitar constraints'),
        cssClass:  this.TP.tr('alertCustomCss'),
        message:   this.TP.tr('Do you want to save those settings all selected chords?'),
        buttons: [
        {
          text: this.TP.tr('No'),
          role: 'cancel',
          handler: () => resolveLeaving(false)
        },
        {
          text: this.TP.tr('Yes'),
          handler: () => resolveLeaving(true)
        }
        ]
      });
      alert.present();
      return canLeave
  }

  confirmLeaveGuitar(inTitle:string,msg:string): Promise<Boolean> {
      let resolveLeaving;
      const canLeave = new Promise<Boolean>(resolve => resolveLeaving = resolve);
      const alert = this.alertCtrl.create({
        title:     inTitle,
        cssClass:  'alertCustomCss',
        message:  msg ,
        buttons: [
          {
            text: this.TP.tr('Ok'),
            role: 'cancel',
            handler: () => resolveLeaving(false)
          }
        ]
      });
      alert.present();
      return canLeave
  }


  /**
    * @ignore
  */  
  confirmLeave(): Promise<Boolean> {
    let resolveLeaving;
    const canLeave = new Promise<Boolean>(resolve => resolveLeaving = resolve);
    const alert = this.alertCtrl.create({
      title: this.TP.tr('No guiding line selected.'),
      cssClass: 'alertCustomCss',
      message: this.TP.tr('Do you want to leave the page?'),
      buttons: [
      {
        text: this.TP.tr('No'),
        role: 'cancel',
        handler: () => resolveLeaving(false)
      },
      {
        text: this.TP.tr('Yes'),
        handler: () => resolveLeaving(true)
      }
      ]
    });
    alert.present();
    
    return canLeave
  }
}



