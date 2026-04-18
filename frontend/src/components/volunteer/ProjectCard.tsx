import React from "react";
import { Link } from 'react-router-dom';
import type { Project } from '../../types';
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {

  const { userId: vid } = useAuth()
  const API = import.meta.env.VITE_API_URL;

  const handleRegister = async () => {
    try {
      await axios.post(`${API}/api/volunteer/register`, {
        volunteerId: vid,
        projectId: project._id
      });
      globalThis.location.reload();
    } catch (err) {
      console.log(err);
    }
  };



  return (
    <div className="bg-primary m-2 px-6 py-5 cursor-default rounded-xl flex flex-col gap-1 hover:bg-secondary transition shadow-sm group">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-headline font-bold text-2xl text-neutral-50 tracking-wide mt-1">
          {project.name}
        </h3>
        <button
          className="text-primary text-sm font-semibold cursor-pointer transition-colors bg-tertiary px-4 py-2 rounded-lg hover:bg-[#D4C8B1] transition shadow-sm mt-1"
          onClick={handleRegister}
        >
          Register
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
          {/* Left empty as requested for All Projects view */}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
