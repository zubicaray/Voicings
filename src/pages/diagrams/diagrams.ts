import { Component ,ViewChild} from '@angular/core';
import { Content , NavController, NavParams ,LoadingController,VirtualScroll} from 'ionic-angular';
import { ChordModel} from '../../models/chordModel';
import { LoadingCtrlPage}  from    '../loading-ctrl/loading-ctrl';
import { ToolsProvider}   from    '../../providers/tools/tools'; 



 @Component({
 	selector: 'page-diagrams',
 	templateUrl: 'diagrams.html',
 })
 export class DiagramsPage extends LoadingCtrlPage {

 	@ViewChild(Content) content: Content;
 	@ViewChild(VirtualScroll) virtualScroll: VirtualScroll;
	
	chord:ChordModel;
	scrollTo:any;
	diagYs:number[]=[];
	
 	constructor(public navCtrl: NavController,public navParams: NavParams,public loadingCtrl: LoadingController,private toolsProvider:ToolsProvider) {
 		super(loadingCtrl);
 		this.chord=navParams.get('chord');
		
		
 	}

 	ionViewDidEnter() {
 		
		this.scrollTo = document.getElementById("col-"+this.chord.idDiag);
		if (this.scrollTo != null) 
			this.scrollTo.scrollIntoView();
			
	
    	
 	}
 	chooseDiag(event:MouseEvent,idDiag:number){
 		
		this.chord.idDiag=idDiag;
		
		
				
 		//this.content.scrollTo(0, this.chord.idDiag_Y-400, 100);
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
