import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.hesamhabibi.voxa",
  appName: "Voxa",
  // Native projects are initialized after the web/API deployment split. The
  // mobile shell consumes the same hosted Node API as the browser client.
  webDir: "out",
  server: { androidScheme: "https", iosScheme: "https" },
}

export default config
