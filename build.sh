cordova build android --prod --release 
sjarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk zubicaray.music.jgv
rm JazzGuitarVoicings.apk;zipalign -v 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk JazzGuitarVoicings.apk

