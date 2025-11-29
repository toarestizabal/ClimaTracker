import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ClimaTracker',
  webDir: 'www',
  plugins: {
    Geolocation: {
      enableHighAccuracy: true
    }
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
