import { useState, useEffect } from "react";
import '../index.css';
import axios from "axios";
import ProjectCard from './ProjectCard.tsx';

interface Project {
    _id: string;      // MongoDB usually sends _id
    name: string;
    ngo: string;   // Optional (?) if some projects might not have it
    date: string;    // Optional
    registrations: number;
    ngoId?: string
}

function showProjectList(){
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        axios
            .get<Project[]>('http://localhost:8082/api/projects')
            .then((res) => {
                setProjects(res.data);
            })
            .catch((err) => {console.log('Error from showProjectList', err)});
        // setProjects(dummydata);
    }, []);

    return (
        <div className="ShowProjectList">
            <div className="container">
                <h2 className="m-3">Upcoming Projects</h2>

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
    );
}

export default showProjectList;