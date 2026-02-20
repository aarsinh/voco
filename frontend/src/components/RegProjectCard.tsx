import axios from "axios";
import React from "react";
import { Link } from 'react-router-dom';
import type { Project } from '../types';

interface ProjectCardProps {
    project: Project;
}

const RegProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    
    const handleUnregister = async () => {
        try {
            const vid = localStorage.getItem('volunteerId');
            await axios.post(`http://localhost:8082/api/volunteer/unregister`, {
                volunteerId: '699898687aa56327e25b3785',
                projectId: project._id
            });
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
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
                    className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-1.5 px-3 rounded transition-colors"
                    onClick={handleUnregister}
                >
                    Unregister
                </button>
            </td>
        </tr>
    );
};

export default RegProjectCard;