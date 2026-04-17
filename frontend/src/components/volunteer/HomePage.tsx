import { useEffect, useCallback, useState } from 'react';
import ShowProjectList from './ShowProjList';
import ShowRegisteredList from './RegisteredProjList';
import { useAuth } from '../../hooks/useAuth';
import { usePreferencesModal } from '../../hooks/usePreferencesModal';
import Profile from './profile';

type Tab = 'profile' | 'registered' | 'all';

function Dashboard() {
    const { userId } = useAuth();
    const { openPreferencesModal } = usePreferencesModal();
    const [activeTab, setActiveTab] = useState<Tab>('registered');
    const [filterByPrefs, setFilterByPrefs] = useState(false);

    const API = import.meta.env.VITE_API_URL;

    const fetchPreferences = useCallback(async () => {
        if (!userId) return;
        try {
            const response = await fetch(`${API}/api/volunteer/preferences/${userId}`, {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.preferences?.length === 0) {
                openPreferencesModal();
            }
        } catch (err) {
            console.error('Error fetching preferences:', err);
        }
    }, [userId, openPreferencesModal]);

    useEffect(() => {
        fetchPreferences();
    }, [fetchPreferences]);

    const navItems: { id: Tab; label: string }[] = [
        { id: 'profile', label: 'Profile' },
        { id: 'registered', label: 'Registered Projects' },
        { id: 'all', label: 'All Projects' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-56 shrink-0 bg-gray-900 flex flex-col py-8 px-4 gap-2">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </aside>

            {/* Main content */}
            <main className="flex-1 p-8 overflow-auto">
                {activeTab === 'profile' && (
                    <Profile />
                )}

                {activeTab === 'registered' && (
                    <ShowRegisteredList />
                )}

                {activeTab === 'all' && (
                    <div>
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={() => setFilterByPrefs(!filterByPrefs)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${filterByPrefs
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {filterByPrefs ? 'Showing: My Preferences' : 'Filter by Preferences'}
                            </button>
                        </div>
                        <ShowProjectList filterByPrefs={filterByPrefs} />
                    </div>
                )}

            </main>
        </div>
    );
}

export default Dashboard;