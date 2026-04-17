import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Header from "./Headers";

interface CompletedProject {
  _id: string;
  name: string;
  date: string;
  address: string;
  registrations: number;
  status: string;
}

function History() {
  const { userId: ngoId } = useAuth();
  const [history, setHistory] = useState<CompletedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API}/api/ngo/history/${ngoId}`);
        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error("Error loading history:", err);
      } finally {
        setLoading(false);
      }
    };

    if (ngoId) fetchHistory();
  }, [ngoId, API]);

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading history...</p>;
  }

  return (
    <div className="bg-white max-w-5xl mx-auto shadow-[0_10px_40px_rgba(0,0,0,0.08)] mt-10 mb-8 border border-gray-100 p-8 rounded-xl min-h-[400px]">
      <Header title="Project History" />
      
      <div className="mt-6 space-y-4">
        {history.length > 0 ? (
          history.map((project) => (
            <div 
              key={project._id} 
              className="bg-slate-900 p-6 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors shadow-md"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
                  <div className="space-y-1 text-slate-300 text-sm">
                    <p><span className="text-slate-500 font-semibold">Date:</span> {new Date(project.date).toLocaleDateString('en-GB')}</p>
                    <p><span className="text-slate-500 font-semibold">Address:</span> {project.address}</p>
                    <p><span className="text-slate-500 font-semibold">Total Registrations:</span> {project.registrations.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-3">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold uppercase rounded-full border border-green-500/30">
                    {project.status}
                  </span>
                  <Link 
                    to={`/ngo/volunteerList/${project._id}`}
                    className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold py-2 px-4 rounded transition-all shadow-lg"
                  >
                    View Volunteers
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-xl">
            <p className="text-gray-400 text-lg font-medium italic">No completed projects found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;