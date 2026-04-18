import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

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

  const { userId: ngoId, name: ngoName } = useAuth()

  const handleSubmit = async () => {
    if (!reportText.trim() || !volunteer) return;

    setSubmitting(true);
    try {
      const response = await fetch(`${API}/api/ngo/report-volunteer/${volunteer.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ report: reportText, ngoName: ngoName, ngoId: ngoId}),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/40 backdrop-blur-sm p-4">
      <div className="bg-neutral-50 rounded-lg shadow-xl w-full max-w-md p-6 border border-tertiary">
        <h2 className="text-xl font-headline font-bold text-primary mb-1">Report Volunteer</h2>
        <p className="text-secondary text-sm mb-6">
          Reason for reporting <span className="font-semibold text-primary">@{volunteer.username}</span>:
        </p>

        <textarea
          placeholder="Describe the issue with this volunteer..."
          className="w-full border border-tertiary rounded-md p-3 text-sm text-primary focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all resize-none"
          rows={5}
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
        />

        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={handleSubmit}
            disabled={!reportText.trim() || submitting}
            className="w-full bg-red-700 hover:bg-red-800 disabled:bg-tertiary text-neutral-50 font-headline font-bold py-2.5 rounded transition-colors shadow-sm"
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </button>
          
          <button 
            onClick={onClose}
            className="w-full bg-transparent hover:bg-neutral text-secondary font-headline font-semibold text-sm py-2 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;