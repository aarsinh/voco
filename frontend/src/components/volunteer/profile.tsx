import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useParams } from 'react-router-dom';
import type { Project } from '../../types';
import EditProfileModal from './EditProfileModal';

interface RegProject {
  project: Project;
  status: string;
}

interface Report {
  ngoId: string;
  ngoName: string;
  comment: string;
  createdAt: string;
}

interface ProfileData {
  details: { username: string; name: string; email: string; phoneNumber: string; age?: number; sex?: string; reports?: Report[] };
}

function Profile() {
  const { userId: loggedInId } = useAuth();
  const { id: profileIdFromUrl } = useParams<{ id: string }>();
  
  const profileId = profileIdFromUrl || loggedInId || '';
  const isOwner = loggedInId === profileId;


  const [data, setData] = useState<ProfileData | null>(null);
  const [registeredProjects, setRegisteredProjects] = useState<RegProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const API = import.meta.env.VITE_API_URL || 'http://localhost:8082';

  useEffect(() => {
    if (!profileId) return;

    const fetchDetails = async () => {
      try {
        const [profileRes, projectsRes] = await Promise.all([
          fetch(`${API}/api/volunteer/profile-data/${profileId}`, { credentials: 'include' }),
          fetch(`${API}/api/volunteer/allprojects/${profileId}`, { credentials: 'include' })
        ]);
        
        const profileData = await profileRes.json();
        const projectsData = await projectsRes.json();
        
        setData(profileData);
        setRegisteredProjects(projectsData.regProj || []);
      } catch (err) {
        console.error('Error fetching volunteer details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [profileId, API]);

  const ongoingProjects = registeredProjects.filter((rp) => rp.project && rp.status !== 'Completed' && rp.status !== 'completed');
  const completedProjects = registeredProjects.filter((rp) => rp.project && (rp.status === 'Completed' || rp.status === 'completed'));

  const handleProfileUpdate = (updatedDetails: ProfileData['details']) => {
    setData({ details: updatedDetails });
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="animate-spin inline-block w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
        <p>Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Section 1: Volunteer Details */}
      <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h2 className="text-xl font-bold text-gray-800">Volunteer Details</h2>
          
          {isOwner && (
            <button 
              className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition"
              onClick={() => setShowEditModal(true)}
            >
              Edit Details
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><p className="text-sm text-gray-500">Username</p><p className="font-medium">{data?.details.username || '-'}</p></div>
          <div><p className="text-sm text-gray-500">Name</p><p className="font-medium">{data?.details.name || '-'}</p></div>
          <div><p className="text-sm text-gray-500">Age</p><p className="font-medium">{data?.details.age || '-'}</p></div>
          <div><p className="text-sm text-gray-500">Gender</p><p className="font-medium">{data?.details.sex || '-'}</p></div>
          <div><p className="text-sm text-gray-500">Phone Number</p><p className="font-medium">{data?.details.phoneNumber || '-'}</p></div>
          <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{data?.details.email || '-'}</p></div>
        </div>
      </section>

      {/* Reports Section */}
      {data?.details.reports && data.details.reports.length > 0 && (
        <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Reports ({data.details.reports.length})</h2>
          <div className="space-y-4">
            {data.details.reports.map((report, idx) => (
              <div key={idx} className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-gray-800">{report.ngoName || 'NGO'}</p>
                  <p className="text-xs text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="text-sm text-gray-700">{report.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 2: Ongoing Projects */}
      <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Ongoing Projects</h2>
        {ongoingProjects.length > 0 ? (
          <div className="space-y-4">
            {ongoingProjects.map((rp, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{rp.project?.name || 'Unknown Project'}</p>
                    <p className="text-sm text-gray-500">{rp.project?.ngo || 'Unknown NGO'}</p>
                    <p className="text-sm text-gray-500">{rp.project?.date ? new Date(rp.project.date).toLocaleDateString() : 'TBD'}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Ongoing
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No ongoing projects</p>
        )}
      </section>

      {/* Section 3: Completed Projects */}
      <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Completed Projects</h2>
        {completedProjects.length > 0 ? (
          <div className="space-y-4">
            {completedProjects.map((rp, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-green-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{rp.project?.name || 'Unknown Project'}</p>
                    <p className="text-sm text-gray-500">{rp.project?.ngo || 'Unknown NGO'}</p>
                    <p className="text-sm text-gray-500">{rp.project?.date ? new Date(rp.project.date).toLocaleDateString() : 'TBD'}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No completed projects yet</p>
        )}
      </section>

      {/* Section 4: Total Stats */}
      <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Total Projects</h2>
        <div className="text-5xl font-black text-gray-900 mb-2">{registeredProjects.length}</div>
        <p className="text-sm text-gray-400 mt-2">
          {completedProjects.length} completed • {ongoingProjects.length} ongoing
        </p>
      </section>

      {showEditModal && data && (
        <EditProfileModal
          initialData={{ ...data.details, _id: profileId }}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
}

export default Profile;