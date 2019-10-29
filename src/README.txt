
ionic cordova  platform  add android


// pour intégrer js
{
  "compilerOptions": {
    "allowJs": true,

***********************************************************************************************
*****************          BUILD RELEASE                       ********************************
*********************************************************************************************** 

--SIGNED RELEASE FOR PLAY STORE

keytool -genkey -v -keystore my-release-key.keystore -alias JazzGuitarVoicings -keyalg RSA -keysize 2048 -validity 10000
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore  app-release-unsigned.apk JazzGuitarVoicings
zipalign -v 4 app-release-unsigned.apk JazzGuitarVoicings.apk




ionic cordova build android --prod --minify -
--buildConfig

ionic cordova build android --prod --release -- -- --keystore=PATH--alias=ALIAS

ionic serve --address=10.85.236.43



cordova platform remove android
    


***********************************
// upgrade ionic with latest
npm -g install ionic@latest
// ou: 
 npm i -g ionic to update

 **********************************************
 ** TIPS
 ***********************************************

utiliser ionselect pour prevenir du binding 

fast del:   
RMDIR /Q/S foldername
******************************


***********************************************************************************************
*****************           ISSUES !!!!!!!!!!!!!!!!!           ********************************
***********************************************************************************************
******** PURCHASE ************
******************************
So basically make the following folder structure:

\platforms\android\app\src\main\aidl\com\android\vending\billing\

and put the IInAppBillingService.aidl file in there.

**************

ionic config set -g backend pro

//  CA C'est de la  MERDE !! APAS FAIRE
cordova plugin add --save https://github.com/jwall149/cordova-multidex

******************************
CLEAN :
******************************
del
C:\Users\s.zubicaray-perez\Documents\PERSO\JazzGuitarVoicings\platforms\*


cordova clean android




***********************************************************************************************
            JAVASCRIPT !!!!!!!!
***********************************************************************************************


console.log({objName}) -> avec les {} l'objet sera nommé dans les logs
console.trace           -> dit ou est déclaré et utilisé la méthode

***********************************************************************************************
function print(chordModel:ChordModel){
    console.log(chordModel.name1,chordModel.name2, ...)
}
=>
function print({name1,name2,...){
    console.log(${name1},${name2}, ...);
}

***********************************************************************************************

// name pour faire un alias sur le folder
{
    "folders":
    [
        {
            "name": "VOICINGS OLD",
            "path": "ChordVoicings\\www"
        },
        {
            "name": "Jazz Chord Voicings",
            "path": "JazzGuitarVoicings\\src"
        }
    ]
}

***********************************************************************************************
create directive:
ionic g directive ChordCanvas
***********************************************************************************************
// pour les canvas
npm install --prefix . ng2-charts --save
***********************************************************************************************

***********************************************************************************************
https://charlouze.github.io/ionic/2017/05/31/Ionic-3-and-Font-Awesome.html
***********************************************************************************************
npm install @ionic/storage
***********************************************************************************************
https://github.com/nbrosowsky/tonejs-instruments
***********************************************************************************************
//work around pour se repositionner sur le virtual scroll
scrollTo(elementId:string) {
    let yOffset = document.getElementById(elementId).offsetTop;
    this.content.scrollTo(0, yOffset, 4000)
}
***********************************************************************************************
npm install --save ionic-long-press
***********************************************************************************************
deep copy:
http://blog.bogdancarpean.com/deepcopy-of-javascript-objects-and-arrays-using-lodashs-clonedeep-method/
***********************************************************************************************
//  uglify
https://stackoverflow.com/questions/47987092/ionic-cordova-build-android-failed-due-to-aot?rq=1
npm install --save uglify-js
 npm install cordova-uglify --save-dev

 https://github.com/rossmartin/cordova-uglify

