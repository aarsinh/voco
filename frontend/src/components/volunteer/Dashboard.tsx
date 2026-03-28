import { useEffect, useCallback } from 'react';
import ShowProjectList from './ShowProjList';
import ShowRegisteredList from './RegisteredProjList';
import { useAuth } from '../../hooks/useAuth';
import { usePreferencesModal } from '../../hooks/usePreferencesModal';

function Dashboard() {
    const { userId } = useAuth();
    const { openPreferencesModal } = usePreferencesModal();

    const API = import.meta.env.VITE_API_URL;

    const fetchPreferences = useCallback(async () => {
        if (!userId) return;
        try {
            const response = await fetch(`${API}/api/volunteer/preferences/${userId}`, {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.preferences && data.preferences.length === 0) {
                openPreferencesModal();
            }
        } catch (err) {
            console.error('Error fetching preferences:', err);
        }
    }, [userId, openPreferencesModal]);

    useEffect(() => {
        fetchPreferences();
    }, [fetchPreferences]);

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                <div className="w-full">
                    <ShowRegisteredList />
                </div>

                <div className="w-full">
                    <ShowProjectList />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
