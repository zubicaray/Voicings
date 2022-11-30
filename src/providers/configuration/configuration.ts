import { Injectable } from '@angular/core';
import { ChordModel} from '../../models/chordModel';

// on considère que la guitare possède 24 ou 17 cases utilisablepour les accords
export const NB_FRETTES = 17;
  /**
  * @ignore
  */
export const OctavesOffset = 48;

export const TOP=1;
export const ARPEGIOS=1;
export const SWING=2;
export const TREMOLO=3;


export type TunningType={
	name:string,
	strings:number[]
}

export type SongType = { 
	songName:string,
	chords:ChordModel[],
	ScaleNotes:string[],
	ScaleNotesId:number,
	settings:Settings
};



export type PlayerSettings={bassPlayer:boolean,rhythmType:number,beatPerChord:number,tempo:number};
/**
* type for chord settings
*
*/
export type Settings={ 
	string1:boolean,string2:boolean,string3:boolean,
	string4:boolean,string5:boolean,string6:boolean, 
	fixedChordSize:{enable:boolean,size:number},
	maxToneStep:number,
	toneStep:number,
	melodyType:number,			
	nbFrets:number,
	chordStretch:number,
	openStrings:boolean,
	ascendingMelody:boolean,
	mustHaveRoot:boolean,
	mustHaveFifth:boolean,
	/** 
	* identifiers of the guiding line
	*/
	guidingLine:{IdStrength:number,IdKey:number,IdLine:number},
	chordRangeForLine:{begin:number,end:number},
	allowOctaves:boolean,
	chordSize:number,
	player:PlayerSettings,
	mTunning:TunningType
};

/**
* Default guitar chordage: pitch of each strings
*/
export const STANDARD_TUNNING:number[]=[52,57,62,67,71,76];
export const DADGAD_TUNNING:TunningType={name:'DADGAD',strings:[50,57,62,67,69,74]};
export const DADGBE_TUNNING:TunningType={name:'DADGBE',strings:[50,57,62,67,71,76]};
export const OPEN_A_TUNNING:TunningType={name:'OPEN A',strings:[50,57,60,65,69,76]};



/**
* Default settings for new added chord
*
*/
export const DEFAULT_SETTINGS={ 
	string1:true,string2:true,string3:true,
	string4:true,string5:true,string6:true, 
	maxToneStep:4,
	toneStep:2,
	melodyType:TOP,
	fixedChordSize:{enable:false,size:4},
	openStrings:true,
	mustHaveRoot:false,
	mustHaveFifth:false,		
	ascendingMelody:false,					
	nbFrets:NB_FRETTES,
	chordStretch:3,
	guidingLine:{IdStrength:-1,IdKey:-1,IdLine:-1},
	chordRangeForLine:{begin:0,end:-1},
	chordSize:4,
	allowOctaves:true,
	player:{bassPlayer:false,rhythmType:ARPEGIOS,beatPerChord:2,tempo:180},
	mTunning:{name:"standard",strings:STANDARD_TUNNING}

};
/**
* all notes with their corresponding pitch
*/
export const OctavesNotes:{pitch:number,key:string,label:string}[]=[

	{pitch:48,key:'C', label:'C3'},{pitch:49,key:'C', label:'Db3'},
	{pitch:50,key:'D', label:'D3'},{pitch:51,key:'D', label:'Eb3'},
	{pitch:52,key:'E', label:'E3'},{pitch:53,key:'F', label:'F3'},
	{pitch:54,key:'F', label:'Gb3'},{pitch:55,key:'G', label:'G3'},
	{pitch:56,key:'G', label:'Ab3'},{pitch:57,key:'A', label:'A3'},
	{pitch:58,key:'A', label:'Bb3'},{pitch:59,key:'B', label:'B3'},

	{pitch:60,key:'C', label:'C4'},{pitch:61,key:'C', label:'Db4'},
	{pitch:62,key:'D', label:'D4'},{pitch:63,key:'D', label:'Eb4'},
	{pitch:64,key:'E', label:'E4'},{pitch:65,key:'F', label:'F4'},
	{pitch:66,key:'F', label:'Gb4'},{pitch:67,key:'G', label:'G4'},
	{pitch:68,key:'G', label:'Ab4'},{pitch:69,key:'A', label:'A4'},
	{pitch:70,key:'A', label:'Bb4'},{pitch:71,key:'B', label:'B4'},
	
	{pitch:72,key:'C', label:'C5'},{pitch:73,key:'C', label:'Db5'},
	{pitch:74,key:'D', label:'D5'},{pitch:75,key:'D', label:'Eb5'},
	{pitch:76,key:'E', label:'E5'},{pitch:77,key:'F', label:'F5'},
	{pitch:78,key:'F', label:'Gb5'},{pitch:79,key:'G', label:'G5'},
	{pitch:80,key:'G', label:'Ab5'},{pitch:81,key:'A', label:'A5'},
	{pitch:82,key:'A', label:'Bb5'},{pitch:83,key:'B', label:'B5'},
	
	{pitch:84,key:'C', label:'C6'},{pitch:85,key:'C', label:'Db6'},
	{pitch:86,key:'D', label:'D6'},{pitch:87,key:'D', label:'Eb6'},
	{pitch:88,key:'E', label:'E6'},{pitch:89,key:'F', label:'F6'},
	{pitch:90,key:'F', label:'Gb6'},{pitch:91,key:'G', label:'G6'},
	{pitch:92,key:'G', label:'Ab6'},{pitch:93,key:'A', label:'A6'},
	{pitch:94,key:'A', label:'Bb6'},{pitch:95,key:'B', label:'B6'},
	
	{pitch:96,key:'C', label:'C7'},{pitch:97,key:'C', label:'Db7'},
	{pitch:98,key:'D', label:'D7'},{pitch:99,key:'D', label:'Eb7'},
	{pitch:100,key:'E', label:'E7'},{pitch:101,key:'F', label:'F7'},
	{pitch:102,key:'F', label:'Gb7'},{pitch:103,key:'G', label:'G7'},
	{pitch:104,key:'G', label:'Ab7'},{pitch:105,key:'A', label:'A7'},
	{pitch:106,key:'A', label:'Bb7'},{pitch:107,key:'B', label:'B7'}
];	
/**
* type for chord settings
*/
export type ChordSettings = {name:string, mandatory:number[], natural:number[], modern:number[]};
/**
* List of all chord type for each family
*/
export const ChordFamilyList:{name:string,chords:ChordSettings[]}[]=[

	{	name:"major",
		chords:[
			{ name:"major", mandatory:[4],      natural:[0,7,2,9,11], modern:[5,6,8]},
			{ name:"6",     mandatory:[4,9],    natural:[0,7,2,11],   modern:[5,6,8]},
			{ name:"69",    mandatory:[2,4,9],  natural:[0,7,11],     modern:[5,6,8]},
			{ name:"Δ",   	mandatory:[4,11],   natural:[0,7,2,9],    modern:[5,6,8]}
	]},
	{
		name:"minor",
		chords:[
			
			{ name:"-",    mandatory:[3],      natural:[0,2,7,5,8,9,10,11], modern:[6]},
			{ name:"-6",   mandatory:[3,9],    natural:[0,7,2,10],     		modern:[5,6,8]},
			{ name:"-69",  mandatory:[2,3,9],  natural:[0,7,10],       		modern:[5,6,8]},
			{ name:"-7",   mandatory:[3,10],   natural:[0,7,2,5,9],    		modern:[6,8]},
			{ name:"- Δ",  mandatory:[3,11],   natural:[0,7,2,5,9],   		modern:[6,8]}
		]
	},
	
	{
		name:"dominant",
		chords:[
			{ name:"7",     mandatory:[4,10],   natural:[0,2,5,7,9],   	modern:[1,3,6,8]},
			{ name:"7(-)",	mandatory:[4,10],   natural:[0,1,5,7,8],   	modern:[3,6]},
			{ name:"13",    mandatory:[4,9,10], natural:[0,2,5,7],   	modern:[1,3,6,8]},
			{ name:"9",     mandatory:[2,4,10], natural:[0,5,7],     	modern:[1,3,6,8]},
			{ name:"9,13",  mandatory:[2,4,9,10],natural:[0,2,5,7],   	modern:[1,3,6,8]},
			{ name:"9b",    mandatory:[1,4,10],natural:[0,5,7], 		modern:[6,9]},
			{ name:"13b",   mandatory:[6,4,10],natural:[0,5,7], 		modern:[6,9]},
			{ name:"9b,13b",mandatory:[1,6,4,10],natural:[0,5,7], 		modern:[6,9]}
		]
	}
	,
	{
		name:"altered",
		chords:[
			{ name:"9b,13", mandatory:[1,4,9,10],natural:[0,5,7], 		modern:[6,8]},
			{ name:"5b",    mandatory:[4,6,10], natural:[0,2,9],   		modern:[1,3,5,6,7,8]},
			{ name:"alt",   mandatory:[4,10],   natural:[0,1,3,5,6,7,9],modern:[2,8]}
		]
	}
	,
	{
		name:"diminished",
		chords:[
			{ name:"°",   	mandatory:[3,6,9],  natural:[0],      modern:[]},
			{ name:"Ø",		mandatory:[3,6,10], natural:[0,1,8],  modern:[]}         
		]
	}
];
/**
* @ignore
*/
export type 	GuitarString = {Id:number,pitch:number};   
/**
* @ignore
*/ 
export const 	Keys:string[]=[ 'C','Db','D','Eb', 'E','F','Gb','G','Ab','A','Bb','B'];

/**
* @ignore
*/ 
export const 	SharpKeys:string[]=[ 'C','C#','D','D#', 'E','F','F#','G','G#','A','A#','B'];
/**
* @ignore
*/
export const 	KeysId:number[]=[0,1,2,3,4,5,6,7,8,9,10,11];
/**
* @ignore
*/
export function isBemol (i:number): boolean {
    return [1,3,6,8,10].includes(i,0)   
}


/**
 * provider for getting configuration
*/
@Injectable()
export class ConfigurationProvider {

	constructor() {

	}
	
	/**
	* @ignore
	*/
	getType(familyId:number,typeId:number):ChordSettings {
		return ChordFamilyList[familyId].chords[typeId];
	}
	
	/**
	* make a string from guiding line
	*/
	printNotes(guidingLine:number[]) :string{

		return guidingLine.reduce( (acc,note) => {
			acc += ' '+Keys[note];
			return acc;
		},"")
	}
	/**
	* used to show only first and last notes of the guiding line
	*/
	printFirstLastKey(keys:number[]):string{     
	     return Keys[keys[0]]+ " -> " + Keys[keys[keys.length-1]];
	}


}
