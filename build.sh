


function build {
    #ionic build
    cordova build android --prod --release 
    #jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore keystore.jks platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk upload
    rm -f JazzGuitarVoicings.apks
    
    java -jar  bundletool-all-1.13.1.jar build-apks --bundle=platforms/android/app/build/outputs/bundle/release/app-release.aab   \
         --output=JazzGuitarVoicings.apks --ks="./keystore.jks" --ks-pass=pass:'totoComme d hab' \
         --ks-key-alias=upload --key-pass=pass:'totoComme d hab' \
         --mode=universal
    unzip -j JazzGuitarVoicings.apks
    mv universal.apk JazzGuitarVoicings.apk
    rm  toc.pb
    touch JazzGuitarVoicings.apk
   
}
function buildNoIonic {
 
    #sed -i  's/activity android:configChanges/activity android:exported="true" android:configChanges/g'  platforms/android/app/src/main/AndroidManifest.xml 
    cordova build android --prod --release 
    #jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore keystore.jks platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk upload
    rm -f JazzGuitarVoicings.apks
    
    java -jar  bundletool-all-1.13.1.jar build-apks --bundle=platforms/android/app/build/outputs/bundle/release/app-release.aab   \
         --output=JazzGuitarVoicings.apks --ks="./keystore.jks" --ks-pass=pass:'totoComme d hab' \
         --ks-key-alias=upload --key-pass=pass:'totoComme d hab' \
         --mode=universal
    unzip -j JazzGuitarVoicings.apks
    mv universal.apk JazzGuitarVoicings.apk
    rm  toc.pb
    touch JazzGuitarVoicings.apk

   
}


function build_debug {
    #ionic build
    cordova build android 
    #jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore keystore.jks platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk upload
    rm -f JazzGuitarVoicings.apks
    
    java -jar  bundletool-all-1.13.1.jar build-apks --bundle=platforms/android/app/build/outputs/bundle/release/app-release.aab   \
         --output=JazzGuitarVoicings.apks --ks="./keystore.jks" --ks-pass=pass:'totoComme d hab' \
         --ks-key-alias=upload --key-pass=pass:'totoComme d hab' \
         --mode=universal
    unzip -j JazzGuitarVoicings.apks
    mv universal.apk JazzGuitarVoicings.apk
    rm  toc.pb

   
}


if [[ $1 == 3 ]]; then
    build
    exit 0;
fi

echo '**************************************************************************************'
echo "Choose operation"
echo '**************************************************************************************'
select objet in "DEEP REBUILD" "DEEP CLEAN" "CLEAN" "BUILD" "BUILD WITHOUT IONIC" "BUILD_DEBUG" "EMULATE ANDROID" "SERVE";
do
    case $objet in 
        "DEEP REBUILD") ionic cordova platform remove  android;ionic cordova platform add  android@latest ;	build	break;;
        "DEEP CLEAN") ionic cordova platform remove  android;ionic cordova platform add  android@latest ;	break;;
        "CLEAN")  cordova clean android ;	break;;
        "BUILD")  cordova clean android ; build	break;;
        "BUILD WITHOUT IONIC")  cordova clean android ;buildNoIonic	break;;
        "BUILD_DEBUG")  build_debug	break;;
        "EMULATE ANDROID") ionic cordova run android ; break;;	
        "SERVE")  ionic serve --lab --no-interactive -v   break;;			            

    esac
    break    
done

