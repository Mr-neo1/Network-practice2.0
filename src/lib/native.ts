// Behaviour that only applies inside the Android app (Capacitor). Loaded from main.tsx when the
// native bridge is present, so the website never downloads it.
import { Capacitor, registerPlugin, SystemBars, SystemBarsStyle } from "@capacitor/core";
import { App } from "@capacitor/app";
import { AppLauncher } from "@capacitor/app-launcher";
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { SplashScreen } from "@capacitor/splash-screen";

export const isNative = () => Capacitor.isNativePlatform();

// Local plugin in android/app/src/main/java/.../ThemeBackgroundPlugin.java.
const ThemeBackground = registerPlugin<{ set(options: { color: string }): Promise<void> }>("ThemeBackground");

/** Open a web address outside the app: YouTube links go to the YouTube app, the rest to the browser. */
export function openExternal(url: string) {
  return AppLauncher.openUrl({ url }).catch(() => void window.open(url, "_blank"));
}

/** The installed app's version, e.g. "1.0.120". */
export async function appVersion() {
  return (await App.getInfo()).version;
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

  // Tell the progress store when the app goes to the background and comes back, so it saves
  // straight away and then pulls anything done on the website in the meantime.
  void App.addListener("pause", () => window.dispatchEvent(new Event("nz2h:pause")));
  void App.addListener("resume", () => window.dispatchEvent(new Event("nz2h:resume")));

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

  // System bars follow the app's own theme (which can differ from the phone's): icon colour first,
  // because setting it resets the strip colour, then the strip behind the bars in the page colour.
  const syncBars = async () => {
    const dark = document.documentElement.dataset.theme === "dark";
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() || (dark ? "#16181b" : "#f6f4ef");
    try {
      await SystemBars.setStyle({ style: dark ? SystemBarsStyle.Dark : SystemBarsStyle.Light });
      await ThemeBackground.set({ color: bg });
    } catch {
      /* older shell without the plugin: leave the defaults */
    }
  };
  new MutationObserver(() => void syncBars()).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  void App.addListener("resume", () => void syncBars());

  // Keep the splash up until the first screen has drawn, then set the bars: the splash screen
  // restores its own bar style when it closes, so anything set before that is lost.
  requestAnimationFrame(() =>
    requestAnimationFrame(async () => {
      await SplashScreen.hide({ fadeOutDuration: 200 }).catch(() => undefined);
      await syncBars();
      setTimeout(() => void syncBars(), 400);
    }),
  );
}
