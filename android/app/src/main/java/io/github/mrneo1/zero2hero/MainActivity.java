package io.github.mrneo1.zero2hero;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(ThemeBackgroundPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
