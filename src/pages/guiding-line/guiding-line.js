var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Component } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { ComputationProvider } from '../../providers/computations/computations';
import { printNotes, Keys } from '../../providers/configuration/configuration';
import { ModalChooseOctavePage } from '../modal-choose-octave/modal-choose-octave';
/**
* component from choosing the desired guiding line

*/
var GuidingLinePage = /** @class */ (function () {
    function GuidingLinePage(navCtrl, navParams, modalCtrl, computationProvider, alertCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this.computationProvider = computationProvider;
        this.alertCtrl = alertCtrl;
        this.shownGroupStrength = null;
        this.shownGroupKey = null;
        this.chords = navParams.get('songVoicings');
        this.settings = navParams.get('settings');
        computationProvider.setMaxToneStep(this.settings.maxToneStep);
        computationProvider.setAscendingMelody(this.settings.ascendingMelody);
        computationProvider.setToneStep(this.settings.toneStep);
        this.DescendingLines = computationProvider.findDescendingLine(this.chords);
        //trie par ordre décroissant
        this.StrengthKeys = Array.from(this.DescendingLines.keys()).sort(function (a, b) { return b - a; });
        if (this.settings.guidingLine == undefined)
            this.settings.guidingLine = { IdStrength: -1, IdKey: -1, IdLine: -1 };
        if (this.settings.guidingLine.IdStrength != -1 && this.settings.guidingLine.IdKey != -1 && this.settings.guidingLine.IdLine != -1) {
            //this.shownGroup=this.settings.guidingLine.IdKey;
            this.shownGroupStrength = this.settings.guidingLine.IdStrength;
            this.shownGroupKey = this.settings.guidingLine.IdKey;
        }
    }
    /**
      * @ignore
    */
    GuidingLinePage.prototype.toggleGroupStrengthKey = function (group) {
        //console.log("groupe:"+this.shownGroup + " key:="+group)
        if (this.isGroupKeyShown(group)) {
            this.shownGroupKey = null;
        }
        else {
            this.shownGroupKey = group;
        }
    };
    ;
    /**
      * @ignore
    */
    GuidingLinePage.prototype.isGroupKeyShown = function (group) {
        return this.shownGroupKey === group;
    };
    ;
    /**
      * @ignore
    */
    GuidingLinePage.prototype.printNotes = function (inNotes) {
        return printNotes(inNotes);
    };
    ;
    /**
      * @ignore
    */
    GuidingLinePage.prototype.toggleGroupStrength = function (group) {
        if (this.isGroupStrengthShown(group)) {
            this.shownGroupStrength = null;
        }
        else {
            this.shownGroupStrength = group;
        }
        this.shownGroupKey = null;
    };
    ;
    /**
      * @ignore
    */
    GuidingLinePage.prototype.isGroupStrengthShown = function (group) {
        return this.shownGroupStrength === group;
    };
    ;
    /**
      * @ignore
    */
    GuidingLinePage.prototype.pad2 = function (number) {
        return (number < 10 ? '0' : '') + number;
    };
    /**
      * prints first and last notes of guiding line
      * based on the keys of th emap
    */
    GuidingLinePage.prototype.printKey = function (key) {
        return Keys[~~(key / 1000)] + " -> " + Keys[key % 1000];
    };
    /**
      * allows to return keys list from a map
      * which can't be done in a ngFor
    */
    GuidingLinePage.prototype.getKeys = function (map) {
        var res = Array.from(map.keys());
        res.sort(function (a, b) { return a - b; });
        return res;
    };
    GuidingLinePage.prototype.printNote = function (key) {
        return Keys[key];
    };
    /**
    * set strentgh key , firsAndLast key , and line key indexes
    * and open modal window so as to propose all possible octaves, or pitches list, for given guiding notes
     * @param { number[]} guidingNotes note key list
     * @param { number }  strengthKeyIndex index of the strengh key in the map DescendingLines {GuidingLineStrengthMap}
     * @param { number }  firstAndLastKeyIndex index of the key  of the map that stores lines with the same first and last guidng notes
     * @param { number }  lineIndex  index of the chosen line
     */
    GuidingLinePage.prototype.openModal = function (guidingNotes, strengthKeyIndex, firstAndLastKeyIndex, lineIndex) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //console.log(`${i} ${j} ${k}`); 
                        this.settings.guidingLine.IdStrength = strengthKeyIndex;
                        this.settings.guidingLine.IdKey = firstAndLastKeyIndex;
                        this.settings.guidingLine.IdLine = lineIndex;
                        return [4 /*yield*/, this.presentModal(guidingNotes)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
      * @ignore
    */
    GuidingLinePage.prototype.presentModal = function (notes) {
        var data = { pitches: this.computationProvider.findOctaves(notes, this.chords), chords: this.chords };
        var modalPage = this.modalCtrl.create(ModalChooseOctavePage, data, { enableBackdropDismiss: false });
        return modalPage.present();
    };
    /**
      * Recomputes all possible guiding lines if one parameter has been changed
      * ids for strentgh, firsAndLastKey, and line are reset
    */
    GuidingLinePage.prototype.setDescente = function () {
        var _this = this;
        delete this.DescendingLines;
        delete this.StrengthKeys;
        this.computationProvider.setToneStep(this.settings.toneStep);
        this.computationProvider.setAscendingMelody(this.settings.ascendingMelody);
        this.DescendingLines = this.computationProvider.findDescendingLine(this.chords);
        this.StrengthKeys = Array.from(this.DescendingLines.keys()).sort(function (a, b) { return b - a; });
        this.chords.forEach(function (c) { c.melodyType = _this.settings.melodyType; });
        this.settings.guidingLine.IdKey = -1;
        this.shownGroupStrength = -1;
        this.settings.guidingLine.IdLine = -1;
        this.chords.forEach(function (c) { c.guidingPitch = 0; });
    };
    /**
      * @ignore
    */
    GuidingLinePage.prototype.save = function () {
        var _this = this;
        this.chords.forEach(function (c) { c.melodyType = _this.settings.melodyType; });
    };
    /**
    * warns the user if a chord has not its guiding note set
    */
    GuidingLinePage.prototype.ionViewCanLeave = function () {
        return __awaiter(this, void 0, void 0, function () {
            var shouldLeave;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.save();
                        if (!this.chords.some(function (c) { return c.guidingPitch == 0; }))
                            return [2 /*return*/, true];
                        return [4 /*yield*/, this.confirmLeave()];
                    case 1:
                        shouldLeave = _a.sent();
                        return [2 /*return*/, shouldLeave];
                }
            });
        });
    };
    /**
      * @ignore
    */
    GuidingLinePage.prototype.confirmLeave = function () {
        var resolveLeaving;
        var canLeave = new Promise(function (resolve) { return resolveLeaving = resolve; });
        var alert = this.alertCtrl.create({
            title: 'No guiding line selected.',
            cssClass: 'alertCustomCss',
            message: 'Do you want to leave the page?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: function () { return resolveLeaving(false); }
                },
                {
                    text: 'Yes',
                    handler: function () { return resolveLeaving(true); }
                }
            ]
        });
        alert.present();
        return canLeave;
    };
    GuidingLinePage = __decorate([
        Component({
            selector: 'page-guiding-line',
            templateUrl: 'guiding-line.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams,
            ModalController,
            ComputationProvider, AlertController])
    ], GuidingLinePage);
    return GuidingLinePage;
}());
export { GuidingLinePage };
//# sourceMappingURL=guiding-line.js.map