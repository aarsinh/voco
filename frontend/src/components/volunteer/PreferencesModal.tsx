import { useState, useEffect } from "react";

const PREFERENCES = [
  "Education",
  "Environment",
  "Healthcare",
  "Elderly Care",
  "Animal Welfare"
];

interface PreferencesModalProps {
  readonly volunteerId: string;
  readonly onClose: () => void;
  readonly onSave: (preferences: string[]) => void;
}

export function PreferencesModal({ volunteerId, onClose, onSave }: PreferencesModalProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCurrentPreferences = async () => {
      try {
        const response = await fetch(`${API}/api/volunteer/preferences/${volunteerId}`, {
          credentials: "include"
        });
        const data = await response.json();
        setSelected(data.preferences || []);
      } catch (err) {
        console.error("Error fetching preferences:", err);
        setSelected([]);
      } finally {
        setFetching(false);
      }
    };

    fetchCurrentPreferences();
  }, [volunteerId]);

  const togglePreference = (pref: string) => {
    setSelected(prev =>
      prev.includes(pref)
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    );
  };

  const handleSave = async () => {
    if (selected.length === 0) {
      setError("Please select at least one preference");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/api/volunteer/preferences`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ volunteerId, preferences: selected })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to save preferences");
      }

      onSave(selected);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="fixed inset-0 bg-secondary/50 flex items-center justify-center z-50">
        <div className="bg-neutral-50 rounded-lg p-6 w-full max-w-md shadow-xl">
          <p className="text-center text-secondary">Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-secondary/50 flex items-center justify-center z-50">
      <div className="bg-neutral-50 rounded-lg p-6 w-full max-w-md shadow-xl border border-tertiary">
        <h2 className="text-xl font-headline font-semibold mb-4 text-primary">Select Your Preferences</h2>
        <p className="text-secondary mb-4">Choose the types of activities you'd like to participate in:</p>

        <div className="space-y-3 mb-6">
          {PREFERENCES.map(pref => (
            <label
              key={pref}
              className="flex items-center gap-3 p-3 border border-tertiary rounded-lg cursor-pointer hover:bg-neutral transition-colors"
            >
              <input
                type="checkbox"
                checked={selected.includes(pref)}
                onChange={() => togglePreference(pref)}
                className="w-5 h-5 text-primary rounded"
              />
              <span className="text-primary font-medium">{pref}</span>
            </label>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-primary text-neutral-50 py-2 rounded-lg hover:bg-secondary disabled:bg-tertiary font-semibold transition-colors"
        >
          {loading ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}
