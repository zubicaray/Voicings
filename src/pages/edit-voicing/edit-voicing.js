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
import { NavController, reorderArray, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { ChordPage } from '../chord/chord';
import { GuidingLinePage } from '../guiding-line/guiding-line';
import { LoadingCtrlPage } from '../loading-ctrl/loading-ctrl';
import { AddingChordPage } from '../adding-chord/adding-chord';
import { DiagramsPage } from '../diagrams/diagrams';
import { GuitarConstraintsPage } from '../guitar-constraints/guitar-constraints';
var EditVoicingPage = /** @class */ (function (_super) {
    __extends(EditVoicingPage, _super);
    function EditVoicingPage(navCtrl, navParams, loadingCtrl, toastCtrl) {
        var _this = _super.call(this, loadingCtrl) || this;
        _this.navCtrl = navCtrl;
        _this.navParams = navParams;
        _this.loadingCtrl = loadingCtrl;
        _this.toastCtrl = toastCtrl;
        _this.showReOrder = false;
        _this.editView = true;
        var Voicings = navParams.get('songVoicings');
        _this.songName = Voicings.songName;
        _this.chords = Voicings.chords;
        _this.settings = Voicings.settings;
        return _this;
    }
    EditVoicingPage.prototype.changeView = function () {
        this.editView = !this.editView;
    };
    EditVoicingPage.prototype.presentToast = function (msg) {
        var toast = this.toastCtrl.create({
            message: msg,
            duration: 1000,
            position: 'top'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    EditVoicingPage.prototype.viewGuitarConstraints = function () {
        this.navCtrl.push(GuitarConstraintsPage, { songVoicings: this.chords, settings: this.settings });
    };
    EditVoicingPage.prototype.playVoicings = function () {
        if (this.chords.some(function (c) { return c.diagrams.length == 0; })) {
            this.presentToast("No diagram found for some chord.");
            return;
        }
        for (var i = 0; i < this.chords.length; i++) {
            this.chords[i].playArpege(i);
        }
    };
    EditVoicingPage.prototype.order = function () {
        console.log("click reorder");
        this.showReOrder = !this.showReOrder;
    };
    EditVoicingPage.prototype.reorderItems = function ($event) {
        reorderArray(this.chords, $event);
    };
    EditVoicingPage.prototype.removeItem = function (chord) {
        for (var i = 0; i < this.chords.length; i++) {
            if (this.chords[i] == chord) {
                this.chords.splice(i, 1);
            }
        }
    };
    EditVoicingPage.prototype.goRight = function (chord) {
        if (chord.diagrams.length == 0)
            return;
        if (chord.idDiag < chord.diagrams.length - 1) {
            chord.idDiag++;
            chord.canvas = chord.diagrams[chord.idDiag];
        }
        chord.play();
    };
    EditVoicingPage.prototype.goLeft = function (chord) {
        if (chord.diagrams.length == 0)
            return;
        if (chord.idDiag > 0) {
            chord.idDiag--;
            chord.canvas = chord.diagrams[chord.idDiag];
        }
        chord.play();
    };
    EditVoicingPage.prototype.generateVoicings = function () {
        var _this = this;
        this.showLoader("Search all possible chords ...");
        setTimeout(function () {
            for (var i = 0; i < _this.chords.length; i++) {
                _this.chords[i].findChordDiagrams();
            }
        }, 100);
        this.dismissLoader();
    };
    EditVoicingPage.prototype.ionViewDidLoad = function () {
    };
    EditVoicingPage.prototype.showDiagrams = function (chord) {
        var _this = this;
        this.showLoader("Opening chord ...");
        setTimeout(function () {
            _this.navCtrl.push(DiagramsPage, { chord: chord });
        }, 100);
    };
    EditVoicingPage.prototype.itemTapped = function (event, chord) {
        this.navCtrl.push(ChordPage, { chord: chord });
    };
    EditVoicingPage.prototype.add = function (event) {
        this.navCtrl.push(AddingChordPage, { chords: this.chords });
    };
    EditVoicingPage.prototype.openGuidingLineSetUp = function (event) {
        var _this = this;
        this.showLoader("Opening guiding line settings ...");
        setTimeout(function () {
            _this.navCtrl.push(GuidingLinePage, { songVoicings: _this.chords, settings: _this.settings });
            _this.dismissLoader();
        }, 100);
    };
    ;
    EditVoicingPage = __decorate([
        Component({
            selector: 'page-edit-voicing',
            templateUrl: 'edit-voicing.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, LoadingController, ToastController])
    ], EditVoicingPage);
    return EditVoicingPage;
}(LoadingCtrlPage));
export { EditVoicingPage };
//# sourceMappingURL=edit-voicing.js.map