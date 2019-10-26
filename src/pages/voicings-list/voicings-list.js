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
import { NavController, AlertController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { ChordModel } from '../../models/chordModel';
import { EditVoicingPage } from '../edit-voicing/edit-voicing';
import { DEFAULT_SETTINGS, Djangologie, ThereWill } from '../../providers/configuration/configuration';
import { Storage } from '@ionic/storage';
import { LoadingCtrlPage } from '../loading-ctrl/loading-ctrl';
import { AddingChordPage } from '../adding-chord/adding-chord';
import { File } from '@ionic-native/file';
import { HTTP } from '@ionic-native/http';
import * as cloneDeep from 'lodash/cloneDeep';
var VoicingsListPage = /** @class */ (function (_super) {
    __extends(VoicingsListPage, _super);
    function VoicingsListPage(alertCtrl, file, http, modalCtrl, navCtrl, navParams, storage, toastCtrl, loadingCtrl) {
        var _this = _super.call(this, loadingCtrl) || this;
        _this.alertCtrl = alertCtrl;
        _this.file = file;
        _this.http = http;
        _this.modalCtrl = modalCtrl;
        _this.navCtrl = navCtrl;
        _this.navParams = navParams;
        _this.storage = storage;
        _this.toastCtrl = toastCtrl;
        _this.loadingCtrl = loadingCtrl;
        _this.showLoader("Loading ...");
        setTimeout(function () {
            _this.load();
        }, 200);
        return _this;
    }
    VoicingsListPage_1 = VoicingsListPage;
    VoicingsListPage.fromJSON = function (inSong) {
        var song;
        inSong.chords.forEach(function (element) {
            song =
                { songName: inSong.songName, chords: [], settings: inSong.settings };
            inSong.chords.forEach(function (element) {
                var chord = new ChordModel(element.Id, element.keyid, element.idFamily, element.idtype, element.idDiag, element.idDiag_Y, element.diagrams, element.HasRoot, element.HasFifth, element.maxStretch, 1, element.guidingPitch, element.openStrings, element.stringDispo);
                song.chords.push(chord);
            });
        });
        return song;
    };
    VoicingsListPage.prototype.load = function () {
        var _this = this;
        //debugger
        //this.storage.clear();
        this.storage.length().then(function (result) {
            if (result == 0) {
                _this.VoicingsList = [VoicingsListPage_1.fromJSON(Djangologie()), VoicingsListPage_1.fromJSON(ThereWill())];
            }
            else {
                var lVL = [];
                _this.storage.forEach(function (songList) {
                    songList.forEach(function (songRes) {
                        var song = { songName: songRes.songName, chords: [], settings: songRes.settings };
                        songRes.chords.forEach(function (element) {
                            var chord = new ChordModel(element.Id, element.keyid, element.idFamily, element.idtype, element.idDiag, element.idDiag_Y, element.diagrams, element.HasRoot, element.HasFifth, element.maxStretch, element.melodyType, element.guidingPitch, element.openStrings, element.stringDispo);
                            song.chords.push(chord);
                        });
                        //console.log(JSON.stringify(song))
                        lVL.push(song);
                    });
                    lVL.sort(function (a, b) { return a.songName < b.songName ? -1 : 1; });
                });
                _this.VoicingsList = lVL;
            }
        });
    };
    VoicingsListPage.prototype.ionViewDidEnter = function () { };
    VoicingsListPage.prototype.save = function () {
        var _this = this;
        this.showLoader("Saving voicings list ...");
        setTimeout(function () {
            _this.storage.set("VoicingsList", _this.VoicingsList);
        }, 100);
    };
    VoicingsListPage.prototype.setGuidingLine = function (line, chords) {
        for (var i in line) {
            chords[i].guidingPitch = line[i];
        }
    };
    VoicingsListPage.prototype.newSong = function () {
        var _this = this;
        var newSong;
        var alert = this.alertCtrl.create({
            title: 'New song',
            cssClass: 'alertCustomCss',
            inputs: [
                {
                    name: 'Name',
                    placeholder: 'Name'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function (data) {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'New',
                    handler: function (data) {
                        var newSong = { songName: "", chords: [], settings: DEFAULT_SETTINGS };
                        if (_this.validation(data.Name, newSong)) {
                            _this.navCtrl.push(EditVoicingPage, {
                                songVoicings: newSong
                            });
                            _this.navCtrl.push(AddingChordPage, { chords: newSong.chords });
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    VoicingsListPage.prototype.presentToast = function (msg) {
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
    VoicingsListPage.prototype.validation = function (inVal, songClone, rename) {
        if (rename === void 0) { rename = false; }
        if (inVal == '') {
            this.presentToast('Name is  empty!');
            return false;
        }
        else {
            if (this.VoicingsList.every(function (s) { return s.songName != inVal; }) == false) {
                inVal = "";
                this.presentToast('Song name already exists !');
                return false;
            }
            else {
                songClone.songName = inVal;
                if (!rename)
                    this.VoicingsList.push(songClone);
                return true;
            }
        }
    };
    VoicingsListPage.prototype.presentCopyPrompt = function (song) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Copy song',
            cssClass: 'alertCustomCss',
            inputs: [
                {
                    name: 'Name',
                    placeholder: 'Name',
                    value: song.songName
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function (data) {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Copy',
                    handler: function (data) {
                        var clonedSong = cloneDeep(song);
                        return _this.validation(data.Name, clonedSong);
                    }
                }
            ]
        });
        alert.present();
    };
    VoicingsListPage.prototype.rename = function (song) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Rename song',
            cssClass: 'alertCustomCss',
            inputs: [
                {
                    name: 'Name',
                    placeholder: 'Name',
                    value: song.songName
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function (data) {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Rename',
                    handler: function (data) {
                        return _this.validation(data.Name, song, true);
                    }
                }
            ]
        });
        alert.present();
    };
    VoicingsListPage.prototype.remove = function (chords) {
        var _this = this;
        var alertPopup = this.alertCtrl.create({
            title: 'Remove',
            cssClass: 'alertCustomCss',
            message: 'Are you really sure? This can\'t be undone.',
            buttons: [{
                    text: 'Yes',
                    handler: function () {
                        for (var i = 0; i < _this.VoicingsList.length; i++) {
                            if (_this.VoicingsList[i] == chords) {
                                _this.VoicingsList.splice(i, 1);
                            }
                        }
                    }
                },
                {
                    text: 'No',
                    handler: function () {
                    }
                }]
        });
        // Show the alert
        alertPopup.present();
    };
    VoicingsListPage.prototype.itemTapped = function (songVoicings) {
        this.navCtrl.push(EditVoicingPage, {
            songVoicings: songVoicings
        });
    };
    var VoicingsListPage_1;
    VoicingsListPage = VoicingsListPage_1 = __decorate([
        Component({
            selector: 'page-voicings-list',
            templateUrl: 'voicings-list.html',
        }),
        __metadata("design:paramtypes", [AlertController, File, HTTP,
            ModalController,
            NavController, NavParams, Storage, ToastController,
            LoadingController])
    ], VoicingsListPage);
    return VoicingsListPage;
}(LoadingCtrlPage));
export { VoicingsListPage };
//# sourceMappingURL=voicings-list.js.map