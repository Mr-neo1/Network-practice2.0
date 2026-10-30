// Behaviour that only applies inside the Android app (Capacitor). Loaded from main.tsx when the
// native bridge is present, so the website never downloads it.
import { Capacitor, SystemBars, SystemBarsStyle } from "@capacitor/core";
import { App } from "@capacitor/app";
import { AppLauncher } from "@capacitor/app-launcher";
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { SplashScreen } from "@capacitor/splash-screen";

export const isNative = () => Capacitor.isNativePlatform();

/** Open a web address outside the app: YouTube links go to the YouTube app, the rest to the browser. */
export function openExternal(url: string) {
  return AppLauncher.openUrl({ url }).catch(() => void window.open(url, "_blank"));
}

/** Save text to a file and open the share sheet, so it can go to Files, Drive, WhatsApp and so on. */
export async function shareFile(name: string, text: string) {
  const { uri } = await Filesystem.writeFile({ path: name, data: text, directory: Directory.Cache, encoding: Encoding.UTF8 });
  await Share.share({ title: name, files: [uri] });
}

export function initNative() {
  document.documentElement.classList.add("is-native");

  // Android back button walks back through the app's pages, and leaves the app from the first one.
  void App.addListener("backButton", ({ canGoBack }) => {
    // Close whatever is open on top first: the search panel, then the menu.
    const backdrop = document.querySelector(".search-backdrop");
    const menu = document.querySelector<HTMLButtonElement>(".menu-btn[aria-expanded='true']");
    if (backdrop) backdrop.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    else if (menu) menu.click();
    else if (canGoBack) history.back();
    else void App.exitApp();
  });

  // Links to other sites must not open inside the app's web view.
  document.addEventListener(
    "click",
    (e) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if ((url.protocol === "http:" || url.protocol === "https:") && url.origin !== location.origin) {
        e.preventDefault();
        void openExternal(url.href);
      }
    },
    true,
  );

  // Status-bar icons follow the app's light or dark theme.
  const syncBars = () =>
    void SystemBars.setStyle({ style: document.documentElement.dataset.theme === "dark" ? SystemBarsStyle.Dark : SystemBarsStyle.Light }).catch(() => undefined);
  syncBars();
  new MutationObserver(syncBars).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  // Keep the splash up until the first screen has drawn.
  requestAnimationFrame(() => requestAnimationFrame(() => void SplashScreen.hide({ fadeOutDuration: 200 })));
}
