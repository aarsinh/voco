import React from "react";
import { Link } from 'react-router-dom';

const ProjectCard = ({project}) => {
    return (
        <tr>
            <td>{project.name}</td>

            <td>
                <Link to={`/ngo/${project.ngoId || '#'}`} className="ngo-link">
                    {project.ngoName}
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
                    Register
                </button>
            </td>
        </tr>
    );
};

export default ProjectCard;