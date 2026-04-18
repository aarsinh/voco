import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  readonly onOpenPreferences?: () => void;
}

export function Header({ onOpenPreferences }: HeaderProps) {
  const { logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-primary border-b border-primary shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        <img src="/logo.png" alt="Logo" className="h-10 w-auto" />

        <div className="flex items-center gap-4">
          {role === 'volunteer' && onOpenPreferences && (
            <button
              onClick={onOpenPreferences}
              className="px-4 py-2 text-neutral-50 font-semibold hover:bg-tertiary hover:text-primary rounded-lg transition-colors"
            >
              Select Preferences
            </button>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-neutral-50 font-semibold hover:bg-red-700 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
