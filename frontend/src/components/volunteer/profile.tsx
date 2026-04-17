import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { Project } from '../../types';

interface RegProject {
  project: Project;
  status: string;
}

function Profile() {
  const { name, userId, role } = useAuth();
  const [registeredProjects, setRegisteredProjects] = useState<RegProject[]>([]);
  const API = import.meta.env.VITE_API_URL || 'http://localhost:8082';

  useEffect(() => {
    if (!userId) return;

    const fetchDetails = async () => {
      try {
        const response = await fetch(`${API}/api/volunteer/allprojects/${userId}`, {
          credentials: 'include'
        });
        const data = await response.json();
        setRegisteredProjects(data.regProj || []);
      } catch (err) {
        console.error('Error fetching volunteer details:', err);
      }
    };

    fetchDetails();
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [userId]);

  const ongoingProjects = registeredProjects.filter((rp) => rp.project && rp.status !== 'Completed' && rp.status !== 'completed');
  const completedProjects = registeredProjects.filter((rp) => rp.project && (rp.status === 'Completed' || rp.status === 'completed'));

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Volunteer Profile</h2>
      
      <div className="space-y-4 mb-8">
        <div className="border-b border-gray-100 pb-2">
          <p className="text-sm text-gray-500 uppercase tracking-wider">Name</p>
          <p className="text-lg font-medium text-gray-900">{name || 'Unknown'}</p>
        </div>
        <div className="border-b border-gray-100 pb-2">
          <p className="text-sm text-gray-500 uppercase tracking-wider">Volunteer ID</p>
          <p className="text-lg font-medium text-gray-900">{userId}</p>
        </div>
        <div className="border-b border-gray-100 pb-2">
          <p className="text-sm text-gray-500 uppercase tracking-wider">Account Type</p>
          <p className="text-lg font-medium text-gray-900 capitalize">{role}</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Project History</h3>
        
        {ongoingProjects.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Ongoing Projects</h4>
            <div className="space-y-2">
              {ongoingProjects.map((rp) => (
                <div key={rp.project._id} className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <p className="font-medium text-gray-800">{rp.project?.name || 'Unknown'}</p>
                  <p className="text-sm text-gray-500">{rp.project?.ngo || 'Unknown NGO'} • {rp.project?.date ? new Date(rp.project.date).toLocaleDateString() : 'TBD'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {completedProjects.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Completed Projects</h4>
            <div className="space-y-2">
              {completedProjects.map((rp) => (
                <div key={rp.project._id} className="bg-green-50 border border-green-100 rounded-lg p-3">
                  <p className="font-medium text-gray-800">{rp.project?.name || 'Unknown'}</p>
                  <p className="text-sm text-gray-500">{rp.project?.ngo || 'Unknown NGO'} • {rp.project?.date ? new Date(rp.project.date).toLocaleDateString() : 'TBD'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {registeredProjects.length === 0 && (
          <p className="text-gray-500 italic">No projects yet</p>
        )}
      </div>
    </div>
  );
}

export default Profile;