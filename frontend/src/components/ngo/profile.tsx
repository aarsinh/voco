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
  
  const profileId = urlNgoId || loggedInId;

  const isOwner = loggedInId === profileId;

  const [data, setData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null); 
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setData(null);
    setError(null);

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

    if (error) {
        return (
        <div className="p-8 text-center">
            <p className="text-red-500 font-semibold">Error: {error}</p>
            <button 
            onClick={() => globalThis.location.reload()} 
            className="mt-4 text-blue-600 underline"
            >
            Try Refreshing
            </button>
        </div>
        );
    }

    if (!data) {
        return (
        <div className="p-8 text-center text-gray-500">
            <div className="animate-spin inline-block w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
            <p>Loading Profile...</p>
        </div>
        );
    }

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
      <section className="bg-neutral-50 p-8 rounded-xl shadow-sm border border-tertiary">
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h2 className="text-xl font-headline font-bold text-primary">NGO Details</h2>

          {/* THE CONDITIONAL BUTTON */}
          {isOwner && (
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="text-sm font-headline bg-primary text-neutral-50 px-4 py-1.5 rounded-lg hover:bg-secondary transition"
            >
              Edit Details
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><p className="text-sm text-secondary">Username</p><p className="font-medium text-primary">@{data.details.username}</p></div>
          <div><p className="text-sm text-secondary">Name</p><p className="font-medium text-primary">{data.details.name}</p></div>
          <div><p className="text-sm text-secondary">Email</p><p className="font-medium text-primary">{data.details.email}</p></div>
          <div><p className="text-sm text-secondary">Phone</p><p className="font-medium text-primary">{data.details.phoneNumber}</p></div>
          <div className="md:col-span-2">
            <p className="text-sm text-secondary">Website</p>
            <a href={data.details.website} target="_blank" className="font-semibold text-primary underline hover:text-secondary">{data.details.website}</a>
          </div>
        </div>
      </section>

      {/* Section 2: Average Rating */}
      <section className="bg-neutral-50 p-8 rounded-xl shadow-sm border border-tertiary flex flex-col items-center">
        <h2 className="text-xl font-headline font-bold text-primary mb-4">Average Rating</h2>
        <div className="text-5xl font-black text-primary font-headline mb-2">{data.avgRating}</div>
        {renderStars(Number.parseFloat(data.avgRating))}
        <p className="text-sm text-secondary mt-2">Based on {data.reviews.length} reviews</p>
      </section>

      {/* Section 3: Reviews Accordion */}
      <section className="bg-neutral-50 p-8 rounded-xl shadow-sm border border-tertiary">
        <h2 className="text-xl font-headline font-bold text-primary mb-6">Project Reviews</h2>
        <div className="space-y-4">
          {Object.entries(groupedReviews).map(([id, group]) => (
            <div key={id} className="border border-tertiary rounded-lg overflow-hidden">
              <button 
                onClick={() => toggleProject(id)}
                className="w-full flex justify-between items-center p-4 bg-neutral hover:bg-tertiary/20 transition"
              >
                <span className="font-semibold text-primary">{group.name}</span>
                <span className="text-sm text-primary font-medium">
                  {expandedProjects[id] ? "Collapse All ↑" : "Expand All ↓"}
                </span>
              </button>
              
              {expandedProjects[id] && (
                <div className="p-4 bg-neutral-50 divide-y divide-tertiary">
                  {group.items.map(rev => (
                    <div key={rev._id} className="py-4 first:pt-0 last:pb-0">
                      <div className="mb-1">{renderStars(rev.rating)}</div>
                      <p className="text-secondary text-sm italic">"{rev.reviewText}"</p>
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