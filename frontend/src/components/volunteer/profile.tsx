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
    <div className="bg-neutral-50 rounded-xl shadow-lg p-8 max-w-2xl mx-auto border border-tertiary">
      <h2 className="text-2xl font-headline font-bold text-primary mb-6">Volunteer Profile</h2>
      
      <div className="space-y-4 mb-8">
        <div className="border-b border-tertiary pb-2">
          <p className="text-sm text-secondary uppercase tracking-wider">Name</p>
          <p className="text-lg font-semibold text-primary">{name || 'Unknown'}</p>
        </div>
        <div className="border-b border-tertiary pb-2">
          <p className="text-sm text-secondary uppercase tracking-wider">Volunteer ID</p>
          <p className="text-lg font-semibold text-primary">{userId}</p>
        </div>
        <div className="border-b border-tertiary pb-2">
          <p className="text-sm text-secondary uppercase tracking-wider">Account Type</p>
          <p className="text-lg font-semibold text-primary capitalize">{role}</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-headline font-semibold text-primary mb-4">Project History</h3>
        
        {ongoingProjects.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-secondary uppercase tracking-wider mb-2">Ongoing Projects</h4>
            <div className="space-y-2">
              {ongoingProjects.map((rp) => (
                <div key={rp.project._id} className="bg-tertiary/20 border border-tertiary rounded-lg p-3">
                  <p className="font-semibold text-primary">{rp.project?.name || 'Unknown'}</p>
                  <p className="text-sm text-secondary">{rp.project?.ngo || 'Unknown NGO'} • {rp.project?.date ? new Date(rp.project.date).toLocaleDateString() : 'TBD'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {completedProjects.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-secondary uppercase tracking-wider mb-2">Completed Projects</h4>
            <div className="space-y-2">
              {completedProjects.map((rp) => (
                <div key={rp.project._id} className="bg-primary/20 border border-primary rounded-lg p-3">
                  <p className="font-semibold text-primary">{rp.project?.name || 'Unknown'}</p>
                  <p className="text-sm text-secondary">{rp.project?.ngo || 'Unknown NGO'} • {rp.project?.date ? new Date(rp.project.date).toLocaleDateString() : 'TBD'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {registeredProjects.length === 0 && (
          <p className="text-secondary italic">No projects yet</p>
        )}
      </div>
    </div>
  );
}

export default Profile;