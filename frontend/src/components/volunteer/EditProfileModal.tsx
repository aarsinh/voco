import React, { useState } from "react";

interface VolunteerData {
  _id?: string;
  id?: string;
  username: string;
  name: string;
  email: string;
  phoneNumber: string;
  age?: number;
  sex?: string;
  password?: string;
}

interface EditProfileModalProps {
  initialData: VolunteerData;
  onClose: () => void;
  onUpdate: (updatedData: VolunteerData) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ initialData, onClose, onUpdate }) => {
  const [formData, setFormData] = useState<VolunteerData>({ ...initialData, password: "" });
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API_URL || 'http://localhost:8082';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/volunteer/update-details/${initialData._id || initialData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
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
      <div className="bg-neutral-50 rounded-lg shadow-xl w-full max-w-md overflow-hidden border-2 border-primary">
        <div className="bg-primary p-4 text-center">
          <h2 className="text-2xl font-headline font-semibold text-neutral-50">Edit Details</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {[
            { label: "Username", key: "username" },
            { label: "Password", key: "password", type: "password" },
            { label: "Name", key: "name" },
            { label: "Email", key: "email", type: "email" },
            { label: "Phone Number", key: "phoneNumber" },
            { label: "Age", key: "age", type: "number" },
            { label: "Gender", key: "sex", type: "select" },
          ].map((field) => (
            <div key={field.key} className="flex flex-col">
              <label className="text-sm font-semibold text-primary mb-1 ml-1">
                {field.label}
              </label>
              {field.key === 'sex' ? (
                <select
                  value={formData.sex || ""}
                  onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                  className="w-full border border-tertiary rounded-md p-2.5 text-primary bg-neutral-50 focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <input
                  type={field.type || "text"}
                  value={(formData as any)[field.key] || ""}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  className="w-full border border-tertiary rounded-md p-2.5 text-primary bg-neutral-50 focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                  required={field.key !== 'password' && field.key !== 'age'}
                  placeholder={field.key === 'password' ? "Enter new password to change" : ""}
                />
              )}
            </div>
          ))}

          <div className="pt-4 flex flex-col gap-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-secondary text-neutral-50 font-bold py-2.5 rounded transition-colors shadow-md"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full text-secondary font-semibold text-sm py-2 hover:bg-tertiary/20 rounded transition-colors"
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