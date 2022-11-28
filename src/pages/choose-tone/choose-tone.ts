import { Component } from '@angular/core';
import { ViewController, NavController,AlertController, NavParams } from 'ionic-angular';
import { Keys, SharpKeys,TunningType,SongType,isBemol ,STANDARD_TUNNING} from '../../providers/configuration/configuration';
import { AddingChordPage }from    '../adding-chord/adding-chord';
import { EditVoicingPage}  from    '../edit-voicing/edit-voicing'
import { TranslationProvider } from '../../providers/translation/translation';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
 @Component({
 	selector: 'page-modal-choose-tone',
 	templateUrl: 'choose-tone.html',
 })
 export class ChooseTonePage {

   Keys: string[];	
   ScaleNotes:string[];
   ScaleKeyId:number;
   Voicings:SongType ;
   Tunning:number[]=[];
   mTunning:TunningType;
   private isNew:boolean=true;
   TunningList:TunningType[];
   private  Standard:TunningType={name:"standard",strings:STANDARD_TUNNING};

 	constructor(public navCtrl: NavController, public navParams: NavParams, 
    public viewCtrl : ViewController,private storage: Storage,private TP: TranslationProvider,
    public alertCtrl: AlertController) {

      this.Keys=Keys;
      this.Voicings = navParams.get('songVoicings');

      //debugger
      if(this.Voicings !=undefined){
        this.ScaleNotes = this.Voicings.ScaleNotes;
        this.ScaleKeyId = this.Voicings.ScaleNotesId;
        this.Tunning = this.Voicings.settings.tunning;

      }

      
      
      if(this.ScaleNotes.length>0) this.isNew=false;

      this.storage.get("PAID").then( 
        (res)=>{
          
          console.log("res="+res);
          if (res!=null){
            //debugger
            this.storage.get("TunningList").then(
              inTunningList => {
                //TODO
                if(inTunningList == null){
                  this.TunningList =[this.Standard];
                }
                else{		
                  this.TunningList=inTunningList;
                  (this.TunningList.unshift(this.Standard));

                }
                this.mTunning=this.TunningList[0];
              })
          }
        }
        ,
        ()=> {
        
          this.alert(this.TP.tr("Erreur en base de donnée"),this.TP.tr("Contactez le développeur ;-)."))
          this.navCtrl.setRoot(HomePage);
        }
      );
      

 	}


  compareFn(e1:TunningType, e2: TunningType): boolean {
    return  e1.name == e2.name;
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
 	public closeModal(key:number){

    debugger
    if(isBemol(key)){
      this.Voicings.ScaleNotes=Keys;
    }
    else
    {
      this.Voicings.ScaleNotes=SharpKeys;
    }
    this.Voicings.settings.tunning=this.mTunning.strings;
    this.Voicings.ScaleNotesId=key;
    this.Voicings.chords.forEach(c=>c.setScaleNotes(this.Voicings.ScaleNotes))

    this.viewCtrl.dismiss();
    this.navCtrl.push(EditVoicingPage, {
      songVoicings: this.Voicings
    });

    if(this.isNew) 
      this.navCtrl.push(AddingChordPage, { Voicings: this.Voicings	 });
	}

 	ionViewDidLoad() {

   }
   
  }
