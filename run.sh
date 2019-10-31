


function build {
    cordova build android --prod --release 
    jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore keystore.jks platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk upload
    rm JazzGuitarVoicings.apk;zipalign -v 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk JazzGuitarVoicings.apk



}

echo '**************************************************************************************'
echo "Choisissez l'opération"
echo '**************************************************************************************'
select objet in "CLEAN" "BUILD" "RUN";
do
    case $objet in 
        "CLEAN")  cordova build android 	break;;
        "BUILD")  build	break;;
        "RUN")  ionic serve --no-interactive -v   break;;			            
    esac
    break    
done

