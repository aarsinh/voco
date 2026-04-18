import Header from "./Headers";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ReportModal from "./ReportModal";
import reportIcon from "./report.png"

interface Volunteer {
  id: string;
  username: string;
  status: string;
}

function VolunteerList() {
  const { projectId } = useParams<{ projectId: string }>();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await fetch(`${API}/api/ngo/VolunteerList/${projectId}`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setVolunteers(data);
      } catch (err) {
        console.error("Error fetching volunteers:", err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchVolunteers();
  }, [projectId]);

  const openReport = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="bg-white max-w-5xl mx-auto shadow-[0_10px_40px_rgba(0,0,0,0.08)] mt-10 mb-8 border border-gray-100 p-8 rounded-xl overflow-auto font-sans">
        <p className="text-center text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white max-w-5xl mx-auto shadow-[0_10px_40px_rgba(0,0,0,0.08)] mt-10 mb-8 border border-gray-100 p-8 rounded-xl overflow-auto font-sans">
      <Header title="Registered Volunteers" />

  <div className="mt-8">
          {volunteers.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1e293b] text-white">
                    <th className="py-4 px-6 font-semibold text-sm tracking-wider">Username</th>
                    <th className="py-4 px-6 font-semibold text-sm tracking-wider">Status</th>
                    <th className="py-4 px-10 font-semibold text-sm tracking-wider text-right">Report</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {volunteers.map((vol) => (
                    <tr key={vol.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-5 px-6">
                        <Link 
                          to={`/volunteer/profile/${vol.id}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          {vol.username}
                        </Link>
                      </td>
                      <td className="py-5 px-6">
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-tight ${
                          vol.status === 'Confirmed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-600 text-white'
                        }`}>
                          {vol.status}
                        </span>
                      </td>
                      <td className="py-5 px-10 text-right">
                        <button 
                          onClick={() => openReport(vol)}
                          className="inline-flex items-center justify-center p-2 hover:bg-gray-100 rounded-full transition-all active:scale-90 group"
                        >
                          <img 
                            src={reportIcon} 
                            alt="Report" 
                            className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" 
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-xl">
            <p className="text-gray-400 text-lg font-medium italic">No volunteers yet</p>
          </div>
        )}
      </div>
      {isModalOpen && selectedVolunteer && (
        <ReportModal 
          volunteer={selectedVolunteer} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}

export default VolunteerList
