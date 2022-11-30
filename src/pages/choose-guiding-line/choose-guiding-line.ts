import { Component } from '@angular/core';
import {  NavController, NavParams ,ModalController,LoadingController,ToastController} from 'ionic-angular';
import { ComputationProvider,GuidingLineStrengthMap}  from    '../../providers/computations/computations'
import { ModalChooseOctavePage} from '../modal-choose-octave/modal-choose-octave';
import { ConfigurationProvider,Keys,Settings}  from    '../../providers/configuration/configuration' ;
import { ChordModel} from '../../models/chordModel'; 
import { LoadingCtrlPage}  from    '../loading-ctrl/loading-ctrl';
import { TranslationProvider } from '../../providers/translation/translation';



@Component({
  selector: 'page-choose-guiding-line',
  templateUrl: 'choose-guiding-line.html',
})
export class ChooseGuidingLinePage extends LoadingCtrlPage {

  chords: ChordModel[];	
  settings:Settings;

  DescendingLines:GuidingLineStrengthMap;

  StrengthKeys:number[];
  shownGroupStrength:number = null;  
 
  shownGroupKey:number = null;
  /**
    * @ignore
  */
  toggleGroupStrengthKey(group) {
 
    if (this.isGroupKeyShown(group)) {
      this.shownGroupKey = null;
    } else {
      this.shownGroupKey = group;
    }
  };

  constructor(public navCtrl: NavController,  public modalCtrl : ModalController,public toastCtrl: ToastController,public loadingCtrl: LoadingController,
    public computationProvider:ComputationProvider,public navParams: NavParams,
    private configurationProvider:ConfigurationProvider,
    private TP: TranslationProvider) {

  	super(loadingCtrl);

    this.DescendingLines=new Map<number,Map<number,number[][]>>();
  	this.chords = navParams.get('chords');
    this.settings=navParams.get('settings');
    
    

    computationProvider.toneStep=this.settings.toneStep;
    this.showLoader(this.TP.tr("Searching for guiding lines ..."));

    setTimeout(() => {
      this.DescendingLines=computationProvider.findDescendingLine(this.chords);
      //trie par ordre décroissant
      this.StrengthKeys=Array.from( this.DescendingLines.keys()).sort( (a,b) => b-a);

      if(this.settings.guidingLine ==undefined) this.settings.guidingLine={IdStrength:-1,IdKey:-1,IdLine:-1};

      if(this.settings.guidingLine.IdStrength !=-1 && this.settings.guidingLine.IdKey !=-1 && this.settings.guidingLine.IdLine !=-1){
        this.shownGroupStrength=this.settings.guidingLine.IdStrength;
        this.shownGroupKey=this.settings.guidingLine.IdKey;
      } 
    }, 100);

  


  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: this.TP.tr('Some chord cannot be build with given guide.'),
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      //console.log('Dismissed toast');
    });

    toast.present();
  }


  /**
    * @ignore
  */
  presentModal(inPitches:number[][] ): Promise<Boolean>{
    
    var data = { pitches : inPitches,chords: this.chords};

    var modalPage = this.modalCtrl.create(ModalChooseOctavePage,data,{enableBackdropDismiss:false});
    return modalPage.present(); 
  }

  generateVoicings(){

    this.showLoader(this.TP.tr("Search all possible chords ..."));
    setTimeout(() => {
         for(var i:number=0;i<this.chords.length;i++){
          this.chords[i].findChordDiagrams();
        }
      }, 
      100);    
    
    this.dismissLoader();

    this.navCtrl.pop();
    this.navCtrl.pop();
    
    
  }

  ionViewDidLoad() {
  }


  /**
    * @ignore
  */  
  isGroupKeyShown(group) {
    return this.shownGroupKey === group ;
  };

  /**
    * @ignore
  */
  printNotes(inNotes) :string{
    return this.configurationProvider.printNotes(inNotes);
  };

  /**
    * @ignore
  */
  toggleGroupStrength(group) {    

    if (this.isGroupStrengthShown(group)) {
      this.shownGroupStrength = null;
    } else {
      this.shownGroupStrength = group;
    }
    this.shownGroupKey = null;
  };
  /**
    * @ignore
  */
  isGroupStrengthShown(group) {
    return this.shownGroupStrength === group;
  };

  /**
    * @ignore
  */
  pad2(number:number) :string{
    return (number < 10 ? '0' : '') + number
  }

  /**
    * prints first and last notes of guiding line
    * based on the keys of the map
  */
  printKey(key:number):string{ 		
    return Keys[~~(key/1000)]+ " -> " + Keys[key%1000];
  }

  /**
    * allows to return keys list from a map
    * which can't be done in a ngFor
  */
  getKeys(map):any{
    if(map != undefined){
      let res=Array.from(map.keys());
      res.sort( (a:number,b:number) => { return a-b});
      return res;
    }

    return [];
    
  }

  printNote(key:number):string{ 		    
    return Keys[key];
  }


  /**
  * set strentgh key , firsAndLast key , and line key indexes
  * and open modal window so as to propose all possible octaves, or pitches list, for given guiding notes
   * @param { number[]} guidingNotes note key list
   * @param { number }  strengthKeyIndex index of the strengh key in the map DescendingLines {GuidingLineStrengthMap}
   * @param { number }  firstAndLastKeyIndex index of the key  of the map that stores lines with the same first and last guidng notes
   * @param { number }  lineIndex  index of the chosen line
   */
  async openModal(guidingNotes:number[],strengthKeyIndex:number,firstAndLastKeyIndex:number,lineIndex:number){
    //console.log(`${i} ${j} ${k}`); 

    this.settings.guidingLine.IdStrength=strengthKeyIndex; 
    this.settings.guidingLine.IdKey=firstAndLastKeyIndex;
    this.settings.guidingLine.IdLine=lineIndex;

    var pitches:number[][]=this.computationProvider.findOctaves(guidingNotes,this.settings.mTunning.strings,this.chords)
    if(pitches.length>0)
      return await this.presentModal(pitches);     
    else{
       this.presentToast() ;
    }
  }
 


  /**
    * Recomputes all possible guiding lines if one parameter has been changed
    * ids for strentgh, firsAndLastKey, and line are reset
  */
  setDescente(){
    delete this.DescendingLines;
    delete this.StrengthKeys;
    this.computationProvider.setToneStep(this.settings.toneStep);
    this.computationProvider.setAscendingMelody(this.settings.ascendingMelody);
    
    this.DescendingLines=this.computationProvider.findDescendingLine(this.chords);
    this.StrengthKeys=Array.from( this.DescendingLines.keys()).sort( (a,b) => b-a);
    this.chords.forEach(c =>{c.melodyType=this.settings.melodyType});
    this.settings.guidingLine.IdKey=-1;
    this.shownGroupStrength=-1;
    this.settings.guidingLine.IdLine=-1;
    this.chords.forEach(c =>{ c.guidingPitch=0;});
    
  }

}
