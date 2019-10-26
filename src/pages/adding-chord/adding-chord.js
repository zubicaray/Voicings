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
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { ChordModel } from '../../models/chordModel';
import { ChordPage } from '../chord/chord';
var AddingChordPage = /** @class */ (function (_super) {
    __extends(AddingChordPage, _super);
    function AddingChordPage(navCtrl, navParams, toastCtrl, loadingCtrl, alertCtrl) {
        var _this = _super.call(this, navCtrl, navParams, loadingCtrl, toastCtrl, alertCtrl) || this;
        _this.navCtrl = navCtrl;
        _this.navParams = navParams;
        _this.toastCtrl = toastCtrl;
        _this.loadingCtrl = loadingCtrl;
        _this.alertCtrl = alertCtrl;
        _this.chords = navParams.get('chords');
        _this.chord = ChordModel.new();
        _this.init();
        return _this;
    }
    AddingChordPage.prototype.presentToast = function () {
        var toast = this.toastCtrl.create({
            message: 'Chord has been added',
            duration: 400,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    AddingChordPage.prototype.add = function () {
        this.chords.push(this.chord);
        var idfam = this.chord.idFamily;
        var idtype = this.chord.idtype;
        var idKey = this.chord.keyid;
        this.chord = ChordModel.new();
        this.chord.idFamily = idfam;
        this.chord.idtype = idtype;
        this.chord.keyid = idKey;
        //debugger
        this.init();
        this.presentToast();
    };
    AddingChordPage = __decorate([
        Component({
            selector: 'page-adding-chord',
            templateUrl: 'adding-chord.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams,
            ToastController, LoadingController, AlertController])
    ], AddingChordPage);
    return AddingChordPage;
}(ChordPage));
export { AddingChordPage };
//# sourceMappingURL=adding-chord.js.map