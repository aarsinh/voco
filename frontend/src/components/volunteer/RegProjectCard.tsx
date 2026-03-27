import axios from "axios";
import React from "react";
import { Link } from 'react-router-dom';
import type { Project } from '../../types';
import { useAuth } from "../../hooks/useAuth";

interface ProjectCardProps {
  project: Project;
  status?: string;
}

const RegProjectCard: React.FC<ProjectCardProps> = ({ project, status }) => {
  const { userId: vid } = useAuth()

  if (!project) {
    return null;
  }

  const handleUnregister = async () => {
    try {
      await axios.post(`http://localhost:8082/api/volunteer/unregister`, {
        volunteerId: vid,
        projectId: project._id
      });
      window.location.reload();
    } catch (err) {
      console.error('RegProjCard', err);
    }
  };

  const changeStatus = async (newStatus: string) => {
    try {
      await axios.patch(`http://localhost:8082/api/volunteer/changeStatus`, {
        volunteerId: vid,
        projectId: project._id,
        status: newStatus
      });
      window.location.reload();
    } catch (err) {
      console.error('RegProjCard changeStatus', err);
    }
  };

  const tdClass = "p-4 align-middle text-gray-700 font-medium";

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors group">
        <td className={tdClass}>{project.name}</td>

        <td className={tdClass}>
          <Link to={`/ngo/${project.ngoId || '#'}`} className="text-blue-600 font-bold no-underline hover:underline">
            {project.ngo || "Unknown NGO"}
          </Link>
        </td>

        <td className={tdClass}>
          {project.date ? new Date(project.date).toLocaleDateString() : 'TBD'}
        </td>

        {status !== undefined && (
          <td className={tdClass}>
            <select
              value={status}
              onChange={(e) => changeStatus(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-700"
            >
              <option value="notStarted">Not Started</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
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

      <tr className="hover:bg-gray-50 transition-colors border-b border-gray-200">
        <td colSpan={5} className="px-4 pb-4 pt-1 text-sm text-gray-500 italic">
          {project.address || "Address not provided"}
        </td>
      </tr>

      <tr className="border-b border-gray-200">
        <td colSpan={5} className="px-4 pb-2 pt-2">
          <div className="flex flex-wrap gap-1">
            {project.tags?.map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </td>
      </tr>

      <tr className="border-b border-gray-200">
        <td colSpan={5} className="px-4 pb-2">
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

export default RegProjectCard;
