import { BrowserModule } from '@angular/platform-browser';;
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule  } from '@ionic/storage';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule,HttpClient} from '@angular/common/http';
import { Globalization } from '@ionic-native/globalization/ngx'
import { PayPal} from '@ionic-native/paypal';
import { InAppBrowser } from '@ionic-native/in-app-browser';


// PAGES ***********************************************************
import { HomePage } from '../pages/home/home';
import { VoicingsListPage } from '../pages/voicings-list/voicings-list';
import { EditVoicingPage}  from    '../pages/edit-voicing/edit-voicing' 
import { ChordPage}  from    '../pages/chord/chord' 
import { GuidingLinePage} from '../pages/guiding-line/guiding-line';
import { RegisterPage} from '../pages/register/register';


import { ChordFramePage} from '../pages/chord-frame/chord-frame';
import { ModalChooseOctavePage} from '../pages/modal-choose-octave/modal-choose-octave';
import { ChooseTonePage} from '../pages/choose-tone/choose-tone';
import { DiagramsPage} from '../pages/diagrams/diagrams';
import { AddingChordPage} from '../pages/adding-chord/adding-chord';
import { TunningPage } from '../pages/tunning/tunning';
import { LoadingCtrlPage} from '../pages/loading-ctrl/loading-ctrl';
import { ChooseGuidingLinePage}  from    '../pages/choose-guiding-line/choose-guiding-line';
import { PlayParametersPage}  from    '../pages/play-parameters/play-parameters';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


// DIRECTIVES    ***********************************************************

//COMPONENTS
import { ChordCanvas } from '../components/chord-canvas/chord-canvas';
import { ComputationProvider } from '../providers/computations/computations';
import { ConfigurationProvider } from '../providers/configuration/configuration';
import { ToolsProvider } from '../providers/tools/tools';
import { TranslationProvider } from '../providers/translation/translation';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}



@NgModule({
  declarations: [
    MyApp,
    HomePage, 
    VoicingsListPage,EditVoicingPage,ChordPage,
    GuidingLinePage,
    ChordCanvas,DiagramsPage,AddingChordPage,TunningPage,LoadingCtrlPage,ChooseTonePage,ChordFramePage,ModalChooseOctavePage,ChooseGuidingLinePage,RegisterPage,PlayParametersPage
  ],
  imports: [
    BrowserModule,

    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    VoicingsListPage,EditVoicingPage,ChordPage,
    GuidingLinePage,DiagramsPage,
    AddingChordPage,TunningPage,LoadingCtrlPage,ChooseTonePage,ChordFramePage,ModalChooseOctavePage,ChooseGuidingLinePage,RegisterPage,PlayParametersPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    
    ComputationProvider,ConfigurationProvider,
    ToolsProvider,BackgroundMode,Globalization,
    TranslationProvider,InAppBrowser,HttpClientModule,PayPal
  ]
})
export class AppModule {}
