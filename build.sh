cordova build android --prod --release 
rm JazzGuitarVoicings.apk;zipalign -v 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk JazzGuitarVoicings.apk

