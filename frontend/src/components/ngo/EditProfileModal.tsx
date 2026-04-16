import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

interface NGOData {
  username: string;
  name: string;
  email: string;
  phoneNumber: string;
  website: string;
  password?: string; // Optional field for updates
}

interface EditProfileModalProps {
  initialData: NGOData;
  onClose: () => void;
  onUpdate: (updatedData: NGOData) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ initialData, onClose, onUpdate }) => {
  // Initialize with initialData and an empty password string
  const [formData, setFormData] = useState<NGOData>({ ...initialData, password: "" });
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const API = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/ngo/update-details/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const result = await res.json();
        onUpdate(result.details);
        onClose();
      } else {
        alert("Failed to update profile details.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-gray-100">
        <div className="bg-[#1e293b] p-4 text-center">
          <h2 className="text-xl font-semibold text-white">Edit Details</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {[
            { label: "Username", key: "username" },
            { label: "Password", key: "password", type: "password" }, // Masked input
            { label: "Name", key: "name" },
            { label: "Email", key: "email", type: "email" },
            { label: "Phone Number", key: "phoneNumber" },
            { label: "Website", key: "website" },
          ].map((field) => (
            <div key={field.key} className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1 ml-1">
                {field.label}
              </label>
              <input
                type={field.type || "text"} // This will be "password" for the password field
                value={(formData as any)[field.key] || ""}
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required={field.key !== 'password'} // Password shouldn't be required if they don't want to change it
                placeholder={field.key === 'password' ? "Enter new password to change" : ""}
              />
            </div>
          ))}

          <div className="pt-4 flex flex-col gap-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1e293b] hover:bg-[#334155] text-white font-bold py-2.5 rounded transition-colors shadow-md"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full text-gray-500 text-sm py-2 hover:bg-gray-50 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;