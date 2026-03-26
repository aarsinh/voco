import axios from "axios";
import React from "react";
import { Link } from 'react-router-dom';
import type { Project } from '../../types';
import { useAuth } from "../../hooks/useAuth";

interface ProjectCardProps {
  project: Project;
}

const RegProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { userId: vid } = useAuth()

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

        <td className={tdClass}>
          <button
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-1.5 px-4 rounded transition-colors"
            onClick={handleUnregister}
          >
            Unregister
          </button>
        </td>
      </tr>

      {/* THE NEW ADDRESS ROW */}
      <tr className="hover:bg-gray-50 transition-colors border-b border-gray-200">
        {/* colSpan={4} makes this single cell stretch across all 4 columns above it */}
        <td colSpan={4} className="px-4 pb-4 pt-1 text-sm text-gray-500 italic">
          {project.address || "Address not provided"}
        </td>
      </tr>
    </>
  );
};

export default RegProjectCard;
