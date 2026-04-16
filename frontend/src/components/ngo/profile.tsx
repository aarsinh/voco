import { useAuth } from "../../hooks/useAuth";

function Profile() {
  const { name, userId } = useAuth();
  const ngoName = name || 'Unknown NGO';

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">NGO Profile</h2>
      <div className="space-y-4">
        <div className="border-b border-gray-100 pb-2">
          <p className="text-sm text-gray-500 uppercase tracking-wider">Organization Name</p>
          <p className="text-lg font-medium text-gray-900">{ngoName}</p>
        </div>
        <div className="border-b border-gray-100 pb-2">
          <p className="text-sm text-gray-500 uppercase tracking-wider">Registration ID</p>
          <p className="text-lg font-medium text-gray-900">{userId}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wider">Account Status</p>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Verified NGO
          </span>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-100">
        <button className="w-full bg-gray-100 text-gray-600 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
          Edit Profile Settings
        </button>
        <p className="mt-4 text-xs text-gray-400 text-center italic">
          Profile editing is currently under maintenance.
        </p>
      </div>
    </div>
  );
}

export default Profile;