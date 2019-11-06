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
	diagYs:number[]=[];
 	constructor(public navCtrl: NavController,public navParams: NavParams,public loadingCtrl: LoadingController,private toolsProvider:ToolsProvider) {
 		super(loadingCtrl);
 		this.chord=navParams.get('chord');

		var nbFret=7;
		var canvasWidth=150
		var intervalH = canvasWidth/nbFret;
		
		this.chord.diagrams.forEach(  (d,idx) =>
			{
			
				if(idx==0)
				{
					this.diagYs.push( (d.stretch+1)*22+44);
				} 
				else 
				{
					this.diagYs.push( (d.stretch+1)*22+45+this.diagYs[idx-1]);
				}
				
			}
		);
			//205-73= 132
			//
		console.log('toto')
 	}

 	ionViewDidEnter() {
 		
 		//trick so as to refresh:
	    this.content.scrollTo(0, this.chord.idDiag_Y-400, 0);
	    this.content.scrollTo(0, this.chord.idDiag_Y-400, 1000);
    	
 	}
 	chooseDiag(event:MouseEvent,idDiag:number){
 		
		this.chord.idDiag=idDiag;
		
		/*
		console.log("event.clientY:"+event.clientY)
		console.log("event.pageY:"+event.pageY)
		console.log("event.offsetY:"+event.offsetY)
		*/
		//console.log("event.layerY:"+event.layerY)
		
		this.chord.idDiag_Y=this.diagYs[idDiag];
		//console.log("this.chord.idDiag_Y:"+this.chord.idDiag_Y)

		 
 		//this.content.scrollTo(0, event.y+this.chord.idDiag_Y-decalage, 10);
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
