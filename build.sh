


function build {
    ionic build
    sed -i  's/activity android:configChanges/activity android:exported="true" android:configChanges/g'  platforms/android/app/src/main/AndroidManifest.xml 
    cordova build android --prod --release 
    #jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore keystore.jks platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk upload
    rm -f JazzGuitarVoicings.apk
    zipalign -v 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk  JazzGuitarVoicings.apk 1>/dev/null 2>&1
                  
    apksigner sign --ks keystore.jks  --ks-pass pass:'poil_69!DEN' JazzGuitarVoicings.apk
   
}

function build_debug {
    ionic build
    sed -i  's/activity android:configChanges/activity android:exported="true" android:configChanges/g'  platforms/android/app/src/main/AndroidManifest.xml 

    cordova build android 
    #--prod --release 
    #jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore keystore.jks \
    #platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk upload
    rm -f JazzGuitarVoicings.apk
    zipalign -v 4 platforms/android/app/build/outputs/apk/debug/app-debug.apk JazzGuitarVoicings.apk
    apksigner sign --ks keystore.jks  --ks-pass pass:'poil_69!DEN' JazzGuitarVoicings.apk

   
}


if [[ $1 == 3 ]]; then
    build
    exit 0;
fi

echo '**************************************************************************************'
echo "Choose operation"
echo '**************************************************************************************'
select objet in "DEEP CLEAN" "CLEAN" "BUILD"  "BUILD_DEBUG" "EMULATE ANDROID" "SERVE";
do
    case $objet in 
        "DEEP CLEAN") ionic cordova platform remove  android;ionic cordova platform add  android;	break;;
        "CLEAN")  cordova clean android ;	break;;
        "BUILD")  build	break;;
        "BUILD_DEBUG")  build_debug	break;;
        "EMULATE ANDROID") ionic cordova run android ; break;;	
        "SERVE")  ionic serve --lab --no-interactive -v   break;;			            

    esac
    break    
done

