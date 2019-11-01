import { OctavesNotes, Chordage,NB_FRETTES } from '../../providers/configuration/configuration';
import { ChordModel} from '../../models/chordModel';
import { ConfigurationProvider} from    '../../providers/configuration/configuration'
import { mod }   from    '../../providers/tools/tools' 
import { Injectable } from '@angular/core';


/**
	Map that stores guiding lines according to their first and last notes
*/
export type GuidingLineMap=Map<number,number[][]>;

/**
	Map that stores the chords guiding lines according to their number of different notes ie their "strength"
*/
export type GuidingLineStrengthMap=Map<number,GuidingLineMap>;



/**
	* ComputationProvider class contains all needed for computing
	* guiding lines
*/
@Injectable()
export class ComputationProvider {

	maxToneStep:number;
	toneStep:number;


	chords: ChordModel[];
	ascendingMelody:boolean;
	/**
	*@ignore
	*/
	constructor(configurationProvider:ConfigurationProvider) {
				
	}
	/**
	*@ignore
	*/
	setChords(inChords: ChordModel[]){
		this.chords=inChords;
	}
	/**
	*@ignore
	*/
	setMaxToneStep(s:number){
		this.maxToneStep=s;
	}
	
	/**
	*@ignore
	*/
	setAscendingMelody(b:boolean){
		this.ascendingMelody=b;
	}
	/**
	*@ignore
	*/
	setToneStep(s:number){
		this.toneStep=s;
	}



	/**
	* computes all guiding lines given all chords possible notes
	*
	 * @param { ChordModel[]} inChords  Set of chords
	 * @returns {GuidingLineStrengthMap} Guiding Lines
	 */
	findDescendingLine (inChords: ChordModel[]):GuidingLineStrengthMap	{

		this.setChords(inChords);
		var res:GuidingLineStrengthMap=new Map<number,Map<number,number[][]>>();
		this.InnerFindDescendingLine(0,[],-1,res);
		
		return res;
	}

	

	getGuidingLineStrength (guidingLine:number[]):number {
		 return new Set(guidingLine).size;
       
    };

    /**
	* computes key for GuidingLineMap  with this formula:
	*
	* guidingLine[0] * 1000 + guidingLine[guidingLine.length - 1];
	*
	 * @param { number[] } guiding notes for a given set of chords
	 * @returns {number } key of all guiding lines having the same first and last notes
	 */
	private getGuidingLineKey(guidingLine:number[]):number {
		 return guidingLine[0] * 1000 + guidingLine[guidingLine.length - 1];
	}

	/**
	* inner recursive function
	*
	
	* @param { number }  chordIterator  index of the chord among the set
	* @param { number[] }  onGoingGuidingLine the guiding line that's being built
	* @param { number }  lastNote  last note of onGoingGuidingLine
	* @param { GuidingLineStrengthMap }  Map result
	
	*/
	private InnerFindDescendingLine (
		chordIterator:number,onGoingGuidingLine:number[],
		lastNote:number,  
		guidingLinesResult:GuidingLineStrengthMap){		

		//debugger;	
		var NbChords :number   = this.chords.length;
		var chordNotes:number[]= this.chords[chordIterator].getNotes(); // get notes from mandatory and natural ones
		var nbNotes:number     = chordNotes.length;

		

		for(var itNote:number=0;itNote<nbNotes;itNote++){
			
			var note=chordNotes[itNote];
			var moduloVal:number;
			
			if(this.ascendingMelody){
				moduloVal=mod(note-lastNote,12);				
			}
			else{
				moduloVal=mod(lastNote-note,12);
			}

			if( lastNote === -1 ||  moduloVal  <= this.toneStep) {

				       
				var newGuidingLine=onGoingGuidingLine.slice();
				newGuidingLine.push(note);

				if(chordIterator === NbChords-1 ) /** we are on the last chord */
				{
					let key=this.getGuidingLineKey(newGuidingLine);
					let strength=this.getGuidingLineStrength(newGuidingLine);

					if(guidingLinesResult.has(strength)==false){
						guidingLinesResult.set(strength, new Map<number,number[][]>() );
					}
					if(guidingLinesResult.get(strength).has(key)==false){
						guidingLinesResult.get(strength).set(key,[] );
					}
					//debugger;
					guidingLinesResult.get(strength).get(key).push(newGuidingLine);  
					
					newGuidingLine=[];

				}
				else{  
					chordIterator++; 
					/**  RECURSION STARTS HERE */
					this.InnerFindDescendingLine(chordIterator,newGuidingLine,note,guidingLinesResult);
					chordIterator--;
				}

			}       

		}
		

	};



	/**
	*   complex algorithm:
	*	find all octaves possible of the guiding pitches
	*	according to each chord settings 
	*/
	findOctaves(descente:number[],chords:ChordModel[]):number[][]{

		var listePitch:number[][]=[];

		var beginningNote:number;	

		var oNoteList:{pitch:number,key:string,label:string}[]=OctavesNotes;


		let sortedStrings=Chordage.sort();
		let minGuitar=sortedStrings[0];
		let maxGuitar=sortedStrings[sortedStrings.length-1]+NB_FRETTES;


		const NoteList=oNoteList.filter(nl=> nl.pitch>=minGuitar && nl.pitch<=maxGuitar );
		  
		//si la mélodie descend beginningNote est la note la plus haute 
		// et on parcours les note de la plus aigue à la plus basse
		beginningNote=descente[0];
		if(this.ascendingMelody){
			//si la mélodie monte beginningNote est la note la plus basse 
			// et on parcours les notes de la plus basse à la plus aigue
			NoteList.reverse();
		}	
		
		
		var highestFirstNote:number=0;

		var nbChords:number=descente.length;		

		//debugger
		for(var firstNote=NoteList.length-1; firstNote >=0 ; firstNote--) {          
			if(beginningNote === mod(NoteList[firstNote].pitch,12) )
			{
				highestFirstNote=firstNote;
				//ATTENTION on doit avoir rentré deux accords minimum !!
				var nextIndice:number=1;
				var nextNote:number=descente[nextIndice];
				var pitches:number[]=[];
				pitches.push(NoteList[firstNote].pitch);

				// on doit partir de la première note possible
				//if(chords[0].possibleGuidingNote(NoteList[firstNote].pitch) == false) {
					//console.log("chords[0], pitch:"+NoteList[i].pitch+ "impossible")
				//	continue;
				//}
				//console.log("***********************BEGIN************************************************");
				//console.log(chords[0].getFullName()+" premier accord, "+NoteList[firstNote].label+ " possible");

				//tant que l'on est au dessus du pitch le plus bas
				for(var j=firstNote; j >=0; j--) {

					if(nextIndice === descente.length) 
						break;

					if(nextNote === mod(NoteList[j].pitch,12) )
					{
						//if(chords[nextIndice].possibleGuidingNote(NoteList[j].pitch) == false) {
						//	break;
						//}
						//console.log(chords[nextIndice].getFullName()+" "+(nextIndice+2)+"ème accord, "+NoteList[j].label+ " possible")
						pitches.push(NoteList[j].pitch); 

						while ( nextIndice < descente.length && nextNote === descente[nextIndice+1])
						{

							pitches.push(NoteList[j].pitch);                 
							nextNote=descente[nextIndice+1];
							nextIndice=nextIndice+1;

						} 
						nextIndice++;
						nextNote=descente[nextIndice];
						if(nextIndice === descente.length)
							break;

					}
				} 
				//y a t'il autant de notes que dans la ligne cliché?
				if( pitches.length==nbChords)
					listePitch.push(pitches);

				firstNote=highestFirstNote-11; //on passe à l'octave plus basse
			}

		}

		if(this.ascendingMelody){
			NoteList.reverse();
		}
		
		return listePitch;
	};




}


