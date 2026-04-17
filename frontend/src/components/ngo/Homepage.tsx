import { useState, useEffect } from "react";
import Ongoing from "./Ongoing-Events";
import Addevent from "./AddEvent";
import type { EventType } from "./types";
import { useAuth } from "../../hooks/useAuth";
import Profile from "./profile"; 
import Dashboard from "./dashboard/Dashboard";
import History from "./History";

// Define the available tabs
type Tab = 'profile' | 'ongoing' | 'create' | 'history' | 'dashboard';

function App() {
  const { userId, name, logout } = useAuth(); // Assuming logout is available from useAuth
  const ngoName = name || 'Unknown NGO';
  const ngoId = userId;
  const API = import.meta.env.VITE_API_URL;

  const [events, setEvents] = useState<EventType[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('ongoing');

  useEffect(() => {
    if (!ngoId) return;
    fetch(`${API}/api/ngo/${ngoId}`)
      .then((res) => res.json())
      .then((data: EventType[]) => setEvents(data))
      .catch(err => console.error('failed to fetch events: ', err));
  }, [ngoId, API]);

  async function deleteEvent(id: string): Promise<void> {
    try {
      const res = await fetch(`${API}/api/ngo/delProject`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ngoId, projId: id })
      });
      if (res.ok) {
        setEvents(events.filter((event) => event._id !== id));
      } else {
        alert('Failed to delete, try again');
      }
    } catch (err) {
      console.error('Deleting event: ', err);
    }
  }

  async function addEvent(event: Omit<EventType, "_id">): Promise<void> {
    const res = await fetch(`${API}/api/ngo/addProject/${ngoId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });

    const data: EventType = await res.json();
    setEvents([...events, data]);
    setActiveTab('ongoing'); // Auto-switch to ongoing projects after creation
  }

  const navItems: { id: Tab; label: string }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'ongoing', label: 'Ongoing Projects' },
    { id: 'create', label: 'Create a Project' },
    { id: 'history', label: 'Project History' }, 
    { id: 'dashboard', label: 'Dashboard' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Exact match to volunteer dashboard */}
        <aside className="w-64 shrink-0 bg-gray-900 flex flex-col py-8 px-4 gap-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-8 overflow-auto">
          {activeTab === 'profile' && (
          <Profile />
        )}

          {activeTab === 'ongoing' && (
            <Ongoing events={events} deleteEvent={deleteEvent} />
          )}

          {activeTab === 'create' && (
            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Launch New Project</h2>
                <Addevent onAdd={addEvent} ngo={ngoName} />
            </div>
          )}

          {activeTab === 'history' && (
            <History />
          )}

          {activeTab === 'dashboard' && (
            <Dashboard />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;