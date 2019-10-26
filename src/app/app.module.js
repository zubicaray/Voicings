var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BrowserModule } from '@angular/platform-browser';
;
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { HTTP } from '@ionic-native/http';
// PAGES ***********************************************************
import { HomePage } from '../pages/home/home';
import { VoicingsListPage } from '../pages/voicings-list/voicings-list';
import { EditVoicingPage } from '../pages/edit-voicing/edit-voicing';
import { ChordPage } from '../pages/chord/chord';
import { GuidingLinePage } from '../pages/guiding-line/guiding-line';
import { GuitarConstraintsPage } from '../pages/guitar-constraints/guitar-constraints';
import { ModalChooseOctavePage } from '../pages/modal-choose-octave/modal-choose-octave';
import { DiagramsPage } from '../pages/diagrams/diagrams';
import { AddingChordPage } from '../pages/adding-chord/adding-chord';
import { ChordagePage } from '../pages/chordage/chordage';
import { LoadingCtrlPage } from '../pages/loading-ctrl/loading-ctrl';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// DIRECTIVES    ***********************************************************
//COMPONENTS
import { ChordCanvas } from '../components/chord-canvas/chord-canvas';
import { ComputationProvider } from '../providers/computations/computations';
import { ToolsProvider } from '../providers/tools/tools';
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            declarations: [
                MyApp,
                HomePage,
                VoicingsListPage, EditVoicingPage, ChordPage,
                GuidingLinePage, GuitarConstraintsPage,
                ChordCanvas, DiagramsPage, AddingChordPage, ChordagePage, LoadingCtrlPage, ModalChooseOctavePage
            ],
            imports: [
                BrowserModule,
                IonicModule.forRoot(MyApp),
                IonicStorageModule.forRoot()
            ],
            bootstrap: [IonicApp],
            entryComponents: [
                MyApp,
                HomePage,
                VoicingsListPage, EditVoicingPage, ChordPage,
                GuidingLinePage, GuitarConstraintsPage, DiagramsPage,
                AddingChordPage, ChordagePage, LoadingCtrlPage, ModalChooseOctavePage
            ],
            providers: [
                StatusBar,
                SplashScreen, File, HTTP,
                { provide: ErrorHandler, useClass: IonicErrorHandler },
                ComputationProvider,
                ToolsProvider
            ]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map