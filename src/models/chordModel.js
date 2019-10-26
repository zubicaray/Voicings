import { NB_FRETTES, OctavesOffset, OctavesNotes, Chordage } from '../providers/configuration/configuration';
import { PolySynth, mod, clone } from '../providers/tools/tools';
export var GUIDING_NOTE_ON_TOP = 1;
export var GUIDING_NOTE_ON_BASS = 2;
export var GUIDING_NOTE_ANTWHERE = 3;
/**
* represent a chord, graphycally, harmonically and all its instances on the fretboard
 */
var ChordModel = /** @class */ (function () {
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
    function ChordModel(Id, keyid, idFamily, idtype, idDiag, idDiag_Y, diagrams, HasRoot, HasFifth, maxStretch, melodyType, guidingPitch, openStrings, stringDispo) {
        this.Id = Id;
        this.keyid = keyid;
        this.idFamily = idFamily;
        this.idtype = idtype;
        this.idDiag = idDiag;
        this.idDiag_Y = idDiag_Y;
        this.diagrams = diagrams;
        this.HasRoot = HasRoot;
        this.HasFifth = HasFifth;
        this.maxStretch = maxStretch;
        this.melodyType = melodyType;
        this.guidingPitch = guidingPitch;
        this.openStrings = openStrings;
        this.stringDispo = stringDispo;
        /** mandatory, as regard harmony, notes of the chord  */
        this.mandatory = [];
        /** all ok, as regard harmony, notes of the chord  */
        this.natural = [];
        /** all "sometimes not so good", as regard harmony, notes of the chord  */
        this.modern = [];
        this.pitch = 0;
        this.chordage = ChordModel.configurationProvider.getOrderedChordage();
        this.canvas = diagrams.length > 0 ? diagrams[idDiag] : undefined;
        this.maxStretch = maxStretch == null ? 4 : maxStretch;
        idDiag_Y = 0;
        this.init();
    }
    ChordModel.new = function () {
        return new ChordModel(1, 0, 0, 0, 0, 0, [], false, false, 5, 1, 0, true, [true, true, true, true, true, true]);
    };
    /**
  
    * given key and chord type, computes all notes possible
  
    */
    ChordModel.prototype.init = function () {
        delete this.mandatory;
        delete this.natural;
        delete this.modern;
        this.mandatory = [];
        this.natural = [];
        this.modern = [];
        if (this.keyid != null && this.getType() != null) {
            this.setModernNotes();
            this.setNaturalNotes();
            this.setMandatoryNotes();
        }
    };
    /**
    * tells if input pitch can belong to availables strings
    * and if there enough room for remainings mandatory notes
    */
    ChordModel.prototype.possibleGuidingNote = function (inGuidingPitch) {
        if (inGuidingPitch == 0) {
            this.errorMsg = "Guiding note unset.";
            return false;
        }
        //debugger;
        var stringsAvailable = [];
        for (var i = 0; i < this.stringDispo.length; i++) {
            if (this.stringDispo[i])
                stringsAvailable.push(Chordage[i]);
        }
        stringsAvailable.sort();
        var max = stringsAvailable[stringsAvailable.length - 1] + NB_FRETTES;
        var min = stringsAvailable[0];
        // l'accordage ne permet pas d'avoir la guiding note
        if (inGuidingPitch > max || inGuidingPitch < min) {
            //console.log("l'accordage ne permet pas d'avoir la guiding note");
            this.errorMsg = "Current chordage can't contain guiding note.";
            return false;
        }
        if (this.melodyType != GUIDING_NOTE_ANTWHERE) {
            var stopFret = this.openStrings ? 0 : 1;
            /** on cherche la note sur la corde la plus aigue pour avoir le plus de cordes de libre
            * pour le reste des notes obligatoires
            */
            if (this.melodyType == GUIDING_NOTE_ON_TOP) {
                stringsAvailable.reverse();
                var stringNumber = void 0, k = void 0;
                var stopFret_1 = this.openStrings ? 0 : 1;
                var broke = false;
                for (stringNumber = 0; stringNumber < stringsAvailable.length; stringNumber++) {
                    for (k = NB_FRETTES; k >= stopFret_1; k--) {
                        if ((stringsAvailable[stringNumber] + k) == inGuidingPitch) {
                            broke = true;
                            break;
                        }
                    }
                    if (broke)
                        break;
                }
                // nombre de notes obligatoire
                var nbOblig = this.mandatory.length;
                // si la guiding note fait partie de notes oblig on 
                if (this.mandatory.some(function (n) { return mod(inGuidingPitch, 12) == n; }))
                    nbOblig--;
                // nombre maximales de chordes sur lesquelles mettre es notes obligatoire
                var leftString = stringsAvailable.length - (stringNumber + 1);
                // il faut aussi qu'on ait au moins trois notes => leftString>1
                if (leftString < nbOblig || leftString < 2) {
                    //console.log("l'accordage ne permet pas d'avoir la guiding note.leftString="+leftString+" noteoblig:"+nbOblig);
                    this.errorMsg = "Not enough available strings.";
                    return false;
                }
            }
            if (this.melodyType == GUIDING_NOTE_ON_BASS) {
                var stringNumber = void 0, k = void 0;
                var broke = false;
                for (stringNumber = 0; stringNumber < stringsAvailable.length; stringNumber++) {
                    for (k = stopFret; k <= NB_FRETTES; k++) {
                        if ((stringsAvailable[stringNumber] + k) == inGuidingPitch) {
                            broke = true;
                            break;
                        }
                    }
                    if (broke)
                        break;
                }
                // nombre de notes obligatoire
                var nbOblig = this.mandatory.length;
                // si la guiding note fait partie de notes oblig on 
                if (this.mandatory.some(function (n) { return mod(inGuidingPitch, 12) == n; }))
                    nbOblig--;
                // nombre maximales de chordes sur lesquelles mettre es notes obligatoire
                var leftString = stringsAvailable.length - (stringNumber + 1);
                // il faut aussi qu'on ait au moins trois notes => leftString>1
                if (leftString < nbOblig || leftString < 2) {
                    //console.log("l'accordage ne permet pas d'avoir la guiding note.leftString="+leftString+" noteoblig:"+nbOblig);
                    this.errorMsg = "Not enough available strings.";
                    return false;
                }
            }
        }
        return true;
    };
    /**
    * @ignore
    */
    ChordModel.prototype.toMidiNotes = function () {
        var notes = [];
        for (var i = this.canvas.notes.length - 1; i >= 0; i--) {
            var pitch = this.canvas.notes[i].pitch;
            notes.push(OctavesNotes[pitch - OctavesOffset].label);
        }
        return notes;
    };
    /**
    * @ignore
    */
    ChordModel.prototype.play = function (delay) {
        if (delay === void 0) { delay = 0; }
        //play a chord
        PolySynth.triggerAttackRelease(this.toMidiNotes(), "3n", "+" + delay);
    };
    /**
    * @ignore
    */
    ChordModel.prototype.playArpege = function (delay) {
        if (delay === void 0) { delay = 0; }
        var notes = [];
        var size = this.canvas.notes.length;
        for (var i = 0; i < size; i++) {
            var pitch = this.canvas.notes[i].pitch;
            notes.push(OctavesNotes[pitch - OctavesOffset].label);
            //synth.triggerAttackRelease(notes[i], "8n");
            PolySynth.triggerAttackRelease(notes[i], "4n", "+" + (0.115 * (size - i - 1) + delay));
        }
    };
    /**
    * @ignore
    */
    ChordModel.prototype.printGuidingPitch = function () {
        if (this.guidingPitch == undefined || this.guidingPitch < OctavesOffset)
            return 'unset';
        else
            return OctavesNotes[this.guidingPitch - OctavesOffset].label;
    };
    /**
      * @ignore
      */
    ChordModel.prototype.getNotes = function () {
        return this.mandatory.concat(this.natural);
    };
    /**
    * @ignore
    */
    ChordModel.prototype.getType = function () {
        return this.configurationProvider.getType(this.idFamily, this.idtype);
    };
    /**
    * @ignore
    */
    ChordModel.prototype.getSharp = function () {
        if (OctavesNotes[this.keyid].sharp)
            return "#";
        else
            return "";
    };
    /**
    * @ignore
    */
    ChordModel.prototype.getKey = function () {
        return OctavesNotes[this.keyid].key;
    };
    /**
    * @ignore
    */
    ChordModel.prototype.IsNoFifth = function (element) {
        return element != 7;
    };
    /**
    * @ignore
    */
    ChordModel.prototype.IsNoRoot = function (element) {
        return element != 0;
    };
    /**
    * @ignore
    */
    ChordModel.prototype.setMandatoryNotes = function () {
        // notes "relatives" obligatoires
        var mandatories = this.getType().mandatory;
        if (this.HasRoot)
            this.mandatory.push(this.keyid);
        if (this.HasFifth)
            this.mandatory.push((this.keyid + 7) % 12);
        //conversion en notees absolues
        for (var i = 0; i < mandatories.length; i++) {
            this.mandatory.push((this.keyid + mandatories[i]) % 12);
        }
    };
    /**
    * @ignore
    */
    ChordModel.prototype.setNaturalNotes = function () {
        var naturals;
        if (this.HasFifth) // fifth is already in the mandatory notes
            naturals = this.getType().natural.filter(this.IsNoFifth);
        else
            naturals = this.getType().natural;
        if (this.HasRoot) // root is already in the mandatory notes)
            naturals = naturals.filter(this.IsNoRoot);
        for (var i = 0; i < naturals.length; i++) {
            this.natural.push((this.keyid + naturals[i]) % 12);
        }
    };
    /**
    * @ignore
    */
    ChordModel.prototype.setModernNotes = function () {
        var moderns;
        if (this.HasFifth) // fifth is already in the mandatory notes
            moderns = this.getType().modern.filter(this.IsNoFifth);
        else
            moderns = this.getType().modern;
        if (this.HasRoot) // root is already in the mandatory notes)
            moderns = moderns.filter(this.IsNoRoot);
        for (var i = 0; i < moderns.length; i++) {
            this.modern.push((this.keyid + moderns[i]) % 12);
        }
    };
    ChordModel.newEmptyDiagram = function () {
        var currentDiag = {
            guidingString: -1,
            frets: [null, null, null, null, null, null],
            stretch: 0,
            notes: []
        };
        return currentDiag;
    };
    /**
    * remove diagrams if a new guiding note has been set
    */
    ChordModel.prototype.checkPossible = function () {
        if (this.possibleGuidingNote(this.guidingPitch) == false) {
            delete this.diagrams;
            this.idDiag = 0;
            this.canvas = undefined;
        }
    };
    /**
    * find chord diagrams
    */
    ChordModel.prototype.findChordDiagrams = function () {
        delete this.diagrams;
        //deep copy of chord note list
        var mandatories = Array.from(this.mandatory);
        var res = [];
        if (this.possibleGuidingNote(this.guidingPitch) == true) {
            this.innerFindChorDiagrams(mandatories, this.getNotes(), 0, ChordModel.newEmptyDiagram(), res);
            res.sort(function (a, b) { return b.notes.length - a.notes.length; });
        }
        this.diagrams = res;
        this.idDiag = 0;
        this.canvas = this.diagrams[0];
    };
    /**
    * @ignore
    */
    ChordModel.prototype.getPitch = function (itString, itFrette) {
        return this.chordage[itString].pitch + itFrette;
    };
    /**
    * @ignore
    */
    ChordModel.prototype.getNote = function (itString, itFrette) {
        return mod(this.getPitch(itString, itFrette) - OctavesOffset, 12);
    };
    /**
    * @ignore
    */
    ChordModel.prototype.getStringLeft = function (itString) {
        var res = 0;
        for (var i = itString; i < this.chordage.length; i++) {
            if (this.stringDispo[this.chordage[itString].Id])
                res++;
        }
        return res;
    };
    /**
    * Tells if diagrams seeking  has to stop
    */
    ChordModel.prototype.hasToStop = function (currentDiag, itString, mandatory, currentPitch) {
        if (currentDiag.guidingString == -1 && this.guidingPitch > currentPitch) {
            // comme les cordes suivantes sont encore plus graves
            // on ne pourra plus trouver la guiding note
            return true;
        }
        if (this.getStringLeft(itString) < mandatory.length) {
            //plus assez de corde pour avoir toutes les notes obligatoires
            return true;
        }
        return false;
    };
    /**
     * checks if minor chord has the two seventh
     */
    ChordModel.prototype.willHaveBothSeventh = function (currentNote, currentDiag) {
        var _this = this;
        var isMajorSeventh = mod(currentNote - this.keyid, 12) == 11;
        var isMinorSeventh = mod(currentNote - this.keyid, 12) == 10;
        //check i
        var hasMajorSeventh = currentDiag.notes.some(function (e) { return mod(e.note - _this.keyid, 12) == 11; });
        var hasMinorSeventh = currentDiag.notes.some(function (e) { return mod(e.note - _this.keyid, 12) == 10; });
        if ((isMajorSeventh && hasMinorSeventh) || (isMinorSeventh && hasMajorSeventh))
            return true;
        else
            return false;
    };
    /**
   * checks if the stretch is not too high
   */
    ChordModel.prototype.ecartOk = function (currentDiag, itFrette) {
        var ecart = 0;
        if (itFrette == 0)
            return true;
        for (var i = 0; i < currentDiag.frets.length; i++) {
            if (currentDiag.frets[i] == null || currentDiag.frets[i] == 0)
                continue;
            ecart = Math.abs(currentDiag.frets[i] - itFrette);
            if (ecart > this.maxStretch) {
                return false;
            }
            else {
                if (ecart > currentDiag.stretch) {
                    currentDiag.stretch = ecart;
                }
            }
        }
        return true;
    };
    /**
    * inner recursive function
    *
    * @param { Array<number>}    mandatory remaing mandatory notes
    * @param { Array<number>}    possible remaing  notes
    * @param { number}           itString  index of the string where where find notes
    * @param { DiagramType}    on going diagram
    * @param { DiagramType[] }  Map result
    
    */
    ChordModel.prototype.innerFindChorDiagrams = function (mandatory, possible, itString, currentDiag, result) {
        var startfrette = this.openStrings ? 0 : 1;
        if (this.stringDispo[this.chordage[itString].Id]) {
            // on va toujours dans le sens aigue-> grave
            for (var itFrette = NB_FRETTES; itFrette >= startfrette; itFrette--) {
                if (!this.ecartOk(currentDiag, itFrette))
                    continue;
                var currentPitch = this.getPitch(itString, itFrette);
                if (this.hasToStop(currentDiag, itString, mandatory, currentPitch))
                    break;
                var currentNote = this.getNote(itString, itFrette);
                var indexM = mandatory.indexOf(currentNote);
                var indexP = possible.indexOf(currentNote);
                var newMandatory = Array.from(mandatory);
                var newPossible = Array.from(possible);
                var copyIt = itString + 1;
                if (indexM != -1) {
                    /** on n'a plus besoin de trouver cette note obligatoire */
                    newMandatory.splice(indexM, 1);
                }
                if (indexP != -1) {
                    /** on n'a plus besoin de trouver cette note obligatoire */
                    newPossible.splice(indexP, 1);
                }
                if (indexP != -1 && this.willHaveBothSeventh(currentNote, currentDiag))
                    continue;
                if (indexM > -1 || indexP > -1) // la note peut faire partie de l'accord en construction
                 {
                    if (this.melodyType == GUIDING_NOTE_ON_TOP && currentPitch != this.guidingPitch && currentDiag.notes.length == 0) {
                        // comme le parcours se fait du plus aigue vers le plus grave
                        // la première note doit-être la guiding note 
                        continue;
                    }
                    var clonedDiag = clone(currentDiag);
                    clonedDiag.frets[this.chordage[itString].Id] = itFrette;
                    clonedDiag.notes.push({ note: currentNote, pitch: currentPitch });
                    if (currentPitch == this.guidingPitch) {
                        clonedDiag.guidingString = this.chordage[itString].Id;
                    }
                    if (newMandatory.length == 0 && clonedDiag.guidingString > -1 && clonedDiag.notes.length > 2) {
                        //toutes les notes obligatoires sont là et la guiding note aussi
                        //-> on ajoute l'accord en cours
                        // todo: set lowest and highest note
                        result.push(clonedDiag);
                    }
                    if (this.melodyType == GUIDING_NOTE_ON_BASS && currentPitch == this.guidingPitch) {
                        // comme le parcours se fait du plus aigue vers le plus grave
                        // si on vient d'ajouter la guiding, elle devra rester la note la lus grave 
                        break;
                    }
                    if (copyIt < this.chordage.length) {
                        // que l'accord en cours fut ajouté à "result" ou pas
                        // on continue de construire l'accord où vient d'être ajouté "currentNote"
                        this.innerFindChorDiagrams(newMandatory, newPossible, copyIt, clonedDiag, result);
                    }
                }
            }
        }
        // parcours des cordes triées dans l'ordre décroissant de leur hauteur à vide, ie dans le sens aigue-> grave 
        itString++;
        if (itString < this.chordage.length)
            this.innerFindChorDiagrams(mandatory, possible, itString, currentDiag, result);
    };
    return ChordModel;
}());
export { ChordModel };
//# sourceMappingURL=chordModel.js.map