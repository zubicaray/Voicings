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
	diagYs:number[]=[];
	
 	constructor(public navCtrl: NavController,public navParams: NavParams,public loadingCtrl: LoadingController,private toolsProvider:ToolsProvider) {
 		super(loadingCtrl);
 		this.chord=navParams.get('chord');

		var intervalH = 85/7;
		var offset=12.5;
		var cpt:number=0;
		
		var max:number=0;
		var summax:number=0;
		var T:number;
		
		//TODO: store this in model
		this.chord.diagrams.forEach(  (d,idx) =>
			{
				T=(3+d.stretch)*intervalH+offset;
				//console.log("d.stretch="+d.stretch);
				max=Math.max(max,T);
				if(cpt==4)
				{					
					summax+=max;
					//console.log("max="+max);
					this.diagYs.push( summax);					
					max=0;
					cpt=0;
				}
				cpt++;
				
			}
		);

		
		
		
 	}

 	ionViewDidEnter() {
 		
 		//debugger
	    this.content.scrollTo(0, this.chord.idDiag_Y-200, 0);
		//trick so as to refresh:
	    //this.content.scrollTo(0, this.chord.idDiag_Y-2, 100);
		
	
    	
 	}
 	chooseDiag(event:MouseEvent,idDiag:number){
 		
		this.chord.idDiag=idDiag;
		
		
		/*
		console.log("event.clientY:"+event.clientY)
		console.log("event.pageY:"+event.pageY)
		console.log("event.offsetY:"+event.offsetY)
		*/
		//console.log("event.layerY:"+event.layerY)
		let d:number=Math.floor(idDiag/4);
		this.chord.idDiag_Y=this.diagYs[d];
		//console.log("this.chord.idDiag_Y:"+this.chord.idDiag_Y)
		//debugger
		//this.content.scrollTo(0,event.clientY, 10);
		
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
