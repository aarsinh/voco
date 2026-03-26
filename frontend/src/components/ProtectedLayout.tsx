import { Header } from './Header';
import { PreferencesModal } from './volunteer/PreferencesModal';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePreferencesModal } from '../hooks/usePreferencesModal';

function ProtectedLayoutContent() {
  const { userId } = useAuth();
  const { showPreferencesModal, openPreferencesModal, closePreferencesModal } = usePreferencesModal();

  return (
    <>
      <Header onOpenPreferences={openPreferencesModal} />
      <Outlet />
      
      {showPreferencesModal && userId && (
        <PreferencesModal
          volunteerId={userId}
          onClose={closePreferencesModal}
          onSave={closePreferencesModal}
        />
      )}
    </>
  );
}

export { ProtectedLayoutContent };
