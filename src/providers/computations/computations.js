var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { OctavesNotes, Chordage, NB_FRETTES } from '../../providers/configuration/configuration';
import { mod } from '../../providers/tools/tools';
/**
    * ComputationProvider class contains all needed for computing
    * guiding lines
*/
var ComputationProvider = /** @class */ (function () {
    /**
    *@ignore
    */
    function ComputationProvider() {
    }
    /**
    *@ignore
    */
    ComputationProvider.prototype.setChords = function (inChords) {
        this.chords = inChords;
    };
    /**
    *@ignore
    */
    ComputationProvider.prototype.setMaxToneStep = function (s) {
        this.maxToneStep = s;
    };
    /**
    *@ignore
    */
    ComputationProvider.prototype.setAscendingMelody = function (b) {
        this.ascendingMelody = b;
    };
    /**
    *@ignore
    */
    ComputationProvider.prototype.setToneStep = function (s) {
        this.toneStep = s;
    };
    /*
        maxEcart(tab:number[]):number{
            var max:number=0;
            var temp:number;
            for(var i:number =0;i<tab.length-1;i++)
            {
    
                if(this.ascendingMelody){
                    temp =mod(tab[i+1]-tab[i], 12);
                }
                else{
    
                    temp =mod(tab[i]-tab[i+1], 12);
                }
                
                if(temp>max) max=temp;
    
            }
            return max;
        };
    */
    /**
    * computes all guiding lines given all chords possible notes
    *
     * @param { ChordModel[]} inChords  Set of chords
     * @returns {GuidingLineStrengthMap} Guiding Lines
     */
    ComputationProvider.prototype.findDescendingLine = function (inChords) {
        this.setChords(inChords);
        var res = new Map();
        this.InnerFindDescendingLine(0, [], -1, res);
        return res;
    };
    ComputationProvider.prototype.getGuidingLineStrength = function (guidingLine) {
        return new Set(guidingLine).size;
    };
    ;
    /**
    * computes key for GuidingLineMap  with this formula:
    *
    * guidingLine[0] * 1000 + guidingLine[guidingLine.length - 1];
    *
     * @param { number[] } guiding notes for a given set of chords
     * @returns {number } key of all guiding lines having the same first and last notes
     */
    ComputationProvider.prototype.getGuidingLineKey = function (guidingLine) {
        return guidingLine[0] * 1000 + guidingLine[guidingLine.length - 1];
    };
    /**
    * inner recursive function
    *
    
    * @param { number }  chordIterator  index of the chord among the set
    * @param { number[] }  onGoingGuidingLine the guiding line that's being built
    * @param { number }  lastNote  last note of onGoingGuidingLine
    * @param { GuidingLineStrengthMap }  Map result
    
    */
    ComputationProvider.prototype.InnerFindDescendingLine = function (chordIterator, onGoingGuidingLine, lastNote, guidingLinesResult) {
        //debugger;	
        var NbChords = this.chords.length;
        var chordNotes = this.chords[chordIterator].getNotes(); // get notes from mandatory and natural ones
        var nbNotes = chordNotes.length;
        var nbNotesOk = 0;
        for (var itNote = 0; itNote < nbNotes; itNote++) {
            var note = chordNotes[itNote];
            var moduloVal;
            if (this.ascendingMelody) {
                moduloVal = mod(note - lastNote, 12);
            }
            else {
                moduloVal = mod(lastNote - note, 12);
            }
            if (lastNote === -1 || moduloVal <= this.toneStep) {
                nbNotesOk++;
                var newGuidingLine = onGoingGuidingLine.slice();
                newGuidingLine.push(note);
                if (chordIterator === NbChords - 1) /** we are on the last chord */ {
                    var key = this.getGuidingLineKey(newGuidingLine);
                    var strength = this.getGuidingLineStrength(newGuidingLine);
                    if (guidingLinesResult.has(strength) == false) {
                        guidingLinesResult.set(strength, new Map());
                    }
                    if (guidingLinesResult.get(strength).has(key) == false) {
                        guidingLinesResult.get(strength).set(key, []);
                    }
                    //debugger;
                    guidingLinesResult.get(strength).get(key).push(newGuidingLine);
                    newGuidingLine = [];
                }
                else {
                    chordIterator++;
                    /**  RECURSION STARTS HERE */
                    this.InnerFindDescendingLine(chordIterator, newGuidingLine, note, guidingLinesResult);
                    chordIterator--;
                }
            }
        }
        nbNotesOk = 0;
    };
    ;
    /**
    *
    *	find all octaves possible of the guiding pitches
    *	according to each chord settings
    */
    ComputationProvider.prototype.findOctaves = function (descente, chords) {
        var listePitch = [];
        var highestNote;
        var lowestNote;
        var NoteList = OctavesNotes;
        if (this.ascendingMelody) {
            NoteList.reverse();
        }
        highestNote = descente[0];
        lowestNote = descente[descente.length - 1];
        var h = 0;
        var nbChords = descente.length;
        var sortedStrings = Chordage.sort();
        var maxGuitar = sortedStrings[sortedStrings.length - 1] + NB_FRETTES;
        var minGuitar = sortedStrings[0];
        //debugger
        for (var i = NoteList.length - 1; i >= 0; i--) {
            if (highestNote === mod(NoteList[i].pitch, 12)) {
                h = i;
                //ATTENTION on doit avoir rentré deux accords minimum !!
                var nextIndice = 1;
                var nextNote = descente[nextIndice];
                var pitches = [];
                pitches.push(NoteList[i].pitch);
                if (chords[0].possibleGuidingNote(NoteList[i].pitch) == false) {
                    //console.log("chords[0], pitch:"+NoteList[i].pitch+ "impossible")
                    continue;
                }
                //tant que l'on est au dessus du pitch le plus bas
                for (var j = i; j >= 0; j--) {
                    if (nextIndice === descente.length)
                        break;
                    if (nextNote === mod(NoteList[j].pitch, 12)) {
                        if (chords[nextIndice].possibleGuidingNote(NoteList[j].pitch) == false) {
                            break;
                        }
                        pitches.push(NoteList[j].pitch);
                        while (nextIndice < descente.length && nextNote === descente[nextIndice + 1]) {
                            pitches.push(NoteList[j].pitch);
                            nextNote = descente[nextIndice + 1];
                            nextIndice = nextIndice + 1;
                        }
                        nextIndice = nextIndice + 1;
                        nextNote = descente[nextIndice];
                        if (nextIndice === descente.length)
                            break;
                    }
                }
                //y a t'il autant de notes que dans la ligne cliché?
                if (pitches.length == nbChords)
                    listePitch.push(pitches);
                i = h - 11; //on passe à l'octave plus basse
            }
        }
        if (this.ascendingMelody) {
            NoteList.reverse();
        }
        return listePitch;
    };
    ;
    ComputationProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], ComputationProvider);
    return ComputationProvider;
}());
export { ComputationProvider };
//# sourceMappingURL=computations.js.map