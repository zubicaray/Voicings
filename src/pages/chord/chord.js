var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { ChordFamilyList, Keys, KeysId, OctavesNotes, ConfigurationProvider } from '../../providers/configuration/configuration';
import { LoadingCtrlPage } from '../loading-ctrl/loading-ctrl';
import { mod } from '../../providers/tools/tools';
var ChordPage = /** @class */ (function (_super) {
    __extends(ChordPage, _super);
    function ChordPage(navCtrl, navParams, loadingCtrl, toastCtrl, alertCtrl, configurationProvider) {
        var _this = _super.call(this, loadingCtrl) || this;
        _this.navCtrl = navCtrl;
        _this.navParams = navParams;
        _this.loadingCtrl = loadingCtrl;
        _this.toastCtrl = toastCtrl;
        _this.alertCtrl = alertCtrl;
        _this.configurationProvider = configurationProvider;
        _this.ChordFamilyList = ChordFamilyList;
        _this.Keys = Keys;
        _this.OctavesNotes = OctavesNotes;
        _this.mNoteOctaves = [];
        for (var i = 0; i < KeysId.length; i++) {
            _this.mNoteOctaves.push(_this.configurationProvider.Octaves(i));
        }
        if (navParams.get('chord') != undefined) {
            _this.chord = navParams.get('chord');
            _this.init();
        }
        else
            _this.ChordSettings = _this.ChordFamilyList[0].chords;
        return _this;
    }
    ChordPage.prototype.init = function () {
        if (this.chord.guidingPitch != 0) {
            this.guidingNoteOctave = ~~(this.chord.guidingPitch / 12) - 1;
            this.guidingNote = mod(this.chord.guidingPitch, 12);
            this.Octaves = this.mNoteOctaves[this.guidingNote];
        }
        else {
            this.Octaves = [];
        }
        this.ChordSettings = this.ChordFamilyList[this.chord.idFamily].chords;
    };
    ChordPage.prototype.updateChordNotes = function () {
        this.chord.init();
    };
    ChordPage.prototype.presentToast = function () {
        var toast = this.toastCtrl.create({
            message: 'Chords found !',
            duration: 1000,
            position: 'top'
        });
        toast.onDidDismiss(function () {
        });
        toast.present();
    };
    ChordPage.prototype.buildDiagrams = function (chord) {
        var _this = this;
        this.showLoader("finding guiding notes ...");
        setTimeout(function () {
            chord.findChordDiagrams();
            if (chord.diagrams.length == 0) {
                _this.alert();
            }
            else {
                _this.presentToast();
            }
        }, 100);
    };
    ChordPage.prototype.alert = function () {
        var alertPopup = this.alertCtrl.create({
            title: 'No chord found',
            cssClass: 'alertCustomCss',
            message: 'No chord found.',
            buttons: [
                {
                    text: 'Ok.',
                    handler: function () {
                    }
                }
            ]
        });
        // Show the alert
        alertPopup.present();
    };
    ChordPage.prototype.setGuidingPitchFromNote = function (i) {
        this.guidingNote = i;
        this.Octaves = this.mNoteOctaves[this.guidingNote];
        if (this.guidingNoteOctave > this.Octaves[this.Octaves.length - 1])
            this.guidingNoteOctave--;
        this.reinitChord();
    };
    ChordPage.prototype.setGuidingPitchFromOctave = function (i) {
        this.guidingNoteOctave = i;
        this.reinitChord();
    };
    ChordPage.prototype.reinitChord = function () {
        //debugger
        this.chord.guidingPitch = (this.guidingNoteOctave + 1) * 12 + this.guidingNote;
        this.chord.init();
    };
    ChordPage.prototype.setKey = function (i) {
        this.chord.keyid = i;
        this.chord.init();
    };
    ChordPage.prototype.setFamilyType = function (i) {
        this.chord.idFamily = i;
        this.chord.idtype = 0;
        this.chord.init();
        this.ChordSettings = this.ChordFamilyList[this.chord.idFamily].chords;
    };
    ChordPage.prototype.setType = function (i) {
        this.chord.idtype = i;
        this.chord.init();
    };
    ChordPage = __decorate([
        Component({
            selector: 'page-chord',
            templateUrl: 'chord.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams,
            LoadingController, ToastController, AlertController,
            ConfigurationProvider])
    ], ChordPage);
    return ChordPage;
}(LoadingCtrlPage));
export { ChordPage };
//# sourceMappingURL=chord.js.map