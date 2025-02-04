export interface ElectronAPI {
  closeApp: () => void;
  minimizeApp: () => void;
  fullscreenApp: () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
