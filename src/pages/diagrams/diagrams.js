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
import { Component, ViewChild } from '@angular/core';
import { Content, NavController, NavParams, LoadingController, VirtualScroll } from 'ionic-angular';
import { LoadingCtrlPage } from '../loading-ctrl/loading-ctrl';
/**
 * Generated class for the DiagramsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var DiagramsPage = /** @class */ (function (_super) {
    __extends(DiagramsPage, _super);
    function DiagramsPage(navCtrl, navParams, loadingCtrl) {
        var _this = _super.call(this, loadingCtrl) || this;
        _this.navCtrl = navCtrl;
        _this.navParams = navParams;
        _this.loadingCtrl = loadingCtrl;
        _this.chord = navParams.get('chord');
        return _this;
    }
    DiagramsPage.prototype.ionViewDidEnter = function () {
        //trick so as to refresh:
        this.content.scrollTo(0, this.chord.idDiag_Y + 500, 0);
        this.content.scrollTo(0, this.chord.idDiag_Y, 1000);
    };
    DiagramsPage.prototype.chooseDiag = function (event, idDiag) {
        this.chord.idDiag = idDiag;
        //console.log("event.layerY:"+event.layerY)
        //console.log("event.pageY:"+event.offsetY)
        this.chord.idDiag_Y = event.layerY + event.offsetY - event.clientY;
        this.content.scrollTo(0, event.layerY + event.offsetY - event.clientY, 10);
        this.chord.canvas = this.chord.diagrams[idDiag];
        this.chord.play();
    };
    DiagramsPage.prototype.toTop = function () {
        this.content.scrollToTop();
    };
    DiagramsPage.prototype.toBottom = function () {
        this.content.scrollToBottom();
    };
    __decorate([
        ViewChild(Content),
        __metadata("design:type", Content)
    ], DiagramsPage.prototype, "content", void 0);
    __decorate([
        ViewChild(VirtualScroll),
        __metadata("design:type", VirtualScroll)
    ], DiagramsPage.prototype, "virtualScroll", void 0);
    DiagramsPage = __decorate([
        Component({
            selector: 'page-diagrams',
            templateUrl: 'diagrams.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, LoadingController])
    ], DiagramsPage);
    return DiagramsPage;
}(LoadingCtrlPage));
export { DiagramsPage };
//# sourceMappingURL=diagrams.js.map