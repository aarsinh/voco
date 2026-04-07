import { useEffect, useCallback, useState } from 'react';
import ShowProjectList from './ShowProjList';
import ShowRegisteredList from './RegisteredProjList';
import { useAuth } from '../../hooks/useAuth';
import { usePreferencesModal } from '../../hooks/usePreferencesModal';

function Dashboard() {
    const { userId } = useAuth();
    const { openPreferencesModal } = usePreferencesModal();
    const [filterByPrefs, setFilterByPrefs] = useState(false);

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
            <div className="flex justify-end mb-4 px-6">
                <button
                    onClick={() => setFilterByPrefs(!filterByPrefs)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        filterByPrefs 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    {filterByPrefs ? 'Showing: My Preferences' : 'Filter by Preferences'}
                </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mx-auto w-full px-6">
                <div className="w-full">
                    <ShowRegisteredList />
                </div>

                <div className="w-full">
                    <ShowProjectList filterByPrefs={filterByPrefs} />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;