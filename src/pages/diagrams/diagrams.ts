import { Component ,ViewChild} from '@angular/core';
import { BehaviorSubject } from "rxjs"
import { Content , NavController, NavParams ,LoadingController} from 'ionic-angular';
import { ChordModel,DiagramType} from '../../models/chordModel';
import { LoadingCtrlPage}  from    '../loading-ctrl/loading-ctrl';
import { ToolsProvider}   from    '../../providers/tools/tools'; 
import { TranslationProvider } from '../../providers/translation/translation';


 @Component({
 	selector: 'page-diagrams',
 	templateUrl: 'diagrams.html'
 })
 export class DiagramsPage extends LoadingCtrlPage  {

 	@ViewChild(Content) content: Content;
 	
	
	chord:ChordModel;
	scrollTo:any;

	takeFirst:number=1000;
	upAThousand:boolean=false;
	cptTaken:number=0;
	loading:any;
	diagLength:number;

	Diagrams: BehaviorSubject<DiagramType[]>;
 	constructor(public navCtrl: NavController,private TP: TranslationProvider,public navParams: NavParams,
		public loadingCtrl: LoadingController,private toolsProvider:ToolsProvider) {
 		super(loadingCtrl);
 		this.chord=navParams.get('chord');
		this.diagLength=this.chord.diagrams.length;
		this.cptTaken=this.takeFirst;
		if(this.diagLength>this.takeFirst){
			this.upAThousand=true;
			
		}
		this.Diagrams=new BehaviorSubject<DiagramType[]>([]);

		this.Diagrams.next(this.chord.diagrams);

		

		
 	}


	 
	add(){

		this.loading = this.loadingCtrl.create({
			spinner: 'bubbles',
			content: this.TP.tr('Adding chords ...'),
			cssClass: "my-loading ",
			duration: 5000
		});
		this.loading.present().then(()=>{ 
		
			this.cptTaken+=this.takeFirst;

			if(this.cptTaken>=this.diagLength){
				this.cptTaken=this.diagLength;
			}
			
			
		},
		);
	
		
	}

	autoScroll(){

		if (this.chord.idDiag < this.cptTaken ) {
			this.scrollTo = document.getElementById("col-"+this.chord.idDiag);
			if( this.scrollTo != null){
				this.scrollTo.scrollIntoView();
			}
		}
			
	}

 	ionViewDidEnter() {

		this.autoScroll();
    	
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
