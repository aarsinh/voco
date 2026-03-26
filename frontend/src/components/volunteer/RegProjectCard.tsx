import axios from "axios";
import React from "react";
import { Link } from 'react-router-dom';
import type { Project } from '../../types';

interface ProjectCardProps {
    project: Project;
    status: string;
}

const RegProjectCard: React.FC<ProjectCardProps> = ({ project, status }) => {
    
    const handleUnregister = async () => {
        try {
            const vid = localStorage.getItem('volunteerId') || '699898687aa56327e25b3785';
            await axios.post(`http://localhost:8082/api/volunteer/unregister`, {
                volunteerId: vid,
                projectId: project._id
            });
            window.location.reload();
        } catch (err) {
            console.error('RegProjCard',err);
        }
    };


    const changeStatus = async (newStatus : string) => {
        try {
            const vid = localStorage.getItem('volunteerId') || '699898687aa56327e25b3785';
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

                <td className={tdClass}>
                    <select
                        value={status}
                        onChange={(e) => changeStatus(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-700"
                    >
                        <option value="pending">Not Started</option>
                        <option value="ongoing">Active</option>
                        <option value="completed">Completed</option>
                    </select>
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

            <tr className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                <td colSpan={4} className="px-4 pb-4 pt-1 text-sm text-gray-500 italic">
                    {project.address || "Address not provided"}
                </td>
            </tr>
        </>
    );
};

export default RegProjectCard;