import React from "react";
import { Link } from 'react-router-dom';

interface Project {
    _id?: string;
    name: string;
    ngo: string;
    date: string;
    registrations: number;
    ngoId?: string
}
interface ProjectCardProps {
    project: Project;
}

// 3. Add the type ': React.FC<ProjectCardProps>'
const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {

    // 4. Define the missing function to prevent crashes
    const handleRegister = () => {
        console.log(`Registering for project: ${project.name}`);
        // Add your registration API logic here later
    };

    return (
        <tr>
            <td>{project.name}</td>

            <td>
                {/* Safe navigation: Use # if ngoId is missing */}
                <Link to={`/ngo/${project.ngoId || '#'}`} className="ngo-link">
                    {project.ngo || "Unknown NGO"}
                </Link>
            </td>

            <td>
                {project.date ? new Date(project.date).toLocaleDateString() : 'TBD'}
            </td>

            <td>
                {project.registrations.toLocaleString()}
            </td>

            <td>
                <button
                    className="btn btn-primary btn-sm"
                    onClick={handleRegister}
                >
                    Register
                </button>
            </td>
        </tr>
    );
};

export default ProjectCard;