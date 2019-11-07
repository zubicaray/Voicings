import { Component,ViewChild, Input ,OnChanges} from '@angular/core';


/**
 * Generated class for the ChordCanvasComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */


@Component({
  selector: 'chord-canvas',
  templateUrl: 'chord-canvas.html',
 
})
export class ChordCanvas implements OnChanges{

	@ViewChild('myCanvas') canvas:any;
	@Input() diagram: {guidingString:number, frets:number[]};
	@Input() guidingPitchString: number;
	@Input() width: number;
	@Input() typeDisplay: number;

	text: string;
	nativeCanvas:any;
	height:number;

	constructor() {
		
	}
	ngOnChanges(){this.nativeCanvas=this.canvas.nativeElement;this.drawChord();}

	ngAfterViewInit(){ 
		this.nativeCanvas=this.canvas.nativeElement;
		this.drawChord(); 
	}

	max(tab:number[]):number {
  		return Math.max.apply(null, tab);
	};

	min(tab:number[]):number  {
	  var min = Math.min.apply(Math, tab.map(function(o) 
	  {
	    return o == null ? Infinity : o;
	  }));
	  return min;
	};

	leftestStringFret(tab:number[]) :number {
		let res=0
		for(var i=0;i<tab.length;i++){
			if(tab[i]!= null && tab[i]!=0) {
				res=tab[i];
				break;
			}

		}
		
		return res;
	  };

	chordMin(tab:number[]) :number {
	  var min = Math.min.apply(Math, tab.map(function(o) 
	  {
	    return ( o == null || o == 0) ? Infinity : o;
	  }));
	  return min;
	};

	// conversion d'un entier en nombre romain
	AtoR( nb:number ):string{


		var A = [ 1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1 ],
		R = [ "M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I" ],
		Alength = A.length;
		// on s'assure d'avoir un entier entre 1 et 3999.
		var x = nb;//parseInt( nb, 10 ) || 1,
		var str :string = "";

		if ( x < 1 ){
			x = 1;
		} else if ( x > 3999 ){
			x = 3999;
		}

		// pour chaque A[ i ], 
		// tant que x est supérieur ou égal
		// on déduit A[ i ] de x.
		// arrêt de la boucle si x == 0
		for ( var i = 0; i < Alength; ++i ){
			while ( x >= A[ i ] ){
			  x -= A[ i ];
			  str += R[ i ];
			}

			if ( x == 0 ){
			  break;
			}
		}

		return str;
	}

	drawChord(){

		var fontSize:number=15;
		var coeffStringOffset:number=2.7;
		var coeffIntervalW:number=7.7;
		var yOffsetRoman:number=5;
		if(this.typeDisplay==2){// vue en grille sur EditVoicing.html
			fontSize=9;
			coeffStringOffset=2.5	;
			coeffIntervalW=7.3;
			yOffsetRoman=2;
		}
		

		var canvas:any = this.nativeCanvas;
		var context:any= canvas.getContext('2d');

		canvas.width=this.width;
		//canvas.id=attrs.id;
		//
 
		context.beginPath();
		
		if(this.diagram == undefined) return;
		if(this.diagram.frets == undefined) return;
		if(this.diagram.frets.every(elem=>elem==null) ) return;
		if(this.diagram.frets.length ==0) return;

		//debugger
		var lowerFret=this.chordMin(this.diagram.frets);
		var leftestStringFret=this.leftestStringFret(this.diagram.frets);
		var higherFret=this.max(this.diagram.frets);
		//console.log(this.frets);
		//console.log('lowerFretscope='+lowerFret);

		// space between two strings
		var nbFret=7;

		var stretch=higherFret-lowerFret;

		var intervalW = canvas.width/10;
		// space between two frets
		var intervalH = canvas.width/nbFret;
		canvas.height=(Math.max(4,2+stretch))*intervalH;
		this.height=canvas.height

		var stringOffset=intervalW*coeffStringOffset;
		var noteOffset=intervalH*1.5;
		context.font = fontSize+'pt Calibri';
		var romanNumber=this.AtoR(leftestStringFret)//lowerFret+stretch)
		context.fillText(romanNumber, 0, (2+leftestStringFret-lowerFret)*intervalH-yOffsetRoman);
		var romanOffset=1
		if(romanNumber.length>3)
			romanOffset=6;

		var X,Y:number;
		var radius=intervalW*0.4;

		// draw frets
		context.beginPath();
		var i:number; 
		for (i = 0; i < nbFret; i++) {
			Y = intervalH+i*intervalH;
			context.moveTo(stringOffset+romanOffset, Y);
			context.lineTo(intervalW*coeffIntervalW+romanOffset, Y);
			context.lineWidth = 3;
			context.lineCap = 'round';
			context.strokeStyle = '#C0C0C0';
			context.stroke();
		} 
		context.closePath();

		context.beginPath();
		// draw strings
		for (i = 0; i < 6; i++) {
			X = stringOffset+romanOffset+i*intervalW;     
			context.moveTo(X, intervalH-5);
			context.lineTo(X, canvas.height);
			context.lineWidth = 1;
			context.lineCap = 'square';
			context.strokeStyle = '#000000';
			context.stroke();
		}
		context.closePath();


		// draw note
		
		for (i = 0; i < 6; i++) {
			if( this.diagram.frets[i] != null){
				context.beginPath();
				X = stringOffset+romanOffset+i*intervalW; 

				Y = noteOffset + (this.diagram.frets[i]-lowerFret )*intervalH;


				if (this.diagram.frets[i] == 0 ){
					context.arc(X, intervalH*0.3, radius, 0, 2 * Math.PI, true);
					context.fillStyle = 'grey';
					context.fill();

				}
				else {
					context.arc(X, Y, radius, 0, 2 * Math.PI, true);
					if(this.diagram.guidingString==i){
						context.fillStyle = 'red';
					}else
						context.fillStyle = 'blue';
					
					context.fill();

				}


				context.closePath();
			}
		}
	}
		



}

