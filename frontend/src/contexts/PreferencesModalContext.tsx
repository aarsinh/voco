import { useState, useCallback, useMemo } from 'react';
import { PreferencesModalContext } from './PreferencesModalContext.ts';

export function PreferencesModalProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [show, setShow] = useState(false);

  const open = useCallback(() => setShow(true), []);
  const close = useCallback(() => setShow(false), []);

  const modalValue = useMemo(() => ({
    showPreferencesModal: show,
    openPreferencesModal: open,
    closePreferencesModal: close
  }), [show, open, close])

  return (
    <PreferencesModalContext.Provider value={modalValue}>
      {children}
    </PreferencesModalContext.Provider>
  );
}
