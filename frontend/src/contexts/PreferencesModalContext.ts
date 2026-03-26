import { createContext } from 'react';

interface PreferencesModalContextType {
  showPreferencesModal: boolean;
  openPreferencesModal: () => void;
  closePreferencesModal: () => void;
}

export const PreferencesModalContext = createContext<PreferencesModalContextType | null>(null);
