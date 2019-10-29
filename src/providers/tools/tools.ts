import { Injectable } from '@angular/core';
//import Tone from '../../assets/midi/Tone.min.js'
import { PlayerSettings,ARPEGIOS,SWING,TREMOLO } from    '../../providers/configuration/configuration';



//TODO a remplacer
export function clone<T>(o: T): T {
    return JSON.parse(JSON.stringify(o));
}
//UGLY !!
export function mod(m:number,n:number):number {
    return ((m%n)+n)%n;
};

declare var Tone;

@Injectable()
export class ToolsProvider {
    private HarpSynth:any;
    private PianoSynth:any;

    private loaded:boolean=false;

    private SampleLibrary :any= {
        minify: false,
        ext: '.[mp3|ogg]', // use setExt to change the extensions on all files // do not change this variable //
        baseUrl: '/samples/',
        list: ['bass-electric','bassoon','cello','clarinet','contrabass','flute','french-horn','guitar-acoustic','guitar-electric','guitar-nylon', 'harmonium','harp','organ','piano','saxophone','trombone','trumpet','tuba','violin','xylophone'],
        onload: null,

        setExt: function (newExt) {
            var i
            for (i = 0; i <= this.list.length - 1; i++) {
                for (var property in this[this.list[i]]) {

                    this[this.list[i]][property] = this[this.list[i]][property].replace(this.ext, newExt)
                }


            }
            this.ext = newExt;
            return console.log("sample extensions set to " + this.ext)
        },

        load: function (arg) {
            var t, rt, i;
            (arg) ? t = arg: t = {};
            t.instruments = t.instruments || this.list;
            t.baseUrl = t.baseUrl || this.baseUrl;
            t.onload = t.onload || this.onload;

            // update extensions if arg given
            if (t.ext) {
                if (t.ext != this.ext) {
                    this.setExt(t.ext)
                }
                t.ext = this.ext
            }

            rt = {};

            // if an array of instruments is passed...
            if (Array.isArray(t.instruments)) {
                for (i = 0; i <= t.instruments.length - 1; i++) {
                    var newT = this[t.instruments[i]];
                    //Minimize the number of samples to load
                    if (this.minify === true || t.minify === true) {
                        var minBy = 1;
                        if (Object.keys(newT).length >= 17) {
                            minBy = 2
                        }
                        if (Object.keys(newT).length >= 33) {
                            minBy = 4
                        }
                        if (Object.keys(newT).length >= 49) {
                            minBy = 6
                        }

                        var filtered = Object.keys(newT).filter(function (_, i) {
                            return i % minBy != 0;
                        })
                        filtered.forEach(function (f) {
                            delete newT[f]
                        })

                    }




                    rt[t.instruments[i]] = new Tone.Sampler(
                        newT, {
                            baseUrl: t.baseUrl + t.instruments[i] + "/",
                            onload: t.onload
                        }

                        )
                }

                return rt

                // if a single instrument name is passed...
            } else {
                newT = this[t.instruments];

                //Minimize the number of samples to load
                if (this.minify === true || t.minify === true) {
                    minBy = 1;
                    if (Object.keys(newT).length >= 17) {
                        minBy = 2
                    }
                    if (Object.keys(newT).length >= 33) {
                        minBy = 4
                    }
                    if (Object.keys(newT).length >= 49) {
                        minBy = 6
                    }

                    filtered = Object.keys(newT).filter(function (_, i) {
                        return i % minBy != 0;
                    })
                    filtered.forEach(function (f) {
                        delete newT[f]
                    })
                }




                var s = new Tone.Sampler(
                    newT, {
                        baseUrl: t.baseUrl + t.instruments + "/",
                        onload: t.onload
                    }
                    )

                return s
            }

        },

        'bass-electric': {
            'A#2': 'As2.[mp3|ogg]',
            'A#3': 'As3.[mp3|ogg]',
            'A#4': 'As4.[mp3|ogg]',
            'A#5': 'As5.[mp3|ogg]',
            'C#2': 'Cs2.[mp3|ogg]',
            'C#3': 'Cs3.[mp3|ogg]',
            'C#4': 'Cs4.[mp3|ogg]',
            'C#5': 'Cs5.[mp3|ogg]',
            'E2': 'E2.[mp3|ogg]',
            'E3': 'E3.[mp3|ogg]',
            'E4': 'E4.[mp3|ogg]',
            'E5': 'E5.[mp3|ogg]',
            'G2': 'G2.[mp3|ogg]',
            'G3': 'G3.[mp3|ogg]',
            'G4': 'G4.[mp3|ogg]',
            'G5': 'G5.[mp3|ogg]'
        },

        'bassoon': {
            'A3': 'A3.[mp3|ogg]',
            'C2': 'C2.[mp3|ogg]',
            'C3': 'C3.[mp3|ogg]',
            'C4': 'C4.[mp3|ogg]',
            'E3': 'E3.[mp3|ogg]',
            'G1': 'G1.[mp3|ogg]',
            'G2': 'G2.[mp3|ogg]',
            'G3': 'G3.[mp3|ogg]',
            'A1': 'A1.[mp3|ogg]',
            'A2': 'A2.[mp3|ogg]'

        },

        'cello': {
            'E3': 'E3.[mp3|ogg]',
            'E4': 'E4.[mp3|ogg]',
            'F2': 'F2.[mp3|ogg]',
            'F3': 'F3.[mp3|ogg]',
            'F4': 'F4.[mp3|ogg]',
            'F#3': 'Fs3.[mp3|ogg]',
            'F#4': 'Fs4.[mp3|ogg]',
            'G2': 'G2.[mp3|ogg]',
            'G3': 'G3.[mp3|ogg]',
            'G4': 'G4.[mp3|ogg]',
            'G#2': 'Gs2.[mp3|ogg]',
            'G#3': 'Gs3.[mp3|ogg]',
            'G#4': 'Gs4.[mp3|ogg]',
            'A2': 'A2.[mp3|ogg]',
            'A3': 'A3.[mp3|ogg]',
            'A4': 'A4.[mp3|ogg]',
            'A#2': 'As2.[mp3|ogg]',
            'A#3': 'As3.[mp3|ogg]',
            'A#4': 'As4.[mp3|ogg]',
            'B2': 'B2.[mp3|ogg]',
            'B3': 'B3.[mp3|ogg]',
            'B4': 'B4.[mp3|ogg]',
            'C2': 'C2.[mp3|ogg]',
            'C3': 'C3.[mp3|ogg]',
            'C4': 'C4.[mp3|ogg]',
            'C5': 'C5.[mp3|ogg]',
            'C#3': 'Cs3.[mp3|ogg]',
            'C#4': 'Cs4.[mp3|ogg]',
            'D2': 'D2.[mp3|ogg]',
            'D3': 'D3.[mp3|ogg]',
            'D4': 'D4.[mp3|ogg]',
            'D#2': 'Ds2.[mp3|ogg]',
            'D#3': 'Ds3.[mp3|ogg]',
            'D#4': 'Ds4.[mp3|ogg]',
            'E2': 'E2.[mp3|ogg]'

        },

        'clarinet': {
            'D3': 'D3.[mp3|ogg]',
            'D4': 'D4.[mp3|ogg]',
            'D5': 'D5.[mp3|ogg]',
            'F2': 'F2.[mp3|ogg]',
            'F3': 'F3.[mp3|ogg]',
            'F4': 'F4.[mp3|ogg]',
            'F#5': 'Fs5.[mp3|ogg]',
            'A#2': 'As2.[mp3|ogg]',
            'A#3': 'As3.[mp3|ogg]',
            'A#4': 'As4.[mp3|ogg]',
            'D2': 'D2.[mp3|ogg]'

        },

        'contrabass': {
            'C1': 'C1.[mp3|ogg]',
            'C#2': 'Cs2.[mp3|ogg]',
            'D1': 'D1.[mp3|ogg]',
            'E1': 'E1.[mp3|ogg]',
            'E2': 'E2.[mp3|ogg]',
            'F#0': 'Fs0.[mp3|ogg]',
            'F#1': 'Fs1.[mp3|ogg]',
            'G0': 'G0.[mp3|ogg]',
            'G#1': 'Gs1.[mp3|ogg]',
            'G#2': 'Gs2.[mp3|ogg]',
            'A1': 'A1.[mp3|ogg]',
            'A#0': 'As0.[mp3|ogg]',
            'B2': 'B2.[mp3|ogg]'

        },

        'flute': {
            'A5': 'A5.[mp3|ogg]',
            'C3': 'C3.[mp3|ogg]',
            'C4': 'C4.[mp3|ogg]',
            'C5': 'C5.[mp3|ogg]',
            'C6': 'C6.[mp3|ogg]',
            'E3': 'E3.[mp3|ogg]',
            'E4': 'E4.[mp3|ogg]',
            'E5': 'E5.[mp3|ogg]',
            'A3': 'A3.[mp3|ogg]',
            'A4': 'A4.[mp3|ogg]'

        },

        'french-horn': {
            'D2': 'D2.[mp3|ogg]',
            'D4': 'D4.[mp3|ogg]',
            'D#1': 'Ds1.[mp3|ogg]',
            'F2': 'F2.[mp3|ogg]',
            'F4': 'F4.[mp3|ogg]',
            'G1': 'G1.[mp3|ogg]',
            'A0': 'A0.[mp3|ogg]',
            'A2': 'A2.[mp3|ogg]',
            'C1': 'C1.[mp3|ogg]',
            'C3': 'C3.[mp3|ogg]',

        },

        'guitar-acoustic': {
            'F3': 'F3.[mp3|ogg]',
            'F#1': 'Fs1.[mp3|ogg]',
            'F#2': 'Fs2.[mp3|ogg]',
            'F#3': 'Fs3.[mp3|ogg]',
            'G1': 'G1.[mp3|ogg]',
            'G2': 'G2.[mp3|ogg]',
            'G3': 'G3.[mp3|ogg]',
            'G#1': 'Gs1.[mp3|ogg]',
            'G#2': 'Gs2.[mp3|ogg]',
            'G#3': 'Gs3.[mp3|ogg]',
            'A1': 'A1.[mp3|ogg]',
            'A2': 'A2.[mp3|ogg]',
            'A3': 'A3.[mp3|ogg]',
            'A#1': 'As1.[mp3|ogg]',
            'A#2': 'As2.[mp3|ogg]',
            'A#3': 'As3.[mp3|ogg]',
            'B1': 'B1.[mp3|ogg]',
            'B2': 'B2.[mp3|ogg]',
            'B3': 'B3.[mp3|ogg]',
            'C2': 'C2.[mp3|ogg]',
            'C3': 'C3.[mp3|ogg]',
            'C4': 'C4.[mp3|ogg]',
            'C#2': 'Cs2.[mp3|ogg]',
            'C#3': 'Cs3.[mp3|ogg]',
            'C#4': 'Cs4.[mp3|ogg]',
            'D1': 'D1.[mp3|ogg]',
            'D2': 'D2.[mp3|ogg]',
            'D3': 'D3.[mp3|ogg]',
            'D4': 'D4.[mp3|ogg]',
            'D#1': 'Ds1.[mp3|ogg]',
            'D#2': 'Ds2.[mp3|ogg]',
            'D#3': 'Ds3.[mp3|ogg]',
            'E1': 'E1.[mp3|ogg]',
            'E2': 'E2.[mp3|ogg]',
            'E3': 'E3.[mp3|ogg]',
            'F1': 'F1.[mp3|ogg]',
            'F2': 'F2.[mp3|ogg]'

        },


        'guitar-electric': {
            'D#3': 'Ds3.[mp3|ogg]',
            'D#4': 'Ds4.[mp3|ogg]',
            'D#5': 'Ds5.[mp3|ogg]',
            'E2': 'E2.[mp3|ogg]',
            'F#2': 'Fs2.[mp3|ogg]',
            'F#3': 'Fs3.[mp3|ogg]',
            'F#4': 'Fs4.[mp3|ogg]',
            'F#5': 'Fs5.[mp3|ogg]',
            'A2': 'A2.[mp3|ogg]',
            'A3': 'A3.[mp3|ogg]',
            'A4': 'A4.[mp3|ogg]',
            'A5': 'A5.[mp3|ogg]',
            'C3': 'C3.[mp3|ogg]',
            'C4': 'C4.[mp3|ogg]',
            'C5': 'C5.[mp3|ogg]',
            'C6': 'C6.[mp3|ogg]',
            'C#2': 'Cs2.[mp3|ogg]'
        },

        'guitar-nylon': {
            'F#2': 'Fs2.[mp3|ogg]',
            'F#3': 'Fs3.[mp3|ogg]',
            'F#4': 'Fs4.[mp3|ogg]',
            'F#5': 'Fs5.[mp3|ogg]',
            'G3': 'G3.[mp3|ogg]',
            'G5': 'G3.[mp3|ogg]',
            'G#2': 'Gs2.[mp3|ogg]',
            'G#4': 'Gs4.[mp3|ogg]',
            'G#5': 'Gs5.[mp3|ogg]',
            'A2': 'A2.[mp3|ogg]',
            'A3': 'A3.[mp3|ogg]',
            'A4': 'A4.[mp3|ogg]',
            'A5': 'A5.[mp3|ogg]',
            'A#5': 'As5.[mp3|ogg]',
            'B1': 'B1.[mp3|ogg]',
            'B2': 'B2.[mp3|ogg]',
            'B3': 'B3.[mp3|ogg]',
            'B4': 'B4.[mp3|ogg]',
            'C#3': 'Cs3.[mp3|ogg]',
            'C#4': 'Cs4.[mp3|ogg]',
            'C#5': 'Cs5.[mp3|ogg]',
            'D2': 'D2.[mp3|ogg]',
            'D3': 'D3.[mp3|ogg]',
            'D5': 'D5.[mp3|ogg]',
            'D#4': 'Ds4.[mp3|ogg]',
            'E2': 'E2.[mp3|ogg]',
            'E3': 'E3.[mp3|ogg]',
            'E4': 'E4.[mp3|ogg]',
            'E5': 'E5.[mp3|ogg]'
        },


        'harmonium': {
            'C2': 'C2.[mp3|ogg]',
            'C3': 'C3.[mp3|ogg]',
            'C4': 'C4.[mp3|ogg]',
            'C5': 'C5.[mp3|ogg]',
            'C#2': 'Cs2.[mp3|ogg]',
            'C#3': 'Cs3.[mp3|ogg]',
            'C#4': 'Cs4.[mp3|ogg]',
            'C#5': 'Cs5.[mp3|ogg]',
            'D2': 'D2.[mp3|ogg]',
            'D3': 'D3.[mp3|ogg]',
            'D4': 'D4.[mp3|ogg]',
            'D5': 'D5.[mp3|ogg]',
            'D#2': 'Ds2.[mp3|ogg]',
            'D#3': 'Ds3.[mp3|ogg]',
            'D#4': 'Ds4.[mp3|ogg]',
            'E2': 'E2.[mp3|ogg]',
            'E3': 'E3.[mp3|ogg]',
            'E4': 'E4.[mp3|ogg]',
            'F2': 'F2.[mp3|ogg]',
            'F3': 'F3.[mp3|ogg]',
            'F4': 'F4.[mp3|ogg]',
            'F#2': 'Fs2.[mp3|ogg]',
            'F#3': 'Fs3.[mp3|ogg]',
            'G2': 'G2.[mp3|ogg]',
            'G3': 'G3.[mp3|ogg]',
            'G4': 'G4.[mp3|ogg]',
            'G#2': 'Gs2.[mp3|ogg]',
            'G#3': 'Gs3.[mp3|ogg]',
            'G#4': 'Gs4.[mp3|ogg]',
            'A2': 'A2.[mp3|ogg]',
            'A3': 'A3.[mp3|ogg]',
            'A4': 'A4.[mp3|ogg]',
            'A#2': 'As2.[mp3|ogg]',
            'A#3': 'As3.[mp3|ogg]',
            'A#4': 'As4.[mp3|ogg]'
        },

        'harp': {
            'C5': 'C5.[mp3|ogg]',
            'D2': 'D2.[mp3|ogg]',
            'D4': 'D4.[mp3|ogg]',
            'D6': 'D6.[mp3|ogg]',
            'D7': 'D7.[mp3|ogg]',
            'E1': 'E1.[mp3|ogg]',
            'E3': 'E3.[mp3|ogg]',
            'E5': 'E5.[mp3|ogg]',
            'F2': 'F2.[mp3|ogg]',
            'F4': 'F4.[mp3|ogg]',
            'F6': 'F6.[mp3|ogg]',
            'F7': 'F7.[mp3|ogg]',
            'G1': 'G1.[mp3|ogg]',
            'G3': 'G3.[mp3|ogg]',
            'G5': 'G5.[mp3|ogg]',
            'A2': 'A2.[mp3|ogg]',
            'A4': 'A4.[mp3|ogg]',
            'A6': 'A6.[mp3|ogg]',
            'B1': 'B1.[mp3|ogg]',
            'B3': 'B3.[mp3|ogg]',
            'B5': 'B5.[mp3|ogg]',
            'B6': 'B6.[mp3|ogg]',
            'C3': 'C3.[mp3|ogg]'

        },

        'organ': {
            'C3': 'C3.[mp3|ogg]',
            'C4': 'C4.[mp3|ogg]',
            'C5': 'C5.[mp3|ogg]',
            'C6': 'C6.[mp3|ogg]',
            'D#1': 'Ds1.[mp3|ogg]',
            'D#2': 'Ds2.[mp3|ogg]',
            'D#3': 'Ds3.[mp3|ogg]',
            'D#4': 'Ds4.[mp3|ogg]',
            'D#5': 'Ds5.[mp3|ogg]',
            'F#1': 'Fs1.[mp3|ogg]',
            'F#2': 'Fs2.[mp3|ogg]',
            'F#3': 'Fs3.[mp3|ogg]',
            'F#4': 'Fs4.[mp3|ogg]',
            'F#5': 'Fs5.[mp3|ogg]',
            'A1': 'A1.[mp3|ogg]',
            'A2': 'A2.[mp3|ogg]',
            'A3': 'A3.[mp3|ogg]',
            'A4': 'A4.[mp3|ogg]',
            'A5': 'A5.[mp3|ogg]',
            'C1': 'C1.[mp3|ogg]',
            'C2': 'C2.[mp3|ogg]'
        },

        'piano': {
            'A0': 'A0.[mp3|ogg]',
            'A1': 'A1.[mp3|ogg]',
            'A2': 'A2.[mp3|ogg]',
            'A3': 'A3.[mp3|ogg]',
            'A4': 'A4.[mp3|ogg]',
            'A5': 'A5.[mp3|ogg]',
            'A6': 'A6.[mp3|ogg]',
            'A#0': 'As0.[mp3|ogg]',
            'A#1': 'As1.[mp3|ogg]',
            'A#2': 'As2.[mp3|ogg]',
            'A#3': 'As3.[mp3|ogg]',
            'A#4': 'As4.[mp3|ogg]',
            'A#5': 'As5.[mp3|ogg]',
            'A#6': 'As6.[mp3|ogg]',
            'B0': 'B0.[mp3|ogg]',
            'B1': 'B1.[mp3|ogg]',
            'B2': 'B2.[mp3|ogg]',
            'B3': 'B3.[mp3|ogg]',
            'B4': 'B4.[mp3|ogg]',
            'B5': 'B5.[mp3|ogg]',
            'B6': 'B6.[mp3|ogg]',
            'C0': 'C0.[mp3|ogg]',
            'C1': 'C1.[mp3|ogg]',
            'C2': 'C2.[mp3|ogg]',
            'C3': 'C3.[mp3|ogg]',
            'C4': 'C4.[mp3|ogg]',
            'C5': 'C5.[mp3|ogg]',
            'C6': 'C6.[mp3|ogg]',
            'C7': 'C7.[mp3|ogg]',
            'C#0': 'Cs0.[mp3|ogg]',
            'C#1': 'Cs1.[mp3|ogg]',
            'C#2': 'Cs2.[mp3|ogg]',
            'C#3': 'Cs3.[mp3|ogg]',
            'C#4': 'Cs4.[mp3|ogg]',
            'C#5': 'Cs5.[mp3|ogg]',
            'C#6': 'Cs6.[mp3|ogg]',
            'D0': 'D0.[mp3|ogg]',
            'D1': 'D1.[mp3|ogg]',
            'D2': 'D2.[mp3|ogg]',
            'D3': 'D3.[mp3|ogg]',
            'D4': 'D4.[mp3|ogg]',
            'D5': 'D5.[mp3|ogg]',
            'D6': 'D6.[mp3|ogg]',
            'D#0': 'Ds0.[mp3|ogg]',
            'D#1': 'Ds1.[mp3|ogg]',
            'D#2': 'Ds2.[mp3|ogg]',
            'D#3': 'Ds3.[mp3|ogg]',
            'D#4': 'Ds4.[mp3|ogg]',
            'D#5': 'Ds5.[mp3|ogg]',
            'D#6': 'Ds6.[mp3|ogg]',
            'E0': 'E0.[mp3|ogg]',
            'E1': 'E1.[mp3|ogg]',
            'E2': 'E2.[mp3|ogg]',
            'E3': 'E3.[mp3|ogg]',
            'E4': 'E4.[mp3|ogg]',
            'E5': 'E5.[mp3|ogg]',
            'E6': 'E6.[mp3|ogg]',
            'F0': 'F0.[mp3|ogg]',
            'F1': 'F1.[mp3|ogg]',
            'F2': 'F2.[mp3|ogg]',
            'F3': 'F3.[mp3|ogg]',
            'F4': 'F4.[mp3|ogg]',
            'F5': 'F5.[mp3|ogg]',
            'F6': 'F6.[mp3|ogg]',
            'F#0': 'Fs0.[mp3|ogg]',
            'F#1': 'Fs1.[mp3|ogg]',
            'F#2': 'Fs2.[mp3|ogg]',
            'F#3': 'Fs3.[mp3|ogg]',
            'F#4': 'Fs4.[mp3|ogg]',
            'F#5': 'Fs5.[mp3|ogg]',
            'F#6': 'Fs6.[mp3|ogg]',
            'G0': 'G0.[mp3|ogg]',
            'G1': 'G1.[mp3|ogg]',
            'G2': 'G2.[mp3|ogg]',
            'G3': 'G3.[mp3|ogg]',
            'G4': 'G4.[mp3|ogg]',
            'G5': 'G5.[mp3|ogg]',
            'G6': 'G6.[mp3|ogg]',
            'G#0': 'Gs0.[mp3|ogg]',
            'G#1': 'Gs1.[mp3|ogg]',
            'G#2': 'Gs2.[mp3|ogg]',
            'G#3': 'Gs3.[mp3|ogg]',
            'G#4': 'Gs4.[mp3|ogg]',
            'G#5': 'Gs5.[mp3|ogg]',
            'G#6': 'Gs6.[mp3|ogg]'
        },

        'saxophone': {
            'D#4': 'Ds4.[mp3|ogg]',
            'E2': 'E2.[mp3|ogg]',
            'E3': 'E3.[mp3|ogg]',
            'E4': 'E4.[mp3|ogg]',
            'F2': 'F2.[mp3|ogg]',
            'F3': 'F3.[mp3|ogg]',
            'F4': 'F4.[mp3|ogg]',
            'F#2': 'Fs2.[mp3|ogg]',
            'F#3': 'Fs3.[mp3|ogg]',
            'F#4': 'Fs4.[mp3|ogg]',
            'G2': 'G2.[mp3|ogg]',
            'G3': 'G3.[mp3|ogg]',
            'G4': 'G4.[mp3|ogg]',
            'G#2': 'Gs2.[mp3|ogg]',
            'G#3': 'Gs3.[mp3|ogg]',
            'G#4': 'Gs4.[mp3|ogg]',
            'A3': 'A3.[mp3|ogg]',
            'A4': 'A4.[mp3|ogg]',
            'A#2': 'As2.[mp3|ogg]',
            'A#3': 'As3.[mp3|ogg]',
            'B2': 'B2.[mp3|ogg]',
            'B3': 'B3.[mp3|ogg]',
            'C3': 'C3.[mp3|ogg]',
            'C4': 'C4.[mp3|ogg]',
            'C#2': 'Cs2.[mp3|ogg]',
            'C#3': 'Cs3.[mp3|ogg]',
            'C#4': 'Cs4.[mp3|ogg]',
            'D2': 'D2.[mp3|ogg]',
            'D3': 'D3.[mp3|ogg]',
            'D4': 'D4.[mp3|ogg]',
            'D#2': 'Ds2.[mp3|ogg]',
            'D#3': 'Ds3.[mp3|ogg]'

        },

        'trombone': {
            'A#2': 'As2.[mp3|ogg]',
            'C2': 'C2.[mp3|ogg]',
            'C3': 'C3.[mp3|ogg]',
            'C#1': 'Cs1.[mp3|ogg]',
            'C#3': 'Cs3.[mp3|ogg]',
            'D2': 'D2.[mp3|ogg]',
            'D3': 'D3.[mp3|ogg]',
            'D#1': 'Ds1.[mp3|ogg]',
            'D#2': 'Ds2.[mp3|ogg]',
            'D#3': 'Ds3.[mp3|ogg]',
            'F1': 'F1.[mp3|ogg]',
            'F2': 'F2.[mp3|ogg]',
            'F3': 'F3.[mp3|ogg]',
            'G#1': 'Gs1.[mp3|ogg]',
            'G#2': 'Gs2.[mp3|ogg]',
            'A#0': 'As0.[mp3|ogg]',
            'A#1': 'As1.[mp3|ogg]'

        },

        'trumpet': {
            'C5': 'C5.[mp3|ogg]',
            'D4': 'D4.[mp3|ogg]',
            'D#3': 'Ds3.[mp3|ogg]',
            'F2': 'F2.[mp3|ogg]',
            'F3': 'F3.[mp3|ogg]',
            'F4': 'F4.[mp3|ogg]',
            'G3': 'G3.[mp3|ogg]',
            'A2': 'A2.[mp3|ogg]',
            'A4': 'A4.[mp3|ogg]',
            'A#3': 'As3.[mp3|ogg]',
            'C3': 'C3.[mp3|ogg]'

        },

        'tuba': {
            'A#1': 'As1.[mp3|ogg]',
            'A#2': 'As2.[mp3|ogg]',
            'D2': 'D2.[mp3|ogg]',
            'D3': 'D3.[mp3|ogg]',
            'D#1': 'Ds1.[mp3|ogg]',
            'F0': 'F0.[mp3|ogg]',
            'F1': 'F1.[mp3|ogg]',
            'F2': 'F2.[mp3|ogg]',
            'A#0': 'As0.[mp3|ogg]'

        },

        'violin': {
            'A3': 'A3.[mp3|ogg]',
            'A4': 'A4.[mp3|ogg]',
            'A5': 'A5.[mp3|ogg]',
            'A6': 'A6.[mp3|ogg]',
            'C4': 'C4.[mp3|ogg]',
            'C5': 'C5.[mp3|ogg]',
            'C6': 'C6.[mp3|ogg]',
            'C7': 'C7.[mp3|ogg]',
            'E4': 'E4.[mp3|ogg]',
            'E5': 'E5.[mp3|ogg]',
            'E6': 'E6.[mp3|ogg]',
            'G4': 'G4.[mp3|ogg]',
            'G5': 'G5.[mp3|ogg]',
            'G6': 'G6.[mp3|ogg]'

        },

        'xylophone': {
            'C7': 'C7.[mp3|ogg]',
            'G3': 'G3.[mp3|ogg]',
            'G4': 'G4.[mp3|ogg]',
            'G5': 'G5.[mp3|ogg]',
            'G6': 'G6.[mp3|ogg]',
            'C4': 'C4.[mp3|ogg]',
            'C5': 'C5.[mp3|ogg]',
            'C6': 'C6.[mp3|ogg]'

        }
    }

    private Patterns:any[];
    private MyPart:any;


    constructor() {
       

        this.HarpSynth = this.SampleLibrary.load({ instruments: "harp",baseUrl: "assets/midi/samples/"}).set({                                    
            detune: -200,
            oscillator: {
                type: "sine"
            },
            envelope: {
                attack: 0.15,
                decay: 0.75,
                sustain: 4.75,
                release: 4.75
            },
            portamento : 0.005
        }).toMaster();

        this.PianoSynth = this.SampleLibrary.load({ instruments: "piano",baseUrl: "assets/midi/samples/"}).set({                                    
            detune: -200,
            oscillator: {
                type: "sine"
            },
            envelope: {
                attack: 0.15,
                decay: 0.75,
                sustain: 4.75,
                release: 4.75
            },
            portamento : 0.005
        }).toMaster();

        Tone.Buffer.on('load', function() {
            this.loaded=true;
            console.log('Tone.Buffer loaded !')
        });   


         this.Patterns=[];
         this.MyPart=null;

    }

    isLoaded():boolean{
        return this.loaded;
    }

    playChord(ptiches:string[]){        
        ptiches.forEach( (v,idx,_)=>{this.HarpSynth.triggerAttackRelease(v,"4n", "+"+(0.13*(ptiches.length-idx+1)))});
    }

    private clearTracks(){

        Tone.Transport.stop();

        this.Patterns.forEach(pattern=>pattern.dispose());
        this.Patterns=[];

      
        if(  this.MyPart !=null ){
            this.MyPart.dispose();  
            this.MyPart =null;
        }

    }

    playProgression(cs:string[][],settings:PlayerSettings){

        //console.log(cs);


        switch(settings.rhythmType) {
            case ARPEGIOS:
            this.playArpegios(cs,settings);
            break;
            case SWING:
            this.playSwing(cs,settings);
            break;
            case TREMOLO:
            this.playTremolo(cs,settings);
            break;
            default:

        }

    }


    playArpegios(cs:string[][],    settings:PlayerSettings){
      
        
        this.clearTracks();


        var stroke="down";
        if( settings.beatPerChord ==4 ){
            stroke="downUp";
        }
        var harpsynth=this.HarpSynth;
        // var harpsynth=this.GuitarSynth;


        var cptMesure:number=0;
        var cptNoires:number=0;

        var beatNumber:number=settings.beatPerChord;


        cs.forEach(notes=>{
          
            var pattern = new Tone.Pattern(function(time, note){
                //the order of the notes passed in depends on the pattern
                harpsynth.triggerAttackRelease(note, "2n", time);
            }, notes, stroke);


            pattern.start(cptMesure+":"+cptNoires);
            

            cptNoires+=beatNumber;
            if (cptNoires==4){
                cptMesure++;
                cptNoires=0;
            }

            pattern.stop(cptMesure+":"+cptNoires);          
           
            pattern.interval="8n";

            this.Patterns.push(pattern);
     
 
        });
        
        //console.log(settings);
        Tone.Transport.bpm.value    =settings.tempo;

        //console.log( Tone.Transport.swing);
        Tone.Transport.swing = 0
        //console.log( Tone.Transport.swingSubdivision);
        Tone.Transport.swingSubdivision = "8n"
        cptMesure++;
        Tone.Transport.start("+0.1");
        Tone.Transport.stop("+"+cptMesure+"m");       

    }
    //SWING BEATS
    private beatOne(mesure:number,noire:number,n:string):any{
        return { time :mesure+":"+noire, note : n, dur : '4t',velocity:0.05};
    }
    private beatTwo(mesure:number,noire:number,n:string):any{
        return { time :mesure+":"+noire, note : n, dur : '4t',velocity:0.1};
    }
    private beatThree(mesure:number,noire:number,n:string):any{
        return { time :mesure+":"+noire, note : n, dur : '4t',velocity:0.05};
    }
    private beatFour(mesure:number,noire:number,n:string):any{
        return { time :mesure+":"+noire, note : n, dur : '4t',velocity:0.1};
    }

   

    playSwing(cs:string[][], settings:PlayerSettings){

        this.clearTracks();
       

        var pianosynth=this.PianoSynth;

        

        var cptMesure:number=0;
        var cptNoires:number=0;

        var beatNumber:number=settings.beatPerChord;

        var notes:string[]=[];
        //var halfChordSize:number;

        cs.forEach(inNotes=>{

            
           // halfChordSize=inNotes.length/2;


            switch(beatNumber) {
                case 1:
                    inNotes.forEach(note=>{
                        notes.push(this.beatOne(cptMesure,cptNoires,note));
                    }
                    );
                break;
                case 2:
                    inNotes.forEach((note,idx,_)=>{

                        //if( idx <=  halfChordSize) 
                            notes.push(this.beatOne(cptMesure,cptNoires,note));
                        //if( idx >=  halfChordSize) 
                            notes.push(this.beatTwo(cptMesure,cptNoires+1,note));
                    }
                    );
                break;
                case 4:
                    inNotes.forEach((note,idx,_)=>{

                        
                        //if( idx >=  halfChordSize) 
                            notes.push(this.beatOne(cptMesure,cptNoires,note));
                        //if( idx <=  halfChordSize) 
                            notes.push(this.beatTwo(cptMesure,cptNoires+1,note));
                        //if( idx >=  halfChordSize) 
                            notes.push(this.beatThree(cptMesure,cptNoires+2,note));
                        //if( idx <=  halfChordSize)
                         notes.push(this.beatFour(cptMesure,cptNoires+3,note));
                    }
                        
                    );
                break;
                default:

            }

        

            cptNoires+=beatNumber;
            if (cptNoires==4){
                cptMesure++;
                cptNoires=0;
            }

        });
        this.MyPart= new Tone.Part(function(time, value){
            pianosynth.triggerAttackRelease(value.note,value.dur, time, value.velocity); 
            //console.log(value)
        }, notes).start(0);
      
       
        this.MyPart.humanize=true;
        Tone.Transport.swing = 0.7
        Tone.Transport.swingSubdivision = "8n"

        Tone.Transport.bpm.value=settings.tempo;
         cptMesure++;
        Tone.Transport.start("+0.1");
        Tone.Transport.stop("+"+cptMesure+"m");      

    }

    // tremolo sur une noire
    private makeTremolo4n(mesure:number,noire:number,n:string,outRes:any[]){

        Array(4).fill(null).map((_, i) => i).forEach(double=>{

            outRes.push( { time :mesure+":"+noire+":"+double, note : n, dur : '8n',velocity:0.05});

        })
       
    }


    playTremolo(cs:string[][],     settings:PlayerSettings){
 

        this.clearTracks();
       

        var synth=this.HarpSynth;


        var cptMesure:number=0;
        var cptNoires:number=0;
       

        var beatNumber:number=settings.beatPerChord;

        var notes:string[]=[];

        cs.forEach(inNotes=>{

            
                switch(beatNumber) {
                case 1:
                    inNotes.forEach(note=>{
                        this.makeTremolo4n(cptMesure,cptNoires,note,notes);
                    }
                    );
                break;
                case 2:
                    inNotes.forEach((note,idx,_)=>{

                      // if( idx >=  halfChordSize) 
                           this.makeTremolo4n(cptMesure,cptNoires,note,notes);
                       //if( idx <=  halfChordSize) 
                           this.makeTremolo4n(cptMesure,cptNoires+1,note,notes);
                    }
                    );
                break;
                case 4:
                    inNotes.forEach((note,idx,_)=>{
                        
                        //if( idx >=  halfChordSize)
                         this.makeTremolo4n(cptMesure,cptNoires,note,notes);
                        //if( idx >=  halfChordSize) 
                            this.makeTremolo4n(cptMesure,cptNoires+1,note,notes);
                        //if( idx <=  halfChordSize) 
                            this.makeTremolo4n(cptMesure,cptNoires+2,note,notes);
                        //if( idx <=  halfChordSize) 
                            this.makeTremolo4n(cptMesure,cptNoires+3,note,notes);

                    }
                        
                    );
                break;
                default:

            }

        

            cptNoires+=beatNumber;
            if (cptNoires==4){
                cptMesure++;
                cptNoires=0;
            }

        });
        this.MyPart= new Tone.Part(function(time, value){
            synth.triggerAttackRelease(value.note,value.dur, time, value.velocity); 
            //console.log(value)
        }, notes).start(0);
      
       
        this.MyPart.humanize=false  ;
        Tone.Transport.swing = 0;
        Tone.Transport.swingSubdivision = "8n";

        Tone.Transport.bpm.value=settings.tempo;
         cptMesure++;
        Tone.Transport.start("+0.1");
        Tone.Transport.stop("+"+cptMesure+"m");      
    }

}
