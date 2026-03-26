import Header from "./Headers";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Volunteer
{
  id: string;
  username: string;
  status: string;
}


function volunteerList() {
    const {id} = useParams<{id: string}>();
    const [volunteers, setVolunteers ] = useState<Volunteer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await fetch(`http://localhost:8082/api/ngo/VolunteerList/${id}`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setVolunteers(data);
      } catch (err) {
        console.error("Error fetching volunteers:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchVolunteers();
    }, [id]);

    if( loading )
    {
      
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
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {volunteers.map((vol) => (
                <tr key={vol.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-5 px-6 text-gray-700 font-medium">
                    {vol.username}
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
  </div>
);

}

export default volunteerList

