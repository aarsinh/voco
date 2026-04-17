import { useState, useCallback } from 'react';
import { PreferencesModalContext } from './PreferencesModalContext.ts';

export function PreferencesModalProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [show, setShow] = useState(false);

  const open = useCallback(() => setShow(true), []);
  const close = useCallback(() => setShow(false), []);

  return (
    <PreferencesModalContext.Provider value={{ showPreferencesModal: show, openPreferencesModal: open, closePreferencesModal: close }}>
      {children}
    </PreferencesModalContext.Provider>
  );
}
