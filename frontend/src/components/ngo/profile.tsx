import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useParams } from "react-router-dom";
import EditProfileModal from "./EditProfileModal";

interface Review {
  _id: string;
  projectId: { _id: string; name: string };
  rating: number;
  reviewText: string;
}

interface ProfileData {
  details: { username: string, name: string; email: string; phoneNumber: string; website: string };
  avgRating: string;
  reviews: Review[];
}

function Profile() {
  const { id: urlNgoId } = useParams<{ id: string }>(); // Get ID from URL
  const { userId: loggedInId } = useAuth();
  
  // Decide which ID to use: 
  // If we are on the volunteer side, use ID from URL. 
  // If we are the NGO looking at our own profile tab, use our own ID.
  const profileId = urlNgoId || loggedInId;
  
  // A volunteer is viewing if the URL ID exists AND it's not theirs
  const isOwner = loggedInId === profileId;

  const [data, setData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null); // Added error state
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Reset states when the ID changes
    setData(null);
    setError(null);

    // If profileId is null/undefined/empty string, we wait.
    if (!profileId || profileId === "undefined") {
      console.log("Waiting for profileId...");
      return;
    }


    fetch(`${API}/api/ngo/profile-data/${profileId}`)
        .then(res => {
            if (!res.ok) {
            if (res.status === 404) throw new Error("NGO Profile not found");
            throw new Error(`Server error: ${res.status}`);
            }
            return res.json();
        })
        .then(fetchedData => {
            setData(fetchedData);
        })
        .catch(err => {
            console.error("Fetch error:", err);
            setError(err.message);
        });
    }, [profileId, API]);

  const handleUpdate = (updatedDetails: any) => {
    setData((prev: any) => ({ ...prev, details: updatedDetails }));
  };

    // 1. Error State
    if (error) {
        return (
        <div className="p-8 text-center">
            <p className="text-red-500 font-semibold">Error: {error}</p>
            <button 
            onClick={() => window.location.reload()} 
            className="mt-4 text-blue-600 underline"
            >
            Try Refreshing
            </button>
        </div>
        );
    }

    // 2. Loading State
    if (!data) {
        return (
        <div className="p-8 text-center text-gray-500">
            <div className="animate-spin inline-block w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
            <p>Loading Profile...</p>
        </div>
        );
    }

  // Group reviews by Project Name
    const groupedReviews = (data?.reviews ?? []).reduce((acc, review) => {
    const projId = review.projectId?._id;
    if (!projId) return acc; // Safety check
    if (!acc[projId]) acc[projId] = { name: review.projectId.name, items: [] };
    acc[projId].items.push(review);
    return acc;
    }, {} as Record<string, { name: string; items: Review[] }>);

  const toggleProject = (id: string) => {
    setExpandedProjects(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Star Logic: Fills stars based on rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const fill = Math.min(Math.max(rating - (star - 1), 0), 1) * 100;
          return (
            <div key={star} className="relative w-6 h-6 text-gray-300">
              <span className="absolute inset-0">★</span>
              <div className="absolute inset-0 text-yellow-500 overflow-hidden" style={{ width: `${fill}%` }}>
                <span>★</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Section 1: NGO Details */}
      <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h2 className="text-xl font-bold text-gray-800">NGO Details</h2>

          {/* THE CONDITIONAL BUTTON */}
          {isOwner && (
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition"
            >
              Edit Details
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><p className="text-sm text-gray-500">Username</p><p className="font-medium">@{data.details.username}</p></div>
          <div><p className="text-sm text-gray-500">Name</p><p className="font-medium">{data.details.name}</p></div>
          <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{data.details.email}</p></div>
          <div><p className="text-sm text-gray-500">Phone</p><p className="font-medium">{data.details.phoneNumber}</p></div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Website</p>
            <a href={data.details.website} target="_blank" className="text-blue-600 hover:underline">{data.details.website}</a>
          </div>
        </div>
      </section>

      {/* Section 2: Average Rating */}
      <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Average Rating</h2>
        <div className="text-5xl font-black text-gray-900 mb-2">{data.avgRating}</div>
        {renderStars(parseFloat(data.avgRating))}
        <p className="text-sm text-gray-400 mt-2">Based on {data.reviews.length} reviews</p>
      </section>

      {/* Section 3: Reviews Accordion */}
      <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Project Reviews</h2>
        <div className="space-y-4">
          {Object.entries(groupedReviews).map(([id, group]) => (
            <div key={id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button 
                onClick={() => toggleProject(id)}
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition"
              >
                <span className="font-semibold text-gray-700">{group.name}</span>
                <span className="text-sm text-blue-600 font-medium">
                  {expandedProjects[id] ? "Collapse All ↑" : "Expand All ↓"}
                </span>
              </button>
              
              {expandedProjects[id] && (
                <div className="p-4 bg-white divide-y divide-gray-100">
                  {group.items.map(rev => (
                    <div key={rev._id} className="py-4 first:pt-0 last:pb-0">
                      <div className="mb-1">{renderStars(rev.rating)}</div>
                      <p className="text-gray-600 text-sm italic">"{rev.reviewText}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {data.reviews.length === 0 && <p className="text-center text-gray-400">No reviews yet.</p>}
        </div>
      </section>

     {/* Edit Modal - Only rendered if owner */}
      {isEditModalOpen && isOwner && (
        <EditProfileModal 
          initialData={data.details} 
          onClose={() => setIsEditModalOpen(false)} 
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
export default Profile;