import { Component ,ViewChild} from '@angular/core';
import { BehaviorSubject } from "rxjs"
import { Content , NavController, NavParams ,LoadingController,VirtualScroll} from 'ionic-angular';
import { ChordModel,DiagramType} from '../../models/chordModel';
import { LoadingCtrlPage}  from    '../loading-ctrl/loading-ctrl';
import { ToolsProvider}   from    '../../providers/tools/tools'; 
import { TranslationProvider } from '../../providers/translation/translation';


 @Component({
 	selector: 'page-diagrams',
 	templateUrl: 'diagrams.html'
 })
 export class DiagramsPage extends LoadingCtrlPage {

 	@ViewChild(Content) content: Content;
 	@ViewChild(VirtualScroll) virtualScroll: VirtualScroll;
	
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

 	ionViewDidEnter() {

		//this.Diagrams.next(this.chord.diagrams.slice(this.takeFirst));

		/*
		this.Diagrams.pipe(
			merge(Observable.of(this.chord.diagrams)))
		;
		this.Diagrams.subscribe(t=>
			{console.log('ici 2')});

		
		
		this.scrollTo = document.getElementById("col-"+this.chord.idDiag);
		if (this.chord.idDiag < this.takeFirst && this.scrollTo != null) 
			this.scrollTo.scrollIntoView();
		
		*/
			
	
    	
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
