import { Component } from '@angular/core';
import { LoadingController} from 'ionic-angular';

/**
 * Generated class for the LoadingCtrlPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-loading-ctrl',
  templateUrl: 'loading-ctrl.html',
})
export class LoadingCtrlPage {

  constructor(public loadingCtrl: LoadingController) {
  }

  loading:any;
  showLoader(mesg:string){

		this.loading = this.loadingCtrl.create({
			spinner: 'bubbles',
			content: mesg,
			cssClass: "my-loading ",
			duration: 300
		});
		//debugger	
		//this.navCtrl.push(this.loading);
		this.loading.present().then(()=>{ /*this.loading.dismiss();*/ });

	}

	dismissLoader(){

	
		 //this.loading.dismissAll();
	}

  ionViewDidLoad() {
   // console.log('ionViewDidLoad LoadingCtrlPage');
  }

}
