import React from "react";
import { Link } from 'react-router-dom';
import type { Project } from '../types';

interface ProjectCardProps {
    project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {

    const handleRegister = () => {
        console.log(`Registering for project: ${project.name}`);
        // Add your registration API logic here later
    };

    const tdClass = "p-4 align-middle text-gray-700 font-medium";

    return (
        <tr className="hover:bg-gray-50 transition-colors">
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
    );
};

export default ProjectCard;