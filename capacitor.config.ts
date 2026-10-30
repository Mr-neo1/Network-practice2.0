import type { CapacitorConfig } from "@capacitor/cli";

// The Android app wraps the same build as the website (dist/), so everything works offline
// except videos and account sync.
const config: CapacitorConfig = {
  appId: "io.github.mrneo1.zero2hero",
  appName: "Zero2Hero CCNA",
  webDir: "dist",
  backgroundColor: "#16181b",
  android: {
    allowMixedContent: false,
  },
  plugins: {
    SystemBars: {
      insetsHandling: "css",
      initialViewportFitValueHint: "cover",
    },
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 3000,
      backgroundColor: "#16181b",
      showSpinner: false,
    },
  },
};

export default config;
