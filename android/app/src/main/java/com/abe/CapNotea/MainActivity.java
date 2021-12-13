package com.abe.CapNotea;


import android.os.Bundle;
//import java.util.ArrayList;
import com.getcapacitor.Plugin;
//import com.capacitorjs.plugins.camera.CameraPlugin;
import com.capacitorjs.plugins.storage.StoragePlugin;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.community.speechrecognition.SpeechRecognition;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;

public class MainActivity extends BridgeActivity {

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    //AQUI LOS PUGLIN NO OFICIALES
    registerPlugin(GoogleAuth.class);
    registerPlugin(SpeechRecognition.class);

    /*
    // Initializes the Bridge
    this.init(
        savedInstanceState,
        new ArrayList<Class<? extends Plugin>>() {

          {
            // Additional plugins you've installed go here
            // Ex: add(TotallyAwesomePlugin.class);
            add(SpeechRecognition.class);
            add(CameraPlugin.class);
            add(StoragePlugin.class);
          }
        }
      );
      */
  }
}