var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, Input } from '@angular/core';
/**
 * Generated class for the ChordCanvasComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
var ChordCanvas = /** @class */ (function () {
    function ChordCanvas() {
    }
    ChordCanvas.prototype.ngOnChanges = function () { this.nativeCanvas = this.canvas.nativeElement; this.drawChord(); };
    ChordCanvas.prototype.ngAfterViewInit = function () {
        //console.log(this.frets);
        //console.log(this.canvas);
        this.nativeCanvas = this.canvas.nativeElement;
        this.drawChord();
    };
    ChordCanvas.prototype.max = function (tab) {
        return Math.max.apply(null, tab);
    };
    ;
    ChordCanvas.prototype.min = function (tab) {
        var min = Math.min.apply(Math, tab.map(function (o) {
            return o == null ? Infinity : o;
        }));
        return min;
    };
    ;
    ChordCanvas.prototype.chordMin = function (tab) {
        var min = Math.min.apply(Math, tab.map(function (o) {
            return (o == null || o == 0) ? Infinity : o;
        }));
        return min;
    };
    ;
    // conversion d'un entier en nombre romain
    ChordCanvas.prototype.AtoR = function (nb) {
        var A = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1], R = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"], Alength = A.length;
        // on s'assure d'avoir un entier entre 1 et 3999.
        var x = nb; //parseInt( nb, 10 ) || 1,
        var str = "";
        if (x < 1) {
            x = 1;
        }
        else if (x > 3999) {
            x = 3999;
        }
        // pour chaque A[ i ], 
        // tant que x est supérieur ou égal
        // on déduit A[ i ] de x.
        // arrêt de la boucle si x == 0
        for (var i = 0; i < Alength; ++i) {
            while (x >= A[i]) {
                x -= A[i];
                str += R[i];
            }
            if (x == 0) {
                break;
            }
        }
        return str;
    };
    ChordCanvas.prototype.drawChord = function () {
        var canvas = this.nativeCanvas;
        var context = canvas.getContext('2d');
        canvas.width = this.width;
        //canvas.id=attrs.id;
        //
        context.beginPath();
        if (this.diagram == undefined)
            return;
        if (this.diagram.frets == undefined)
            return;
        if (this.diagram.frets.every(function (elem) { return elem == null; }))
            return;
        if (this.diagram.frets.length == 0)
            return;
        var lowerFret = this.chordMin(this.diagram.frets);
        var higherFret = this.max(this.diagram.frets);
        //console.log(this.frets);
        //console.log('lowerFretscope='+lowerFret);
        // space between two strings
        var nbFret = 7;
        var stretch = higherFret - lowerFret;
        var intervalW = canvas.width / 10;
        // space between two frets
        var intervalH = canvas.width / nbFret;
        canvas.height = (Math.max(4, 2 + stretch)) * intervalH;
        var stringOffset = intervalW * 3;
        var noteOffset = intervalH * 1.7;
        context.font = '15pt Calibri';
        context.fillText(this.AtoR(lowerFret), 1, intervalH * 1.8);
        var X, Y;
        var radius = intervalW * 0.4;
        // draw frets
        context.beginPath();
        var i;
        for (i = 0; i < nbFret; i++) {
            Y = intervalH + i * intervalH;
            context.moveTo(stringOffset - 2, Y);
            context.lineTo(intervalW * 8 + 2, Y);
            context.lineWidth = 4;
            context.lineCap = 'round';
            context.strokeStyle = '#C0C0C0';
            context.stroke();
        }
        context.closePath();
        context.beginPath();
        // draw strings
        for (i = 0; i < 6; i++) {
            X = stringOffset + i * intervalW;
            context.moveTo(X, intervalH - 5);
            context.lineTo(X, canvas.height);
            context.lineWidth = 2;
            context.lineCap = 'square';
            context.strokeStyle = '#000000';
            context.stroke();
        }
        context.closePath();
        // draw note
        var relativeCase;
        for (i = 0; i < 6; i++) {
            if (this.diagram.frets[i] != null) {
                context.beginPath();
                X = stringOffset + i * intervalW;
                Y = noteOffset + (this.diagram.frets[i] - lowerFret) * intervalH;
                if (this.diagram.frets[i] == 0) {
                    context.arc(X, intervalH * 0.3, radius, 0, 2 * Math.PI, true);
                    context.fillStyle = 'grey';
                    context.fill();
                }
                else {
                    context.arc(X, Y, radius, 0, 2 * Math.PI, true);
                    if (this.diagram.guidingString == i) {
                        context.fillStyle = 'red';
                    }
                    else
                        context.fillStyle = 'blue';
                    context.fill();
                }
                context.closePath();
            }
        }
    };
    __decorate([
        ViewChild('myCanvas'),
        __metadata("design:type", Object)
    ], ChordCanvas.prototype, "canvas", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], ChordCanvas.prototype, "diagram", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], ChordCanvas.prototype, "guidingPitchString", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], ChordCanvas.prototype, "width", void 0);
    ChordCanvas = __decorate([
        Component({
            selector: 'chord-canvas',
            templateUrl: 'chord-canvas.html',
        }),
        __metadata("design:paramtypes", [])
    ], ChordCanvas);
    return ChordCanvas;
}());
export { ChordCanvas };
//# sourceMappingURL=chord-canvas.js.map