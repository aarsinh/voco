import React, { useState } from "react";

interface Volunteer {
  id: string;
  username: string;
}

interface ReportModalProps {
  volunteer: Volunteer | null;
  onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ volunteer, onClose }) => {
  const [reportText, setReportText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  const handleSubmit = async () => {
    if (!reportText.trim() || !volunteer) return;

    setSubmitting(true);
    try {
      const response = await fetch(`${API}/api/ngo/report-volunteer/${volunteer.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ report: reportText }),
      });

      if (!response.ok) throw new Error("Failed to submit report");

      alert(`Report submitted for ${volunteer.username}`);
      onClose();
    } catch (err) {
      console.error("Error reporting volunteer:", err);
      alert("Failed to send report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!volunteer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Report Volunteer</h2>
        <p className="text-gray-500 text-sm mb-6">
          Reason for reporting <span className="font-semibold text-gray-700">@{volunteer.username}</span>:
        </p>

        <textarea
          placeholder="Describe the issue with this volunteer..."
          className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
          rows={5}
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
        />

        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={handleSubmit}
            disabled={!reportText.trim() || submitting}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-2.5 rounded transition-colors shadow-sm"
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </button>
          
          <button 
            onClick={onClose}
            className="w-full bg-transparent hover:bg-gray-100 text-gray-500 text-sm py-2 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;