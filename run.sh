


function build {
    cordova build android --prod --release 
    #jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore keystore.jks platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk upload
    rm -f JazzGuitarVoicings.apk
    zipalign -v 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk JazzGuitarVoicings.apk
    apksigner sign --ks keystore.jks  JazzGuitarVoicings.apk
   
}

echo '**************************************************************************************'
echo "Choose operation"
echo '**************************************************************************************'
select objet in "CLEAN" "BUILD" "RUN";
do
    case $objet in 
        "CLEAN")  cordova clean android ;	break;;
        "BUILD")  build	break;;
        "RUN")  ionic serve --lab --no-interactive -v   break;;			            
    esac
    break    
done

