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
import { LoadingController } from 'ionic-angular';
/**
 * Generated class for the LoadingCtrlPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var LoadingCtrlPage = /** @class */ (function () {
    function LoadingCtrlPage(loadingCtrl) {
        this.loadingCtrl = loadingCtrl;
    }
    LoadingCtrlPage.prototype.showLoader = function (mesg) {
        this.loading = this.loadingCtrl.create({
            spinner: 'bubbles',
            content: mesg,
            cssClass: "my-loading ",
            duration: 400
        });
        //this.navCtrl.push(this.loading);
        this.loading.present();
    };
    LoadingCtrlPage.prototype.dismissLoader = function () {
        this.loading.dismiss();
    };
    LoadingCtrlPage.prototype.ionViewDidLoad = function () {
        // console.log('ionViewDidLoad LoadingCtrlPage');
    };
    LoadingCtrlPage = __decorate([
        Component({
            selector: 'page-loading-ctrl',
            templateUrl: 'loading-ctrl.html',
        }),
        __metadata("design:paramtypes", [LoadingController])
    ], LoadingCtrlPage);
    return LoadingCtrlPage;
}());
export { LoadingCtrlPage };
//# sourceMappingURL=loading-ctrl.js.map