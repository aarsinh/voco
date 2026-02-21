import React from "react";
import { Link } from 'react-router-dom';
import type { Project } from '../types';
import axios from "axios";

interface ProjectCardProps {
    project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    
    const handleRegister = async () => {
        try {
            const vid = localStorage.getItem('volunteerId');
            await axios.post(`http://localhost:8082/api/volunteer/register`,{
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

            {/* <td className={tdClass}>
                {project.registrations}
            </td> */}

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