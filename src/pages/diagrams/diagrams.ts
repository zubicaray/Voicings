import { Component ,ViewChild} from '@angular/core';
import { Content , NavController, NavParams ,LoadingController,VirtualScroll} from 'ionic-angular';
import { ChordModel} from '../../models/chordModel';
import { LoadingCtrlPage}  from    '../loading-ctrl/loading-ctrl';
import { ToolsProvider}   from    '../../providers/tools/tools'; 

/**
 * Generated class for the DiagramsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @Component({
 	selector: 'page-diagrams',
 	templateUrl: 'diagrams.html',
 })
 export class DiagramsPage extends LoadingCtrlPage {

 	@ViewChild(Content) content: Content;
 	@ViewChild(VirtualScroll) virtualScroll: VirtualScroll;
	
 	chord:ChordModel;
 	constructor(public navCtrl: NavController,public navParams: NavParams,public loadingCtrl: LoadingController,private toolsProvider:ToolsProvider) {
 		super(loadingCtrl);
 		this.chord=navParams.get('chord');


 		
 	}

 	ionViewDidEnter() {
 		
 		//trick so as to refresh:
	    this.content.scrollTo(0, this.chord.idDiag_Y+500, 0);
	    this.content.scrollTo(0, this.chord.idDiag_Y, 1000);
    	
 	}
 	chooseDiag(event:MouseEvent,idDiag:number){
 		
 		this.chord.idDiag=idDiag;
 		this.chord.idDiag_Y=event.layerY+event.offsetY -event.clientY;
 		this.content.scrollTo(0, event.layerY+event.offsetY -event.clientY, 10);
 		this.chord.canvas=this.chord.diagrams[idDiag];
 		var ptiches:string[]=this.chord.getCanvasPitches();
		this.toolsProvider.playChord(ptiches);
		
 	}

 	toTop(){
 		this.content.scrollToTop(); 		
 	}
 	toBottom(){
 		 this.content.scrollToBottom();
 	}
 }
