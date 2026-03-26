import { useContext } from 'react';
import { PreferencesModalContext } from '../contexts/PreferencesModalContext';

export function usePreferencesModal() {
  const context = useContext(PreferencesModalContext);
  if (!context) {
    throw new Error('usePreferencesModal must be used within PreferencesModalProvider');
  }
  return context;
}
