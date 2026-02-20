import axios from "axios";
import React from "react";
import { Link } from 'react-router-dom';

interface Project {
    _id?: string;
    name: string;
    ngo: string;
    date: string;
    ngoId?: string
}
interface ProjectCardProps {
    project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {

    const handleRegister = () => {
        console.log(`Registering for project: ${project.name}`);
        axios   
            .post('http://localhost:8082/api/projects', )
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
                <button
                    className="btn btn-primary btn-sm"
                    onClick={handleRegister}
                >
                    Unregister
                </button>
            </td>
        </tr>
    );
};

export default ProjectCard;