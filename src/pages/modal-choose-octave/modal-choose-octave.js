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
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { ComputationProvider } from '../../providers/computations/computations';
import { OctavesNotes, OctavesOffset } from '../../providers/configuration/configuration';
/**
 * Generated class for the ModalChooseOctavePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ModalChooseOctavePage = /** @class */ (function () {
    function ModalChooseOctavePage(navCtrl, navParams, viewCtrl, computationProvider) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.computationProvider = computationProvider;
        this.chords = navParams.get('chords');
        this.pitches = navParams.get('pitches');
    }
    ModalChooseOctavePage.prototype.closeModal = function (pitches) {
        for (var i = 0; i < this.chords.length; i++) {
            //console.log(this.gChordList[i] )
            //debugger
            this.chords[i].guidingPitch = pitches[i];
        }
        this.viewCtrl.dismiss();
    };
    ModalChooseOctavePage.prototype.ionViewDidLoad = function () {
    };
    ModalChooseOctavePage.prototype.printOctaves = function (desc) {
        var highestNote = desc[desc.length - 1];
        var lowestNote = desc[0];
        if (highestNote == lowestNote) // cas pédale
         {
            return OctavesNotes[highestNote - OctavesOffset].label;
        }
        else {
            return OctavesNotes[lowestNote - OctavesOffset].label + ' -> ' + OctavesNotes[highestNote - OctavesOffset].label;
        }
    };
    ModalChooseOctavePage = __decorate([
        Component({
            selector: 'page-modal-choose-octave',
            templateUrl: 'modal-choose-octave.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams,
            ViewController,
            ComputationProvider])
    ], ModalChooseOctavePage);
    return ModalChooseOctavePage;
}());
export { ModalChooseOctavePage };
//# sourceMappingURL=modal-choose-octave.js.map