package io.github.mrneo1.zero2hero;

import android.graphics.Color;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Paints the strips behind the status bar and the gesture bar in the app's own theme colour.
 *
 * On web views older than Chrome 140, Capacitor pads the page away from the system bars, and what
 * shows in those strips is the window background. That follows the phone's light/dark setting, not
 * the app's, so the page tells us its colour whenever its theme changes.
 */
@CapacitorPlugin(name = "ThemeBackground")
public class ThemeBackgroundPlugin extends Plugin {

    @PluginMethod
    public void set(PluginCall call) {
        String color = call.getString("color");
        int parsed;
        try {
            parsed = Color.parseColor(color);
        } catch (RuntimeException e) {
            call.reject("Not a colour: " + color);
            return;
        }
        getActivity().runOnUiThread(() -> {
            getActivity().getWindow().getDecorView().setBackgroundColor(parsed);
            call.resolve();
        });
    }
}
