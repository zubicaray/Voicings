var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import Tone from '../../assets/midi/Tone.min.js';
/*
  Generated class for the ToolsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
/**
** Configuration of midi player
*/
export var PolySynth = new Tone.PolySynth(6, Tone.Synth, {
    "volume": -8,
    "oscillator": {
        "partials": [1, 2, 5],
    },
    "portamento": 0.005
}).toMaster();
//TODO a remplacer
export function clone(o) {
    return JSON.parse(JSON.stringify(o));
}
export function mod(m, n) {
    return ((m % n) + n) % n;
}
;
var ToolsProvider = /** @class */ (function () {
    function ToolsProvider() {
        console.log('Hello ToolsProvider Provider');
    }
    ToolsProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], ToolsProvider);
    return ToolsProvider;
}());
export { ToolsProvider };
//# sourceMappingURL=tools.js.map