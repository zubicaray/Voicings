import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Globalization } from '@ionic-native/globalization';
import { Platform } from 'ionic-angular';
/*
  Generated class for the TranslationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TranslationProvider {

  constructor(public http: HttpClient,private translate: TranslateService,private globalization: Globalization,private platform:Platform) { 

    if (this.platform.is('cordova')) { 

      this.platform.ready().then(() => {


      this.globalization.getPreferredLanguage()
      .then(lang =>  {
          if(lang.value.substring(0,2) == 'fr')  translate.setDefaultLang('fr');
          if(lang.value.substring(0,2) == 'es')  translate.setDefaultLang('es');
         }
       )
        .catch(e => alert(e));
      }      );
      
    }
    else translate.setDefaultLang('fr');

   

      
   }
    
 

  tr(inS:string):string{
  	var res:string;
  	this.translate.get(inS).subscribe(
	  value => {
	    // value is our translated string
	    res = value;

	  }
	)
  	
	return res;
  }

}
