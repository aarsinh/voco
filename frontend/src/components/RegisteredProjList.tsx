import { useState, useEffect } from "react";
import '../index.css';
import axios from "axios";
import ProjectCard from './RegProjectCard.tsx';

interface Project {
    _id?: string;
    name: string;
    ngo: string;
    date: string;
    ngoId?: string;
}

function showRegisteredList(){
    const [projects, setProjects] = useState<Project[]>([]);
    
        useEffect(() => {
            axios
                .get<Project[]>('http://localhost:8082/api/projects')
                .then((res) => {
                    setProjects(res.data);
                })
                .catch((err) => {console.log('Error from showProjectList', err)});
        }, []);

    return (
        <div className="ShowProjectList">
            <div className="container">
                <h2 className="m-3">Registered Projects</h2>

                {projects.length === 0 ? (
                    <div>No projects found</div>
                ) : (
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Project Name</th>
                                <th scope="col">NGO Name</th>
                                <th scope="col">Date</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project, k) => (
                                <ProjectCard project={project} key={k} />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default showRegisteredList;