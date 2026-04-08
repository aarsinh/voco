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
      window.location.reload();
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
      window.location.reload();
    } catch (err) {
      console.error('RegProjCard error during finalization', err);
    }
  };

  const tdClass = "p-4 align-middle text-gray-700 font-medium break-words max-w-[200px]";
  const now : Date = new Date();

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors group">
        <td className={tdClass}>{project.name}</td>

        <td className={tdClass}>
          <Link to={'#'} className="text-blue-600 font-bold no-underline hover:underline">
            {project.ngo || "Unknown NGO"}
          </Link>
        </td>

        <td className={tdClass}>
          {project.date ? new Date(project.date).toLocaleDateString('en-GB') : 'TBD'}
        </td>

        { now >= new Date(project.date) && status !== 'Completed' ? (
          <td className={tdClass}>
            <button
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-1.5 px-4 rounded transition-colors"
              onClick={handleCompleteButtonClick}
            >
              Complete
            </button>
          </td>
        ) : (
          <td>
            {status === 'Completed' ? 'Completed' : 'Not Started'}
          </td>
        )}

        <td className={tdClass}>
          <button
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-1.5 px-4 rounded transition-colors"
            onClick={handleUnregister}
          >
            Unregister
          </button>
        </td>
      </tr>

      <tr className="border-b border-gray-200">
        <td colSpan={5} className="px-4 pb-2 pt-2">
          <div className="flex flex-wrap gap-1">
            {project.tags && project.tags.length > 0 ? (
              project.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400 italic">No tags</span>
            )}
          </div>
        </td>
      </tr>
      
      <tr>
        <td colSpan={5}>
          <span className="px-4 py-1 text-black-700 text-sm">
            {new Date(project.date) > now ? 'Not Started' : 'Ongoing'}
          </span>
        </td>
      </tr>
      
      <tr className="hover:bg-gray-50 transition-colors border-b border-gray-200">
        <td colSpan={5} className="px-4 pb-1 pt-1 text-sm text-gray-500 italic">
          {project.address || "Address not provided"}
        </td>
      </tr>

      <tr className="border-b-2 border-gray-400">
        <td colSpan={5} className="px-4 pb-2">
          <Link
            to={`/volunteer/project/${project._id}/volunteers`}
            className="text-blue-600 hover:underline text-sm"
          >
            View registered volunteers
          </Link>
        </td>
      </tr>

      {isModalOpen && (
        <RatingModal 
          projectName={project.name}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleReviewSubmit}
        />
      )}

    </>
  );
};

export default RegProjectCard;
