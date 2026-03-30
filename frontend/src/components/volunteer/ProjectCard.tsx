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
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const tdClass = "p-4 align-middle text-gray-700 font-medium";

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
          {project.date ? new Date(project.date).toLocaleDateString() : 'TBD'}
        </td>

        <td className={tdClass}>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-1.5 px-4 rounded transition-colors"
            onClick={handleRegister}
          >
            Register
          </button>
        </td>
      </tr>

      <tr className="border-b border-gray-200">
        <td colSpan={4} className="px-4 pb-2 pt-2">
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
            {project.status == "pending" ? 'Not Started' : 'Ongoing'}
          </span>
        </td>
      </tr>

      <tr className="hover:bg-gray-50 transition-colors border-b border-gray-200">
        <td colSpan={4} className="px-4 pb-1 pt-1 text-sm text-gray-500 italic">
          {project.address || "Address not provided"}
        </td>
      </tr>

      <tr className="border-b-2 border-gray-400">
        <td colSpan={4} className="px-4 pb-2">
          <Link
            to={`/volunteer/project/${project._id}/volunteers`}
            className="text-blue-600 hover:underline text-sm"
          >
            View registered volunteers
          </Link>
        </td>
      </tr>
    </>
  );
};

export default ProjectCard;
