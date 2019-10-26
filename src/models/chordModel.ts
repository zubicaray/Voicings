
import {NB_FRETTES,OctavesOffset,ConfigurationProvider,GuitarString,OctavesNotes,Chordage}   from    '../providers/configuration/configuration' 
import {mod,clone}   from    '../providers/tools/tools' 

/**
* Type for representing an instance of chord that has its own diagram,
* its own frets
*
*/
export type DiagramType ={  
  /** tells whoch strings holds the guiding note */
  guidingString:number, 
  frets:number[],
  /** difference betwwen the higher and lower frets */
  stretch:number,
  /** stores key id and pitch of all chord notes */
  notes:{note:number,pitch:number}[]
}

export const GUIDING_NOTE_ON_TOP=1;
export const GUIDING_NOTE_ON_BASS=2;
export const GUIDING_NOTE_ANTWHERE=3;

/** 
* represent a chord, graphycally, harmonically and all its instances on the fretboard
 */
export class ChordModel {

  static configurationProvider:ConfigurationProvider=new ConfigurationProvider();


  /** mandatory, as regard harmony, notes of the chord  */
  mandatory:number[]=[];
  /** all ok, as regard harmony, notes of the chord  */
  natural:number[]=[];
  /** all "sometimes not so good", as regard harmony, notes of the chord  */
  modern:number[]=[];
  pitch:number=0;

  private errorMsg:string;
  
  /* chosen diagram chord on the fretboard */
  canvas:DiagramType;

  chordage:GuitarString[]=ChordModel.configurationProvider.getOrderedChordage();

  static new():ChordModel{//ChordModel.newEmptyDiagram()
    return new ChordModel(1,0,0,0,0,0,[ ], false, false, 5, 1,0,true,[true,true,true,true,true,true],false);
  }

  /**
  * inner recursive function
  *

  * @param { number}  Id index of the chord in the song
  * @param { number}  keyid  key oh thre chord
  * @param { number}  idFamily chord family type: major, minor, dominant ...
  * @param { number}  idtype type of chord: major 69, 5b, -75b
  * @param { number}  idDiag id og the chosen DiagramType
  * @param { number}  idDiag_Y Y coord og diagrams view
  * @param { DiagramType[] }  all possible diagrams
  * @param { boolean} HasRoot  if chord must have a root -- UNUSED
  * @param { boolean} HasFifth  if chord must have a fifth -- UNUSED
  * @param { number}  maxStretch  max diff between lower and higher frets on the neck
  * @param { number}  melodyType type of guiding notes: ate the top, at the bass or anywhere 
  * @param { number}  guidingPitch pitch of the guiding key 
  * @param { boolean} openStrings if chord can use open strings ( 0 fret)
  * @param { boolean[]} stringDispo  allows to (un)mute strings
  
  */
  constructor(    
    public Id:number, 
    public keyid:number,
    public idFamily:number,
    public idtype:number,
    public idDiag:number,
    public idDiag_Y:number,
    public diagrams:DiagramType[],
    public HasRoot:boolean,
    public HasFifth:boolean,
    public maxStretch:number,
    public melodyType:number,
    public guidingPitch:number,
    public openStrings:boolean,
    public stringDispo:boolean[],
    public allowOctaves:boolean,
    )
  {
    this.canvas =diagrams.length>0 ?diagrams[idDiag]:undefined;   
    this.maxStretch= maxStretch== null ? 4 :maxStretch;
    this.allowOctaves= allowOctaves== null ? false :allowOctaves;
    idDiag_Y=0;
    this.init();  

  }
  /**

  * given key and chord type, computes all notes possible

  */
  init(){

    delete this.mandatory;
    delete this.natural;
    delete this.modern;

    this.mandatory=[];
    this.natural=[];
    this.modern=[];



    if( this.keyid != null && this.getType() != null ){
      this.setModernNotes();
      this.setNaturalNotes();
      this.setMandatoryNotes();
    }
  }

  public getError():string{
      return this.errorMsg;
  }

  public getCanvasPitches():string[]{
 
    if(this.canvas== undefined) return [];

    return this.canvas.notes.map(a=> OctavesNotes[a.pitch-OctavesOffset].label);

  }

  checkNumberAvailableStrings():boolean{
    let nb=this.stringDispo.reduce( (acc,cur) => { if(cur) return acc+1; else return acc; },0);

    if(nb<3){
      this.errorMsg="You must enable at least three strings."
      return false;
    }
    return true;
  }
   
  /**
  * when changing chord setting the guiding note previously set
  * may not be possible anymore
  * if so, we'll have to rease it
  */
  isGuidingNoteStillOk():boolean{
     if(this.mandatory.some(n => mod(this.guidingPitch,12)==n)) return true;  
     if(this.natural.some(n => mod(this.guidingPitch,12)==n)) return true;  

     return false;
  }

  /**
  * tells if input pitch can belong to availables strings
  * and if there enough room for remainings mandatory notes
  */
  possibleGuidingNote(inGuidingPitch:number):boolean{

    this.errorMsg="";

    if(inGuidingPitch==0){
      this.errorMsg="Guiding note unset.";
      return false;
    }

    let stringsAvailable=[];
    for(var i:number=0;i<this.stringDispo.length;i++){
      if(this.stringDispo[i])
        stringsAvailable.push(Chordage[i]);
    }
    stringsAvailable.sort();
    let max=stringsAvailable[stringsAvailable.length-1]+NB_FRETTES;

    let min=stringsAvailable[0];

    if(inGuidingPitch==stringsAvailable[0] && !this.openStrings){
      this.errorMsg="Open lowest string.";
      return false;
    }  

    // l'accordage ne permet pas d'avoir la guiding note
    if(inGuidingPitch>max || inGuidingPitch<min) {
      //console.log("l'accordage ne permet pas d'avoir la guiding note");
      this.errorMsg="Guitar tunning can't contain this guiding note.";
      return false;
    }

    if(this.melodyType !=GUIDING_NOTE_ANTWHERE)
    {
      let stopFret=this.openStrings?0:1;
      /** on cherche la note sur la corde la plus aigue pour avoir le plus de cordes de libre
      * pour le reste des notes obligatoires
      */
      if(this.melodyType== GUIDING_NOTE_ON_TOP){

        // une corde à vide plus aigue que le guide ne doit pas etre utilisée
        stringsAvailable=stringsAvailable.filter( c =>  c <= inGuidingPitch );
        stringsAvailable.reverse();

        let stringNumber,k;

        let stopFret=this.openStrings?0:1;
        let broke=false;
        for(stringNumber=0;stringNumber<stringsAvailable.length;stringNumber++){
          for(k=NB_FRETTES;k>=stopFret;k--){
            if( (stringsAvailable[stringNumber]+k) == inGuidingPitch) 
              {broke=true;break;}
          }
          if( broke) 
            break;
        }

        // nombre de notes obligatoire
        let nbOblig=this.mandatory.length;
        // si la guiding note fait partie de notes oblig on 
        if(this.mandatory.some(n => mod(inGuidingPitch,12)==n)) nbOblig--;
        // nombre maximales de chordes sur lesquelles mettre es notes obligatoire
        let leftString=stringsAvailable.length-(stringNumber+1);
        // il faut aussi qu'on ait au moins trois notes => leftString>1
        if( leftString<nbOblig ||  leftString<2) 
        {
          //console.log("l'accordage ne permet pas d'avoir la guiding note.leftString="+leftString+" noteoblig:"+nbOblig);
          this.errorMsg="Not enough available strings with a guiding melody at the top.";
          return false
        }
      } 
      if(this.melodyType== GUIDING_NOTE_ON_BASS){

        // une corde à vide plus grave que le guide ne doit pas etre utilisée
        //stringsAvailable=stringsAvailable.filter( c =>  c >= inGuidingPitch );


        let stringNumber,k;
        let broke=false;
        for(stringNumber=0;stringNumber<stringsAvailable.length;stringNumber++){
          for(k=stopFret;k<=NB_FRETTES;k++){
            if( (stringsAvailable[stringNumber]+k) == inGuidingPitch) 
              {broke=true;break;}
          }
          if( broke) 
            break;
        }

        // nombre de notes obligatoire
        let nbOblig=this.mandatory.length;
        // si la guiding note fait partie de notes oblig on 
        if(this.mandatory.some(n => mod(inGuidingPitch,12)==n)) nbOblig--;
        // nombre maximales de chordes sur lesquelles mettre es notes obligatoire
        let leftString=stringsAvailable.length-(stringNumber+1);
        // il faut aussi qu'on ait au moins trois notes => leftString>1
        if( leftString<nbOblig ||  leftString<2)  {
          //console.log("l'accordage ne permet pas d'avoir la guiding note.leftString="+leftString+" noteoblig:"+nbOblig);
          this.errorMsg="Not enough available strings with guiding note at the bass.";
          return false;
        }
      }
    }
    return true;
  }

  /**
  * @ignore
  */
  toMidiNotes():any[]{
    var notes:any[]=[];

    for(var i:number=this.canvas.notes.length-1;i>=0;i--){
      var pitch=this.canvas.notes[i].pitch;

      notes.push(OctavesNotes[pitch-OctavesOffset].label);

    }
    return notes;
  }

  /**
  * @ignore
  */
  printGuidingPitch():string{

    if (isNaN(this.guidingPitch)||this.guidingPitch==undefined || this.guidingPitch<OctavesOffset) 
      return 'unset';    
    else
      return OctavesNotes[this.guidingPitch-OctavesOffset].label;
  }
  /**
  * @ignore
  */
  getNotes():number[]{
    return this.mandatory.concat(this.natural);
  }
  /**
  * @ignore
  */
  getType():{name:string, mandatory:number[], natural:number[], modern:number[]} {
    return ChordModel.configurationProvider.getType(this.idFamily,this.idtype);
  }
  /**
  * @ignore
  */
  getSharp():string  {
    if(OctavesNotes[this.keyid].sharp)           
      return "#";
    else return "";
  }
  /**
  * @ignore
  */
  getKey():string {
    return OctavesNotes[this.keyid].key;
  }

  getFullName():string{
    return this.getKey()+this.getSharp()+" "+this.getType().name;
  }
  /**
  * @ignore
  */
  IsNoFifth(element:number):boolean {
    return element != 7;
  }
  /**
  * @ignore
  */
  IsNoRoot(element:number):boolean {
    return element != 0;
  }
  /**
  * @ignore
  */
  setMandatoryNotes(){
    // notes "relatives" obligatoires
    var mandatories:number[]=this.getType().mandatory;

    if( this.HasRoot )
      this.mandatory.push(this.keyid);


    if( this.HasFifth )
      this.mandatory.push((this.keyid+7)%12);

    //conversion en notees absolues
    for(var i=0; i < mandatories.length; i++) {          
      this.mandatory.push((this.keyid+mandatories[i])%12);

    }   
  }
  /**
  * @ignore
  */
  setNaturalNotes(){      

    var naturals:number[];
    if( this.HasFifth ) // fifth is already in the mandatory notes
      naturals    =this.getType().natural.filter(this.IsNoFifth);       
    else
      naturals=this.getType().natural;     

    if( this.HasRoot)// root is already in the mandatory notes)
      naturals=naturals.filter(this.IsNoRoot);   


    for(var i=0; i < naturals.length; i++) {          
      this.natural.push((this.keyid+naturals[i])%12);

    }      
  }
  /**
  * @ignore
  */
  setModernNotes(){



    var moderns:number[];
    if( this.HasFifth )// fifth is already in the mandatory notes
      moderns=this.getType().modern.filter(this.IsNoFifth);       
    else
      moderns=this.getType().modern;      

    if( this.HasRoot)// root is already in the mandatory notes)
      moderns=moderns.filter(this.IsNoRoot);  

    for( var i=0; i < moderns.length; i++) {          
      this.modern.push((this.keyid+moderns[i])%12);

    }
  }

  static newEmptyDiagram():DiagramType
  {
    var currentDiag:DiagramType={
      guidingString:-1, 
      frets:[null,null,null,null,null,null],
      stretch:0,
      notes:[]
    };

    return currentDiag;
  }
  /** 
  * remove diagrams if a new guiding note has been set
  */
  checkPossible(){
    if(this.possibleGuidingNote(this.guidingPitch) ==false)
    {
      delete this.diagrams;

      this.idDiag=0;
      this.canvas=undefined;  
      return false;
    }
    return true;
  } 
  /** 
  * find chord diagrams
  */
  findChordDiagrams(){

    delete this.diagrams;

    //deep copy of chord note list
    var mandatories:number[]=Array.from( this.mandatory);

    var res:DiagramType[]=[];  
    if(this.possibleGuidingNote(this.guidingPitch) ==true)
    {

      this.innerFindChorDiagrams(mandatories,this.getNotes(), 0,ChordModel.newEmptyDiagram(),res);
      res.sort( (a,b) => { return b.notes.length-a.notes.length})

      if(res.length==0){
        this.errorMsg="Chords undoable, stretch too high. Unmute one string at least.";
        if(! this.openStrings){
           this.errorMsg+=" You could also try to allow open strings.";
        }
      }
    }
        
    this.diagrams=res;
    this.idDiag=0;
    this.canvas=this.diagrams[0];  

  }
  /**
  * @ignore
  */
  getPitch(itString:number,itFrette:number):number{
    return this.chordage[itString].pitch+itFrette;
  }
  /**
  * @ignore
  */
  getNote(itString:number,itFrette:number):number{
    return mod(this.getPitch(itString,itFrette)-OctavesOffset,12);
  }

  /**
  * @ignore
  */
  getStringLeft(itString:number):number{
    var res:number=0;
    for(var i:number=itString;i<this.chordage.length;i++){
      if(this.stringDispo[this.chordage[itString].Id]) res++;
    }
    return res;

  }
  /**
  * Tells if diagrams seeking  has to stop
  */
  hasToStop(currentDiag:DiagramType,itString:number,mandatory:number[],currentPitch:number):boolean{

    if(currentDiag.guidingString==-1 && this.guidingPitch>currentPitch){
      // comme les cordes suivantes sont encore plus graves
      // on ne pourra plus trouver la guiding note
      return true;
    }
    if(this.getStringLeft(itString)<mandatory.length){
      //plus assez de corde pour avoir toutes les notes obligatoires
      return true;
    }

    return false;
  }
 /**
  * checks if minor chord has the two seventh
  */
  willHaveBothSeventh(currentNote:number,currentDiag:DiagramType):boolean{

    var isMajorSeventh:boolean=mod(currentNote-this.keyid,12)==11;
    var isMinorSeventh:boolean=mod(currentNote-this.keyid,12)==10;
    //check i
    var hasMajorSeventh:boolean=currentDiag.notes.some(e=> mod(e.note-this.keyid,12)==11);
    var hasMinorSeventh:boolean=currentDiag.notes.some(e=> mod(e.note-this.keyid,12)==10);

    if( (isMajorSeventh && hasMinorSeventh) || (isMinorSeventh &&hasMajorSeventh) )
      return true
    else 
      return false;
  }

  /**
  * checks if minor chord has the two seventh
  */
  willHaveBothThirteenth(currentNote:number,currentDiag:DiagramType):boolean{

    var isMajorThirteeth:boolean=mod(currentNote-this.keyid,12)==9;
    var isMinorThirteeth:boolean=mod(currentNote-this.keyid,12)==8;
    //check i
    var hasMajorThirteeth:boolean=currentDiag.notes.some(e=> mod(e.note-this.keyid,12)==9);
    var hasMinorThirteeth:boolean=currentDiag.notes.some(e=> mod(e.note-this.keyid,12)==8);

    if( (isMajorThirteeth && hasMinorThirteeth) || (isMinorThirteeth &&hasMajorThirteeth) )
      return true
    else 
      return false;
  }

   /**
  * checks if the stretch is not too high
  */
  ecartOk(currentDiag:DiagramType,itFrette:number):boolean{
    var ecart : number=0;
    if(itFrette ==0) return true;
    for(var i:number =0;i<currentDiag.frets.length;i++)
    {
      if(currentDiag.frets[i]==null || currentDiag.frets[i]==0) 
        continue;

      ecart=Math.abs(currentDiag.frets[i]-itFrette);

      if(ecart> this.maxStretch) {
        return false;
      } 
      else{
        if(ecart >currentDiag.stretch){
          currentDiag.stretch=ecart;
        }
      }

    }
    return true;
  }

  /**
  * inner recursive function
  *
  * @param { Array<number>}    mandatory remaing mandatory notes
  * @param { Array<number>}    possible remaing  notes
  * @param { number}           itString  index of the string where where find notes
  * @param { DiagramType}    on going diagram
  * @param { DiagramType[] }  Map result
  
  */
  innerFindChorDiagrams(mandatory:Array<number>,possible:Array<number>,itString:number,currentDiag:DiagramType,result:DiagramType[]){


    var startfrette:number=this.openStrings?0:1;

    if(this.stringDispo[this.chordage[itString].Id])
    {

      // on va toujours dans le sens aigue-> grave
      for(var itFrette:number=NB_FRETTES;itFrette>=startfrette;itFrette--)
      {

        if(! this.ecartOk(currentDiag,itFrette))   continue;

        let currentPitch=this.getPitch(itString,itFrette);

        if(this.hasToStop(currentDiag,itString,mandatory,currentPitch)) break;

        let currentNote=this.getNote(itString,itFrette);

        let indexM=mandatory.indexOf(currentNote);

        let indexP=possible.indexOf(currentNote);

        var newMandatory:number[]=Array.from( mandatory);
        var newPossible:number[]=Array.from( possible);
        var copyIt=itString+1;

        if(indexM != -1) { 
          /** on n'a plus besoin de trouver cette note obligatoire */
          newMandatory.splice(indexM,1);
        }

        if(indexP != -1 && this.allowOctaves==false) { 
          /** on n'a plus besoin de trouver cette note obligatoire */
          newPossible.splice(indexP,1);
        }

        if(indexP != -1 && this.willHaveBothSeventh(currentNote,currentDiag)) continue ;
        if(indexP != -1 && this.willHaveBothThirteenth(currentNote,currentDiag)) continue ;


        if(indexM>-1 || indexP>-1 )// la note peut faire partie de l'accord en construction
        { 

          if(this.melodyType==GUIDING_NOTE_ON_TOP && currentPitch != this.guidingPitch && currentDiag.notes.length==0){
            // comme le parcours se fait du plus aigue vers le plus grave
            // la première note doit-être la guiding note 
            continue;
          }


          let clonedDiag=clone(currentDiag);

          clonedDiag.frets[this.chordage[itString].Id]=itFrette;
          clonedDiag.notes.push({note:currentNote,pitch:currentPitch});

          if( currentPitch == this.guidingPitch){
            clonedDiag.guidingString=this.chordage[itString].Id;
          }

          if(newMandatory.length==0 && clonedDiag.guidingString>-1 && clonedDiag.notes.length>2){
            //toutes les notes obligatoires sont là et la guiding note aussi
            //-> on ajoute l'accord en cours
            // todo: set lowest and highest note
            result.push(clonedDiag);
          }

          if(this.melodyType==GUIDING_NOTE_ON_BASS && currentPitch == this.guidingPitch ){
            // comme le parcours se fait du plus aigue vers le plus grave
            // si on vient d'ajouter la guiding, elle devra rester la note la lus grave 
            break;
          }
          if(copyIt<this.chordage.length) {
            // que l'accord en cours fut ajouté à "result" ou pas
            // on continue de construire l'accord où vient d'être ajouté "currentNote"
            this.innerFindChorDiagrams(newMandatory,newPossible,copyIt,clonedDiag,result);
          }

        }

      }

    }
    // parcours des cordes triées dans l'ordre décroissant de leur hauteur à vide, ie dans le sens aigue-> grave 
    itString++;
    if(itString<this.chordage.length) 
      this.innerFindChorDiagrams(mandatory,possible,itString,currentDiag,result);
  }
}
