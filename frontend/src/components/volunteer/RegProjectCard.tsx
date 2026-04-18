import axios from "axios";
import React, { useState } from "react";
import { Link } from 'react-router-dom';
import type { Project } from '../../types';
import { useAuth } from "../../hooks/useAuth";
import RatingModal from "./RatingModal";

interface ProjectCardProps {
  project: Project;
  status?: string;
}

const RegProjectCard: React.FC<ProjectCardProps> = ({ project, status }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userId: vid } = useAuth()
  const API = import.meta.env.VITE_API_URL;

  if (!project) {
    return null;
  }

  const handleUnregister = async () => {
    try {
      await axios.post(`${API}/api/volunteer/unregister`, {
        volunteerId: vid,
        projectId: project._id
      });
      globalThis.location.reload();
    } catch (err) {
      console.error('RegProjCard', err);
    }
  };

  const handleCompleteButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleReviewSubmit = async (rating: number, comment: string) => {
    try {

      await axios.patch(`${API}/api/volunteer/submitReview`, {
        projectId: project._id,
        volunteerId: vid,
        rating: rating,
        reviewText: comment
      });

      await axios.patch(`${API}/api/volunteer/completeTask`, {
        volunteerId: vid,
        projectId: project._id
      });

      setIsModalOpen(false);
      globalThis.location.reload();
    } catch (err) {
      console.error('RegProjCard error during finalization', err);
    }
  };


  const now: Date = new Date();

  return (
    <div className="bg-primary m-2 px-6 py-5 cursor-default rounded-xl flex flex-col gap-1 hover:bg-secondary transition shadow-sm group">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-headline font-bold text-2xl text-neutral-50 tracking-wide mt-1">
          {project.name}
        </h3>
        <button
          className="text-neutral-50 text-sm font-semibold cursor-pointer transition-colors bg-red-700/80 px-4 py-2 rounded hover:bg-red-800 transition shadow-sm mt-1"
          onClick={handleUnregister}
        >
          Unregister
        </button>
      </div>

      <Link to={`/volunteer/ngo/${project.ngoId}`} className="text-neutral-50 hover:text-tertiary font-bold transition-colors w-fit">
        NGO: {project.ngo || "Unknown NGO"}
      </Link>

      <p className="text-neutral">
        {project.date ? new Date(project.date).toLocaleDateString('en-GB') : 'TBD'}
      </p>

      <p className="text-neutral">
        {project.address || "Address not provided"}
      </p>

      <Link
        to={`/volunteer/project/${project._id}/volunteers`}
        className="text-neutral hover:text-tertiary hover:underline w-fit"
      >
        Click to view registered volunteers
      </Link>

      {/* Tags and Action Bar */}
      <div className="flex justify-between items-center mt-3 gap-4">
        
        {/* Tags (Left Aligned) */}
        <div className="flex flex-wrap justify-start gap-2">
          {project.tags && project.tags.length > 0 ? (
            project.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-neutral-50/20 shadow-sm text-neutral-50 font-medium text-xs rounded-full">
                {tag}
              </span>
            ))
          ) : (
            <span className="text-xs text-tertiary italic mt-1">No tags available</span>
          )}
        </div>

        {/* Action buttons and Status (Right Aligned) */}
        <div className="flex justify-end shrink-0">
          {now >= new Date(project.date) && status !== 'Completed' ? (
            <button
              className="text-primary font-semibold cursor-pointer transition-colors bg-tertiary px-5 py-2 rounded-lg hover:bg-[#D4C8B1] transition shadow-sm"
              onClick={handleCompleteButtonClick}
            >
              Complete Task
            </button>
          ) : (
            <p className="text-neutral-50 opacity-90 font-semibold tracking-wide">
              {status === 'Completed' ? '✓ Completed' : '• Event not started'}
            </p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <RatingModal
          projectName={project.name}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
};

export default RegProjectCard;
