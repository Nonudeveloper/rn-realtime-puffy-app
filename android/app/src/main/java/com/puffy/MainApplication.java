package com.puffy;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.shahenlibrary.RNVideoProcessingPackage;
import com.rnfs.RNFSPackage;
import com.appsflyer.reactnative.RNAppsFlyerPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.masteratul.exceptionhandler.ReactNativeExceptionHandlerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.imagepicker.ImagePickerPackage;
import com.horcrux.svg.SvgPackage;
import com.magus.fblogin.FacebookLoginPackage;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.projectseptember.RNGL.RNGLPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.opensettings.OpenSettingsPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new PickerPackage(),
            new RCTCameraPackage(),
            new RNVideoProcessingPackage(),
            new RNFSPackage(),
            new RNAppsFlyerPackage(MainApplication.this),
            new FIRMessagingPackage(),
            new ReactVideoPackage(),
            new ReactNativeRestartPackage(),
            new ReactNativeExceptionHandlerPackage(),
            new RNFetchBlobPackage(),
            new ImagePickerPackage(),
            new SvgPackage(),
            new FacebookLoginPackage(),
            new RNGeocoderPackage(),
            new LinearGradientPackage(),
            new RNGLPackage(),
            new ReactNativePushNotificationPackage(),
            new ImageResizerPackage(),
            new OpenSettingsPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
