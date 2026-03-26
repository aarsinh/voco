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

  const handleRegister = async () => {
    try {
      await axios.post(`http://localhost:8082/api/volunteer/register`, {
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
          <Link to={`/ngo/${project.ngoId || '#'}`} className="text-blue-600 font-bold no-underline hover:underline">
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

      <tr className="hover:bg-gray-50 transition-colors border-b border-gray-200">
        <td colSpan={4} className="px-4 pb-4 pt-1 text-sm text-gray-500 italic">
          {project.address || "Address not provided"}
        </td>
      </tr>
    </>
  );
};

export default ProjectCard;
