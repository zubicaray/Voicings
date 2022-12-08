import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,private emailComposer: EmailComposer) {

      

  }
  //@ts-ignore
  private openURL(){
    window.open('https://www.youtube.com/channel/UC2S0nC_cM0HtrRYD4flUz2w','_system');
  }
  //@ts-ignore
  private sendEmail(){
    this.emailComposer.isAvailable().then((available: boolean) =>{
      if(available) {
       
      }
     });
    
    let email = {
      to: 'JazzGuitarVoicnings@gmail.com',
      cc: '',
      bcc: [],
      attachments: [
      ],
      subject: 'Feed back, questions or request ...',
      body: '',
      isHtml: true
    };
    
    // Send a text message using default options
    this.emailComposer.open(email);
  }

  

}
