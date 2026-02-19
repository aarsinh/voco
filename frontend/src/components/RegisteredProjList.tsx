import { useState, useEffect } from "react";
import '../index.css';
import axios from "axios";
import ProjectCard from './RegProjectCard.tsx';

interface Project {
    _id?: string;
    name: string;
    ngo: string;
    date: string;
    ngoId?: string
}

function showRegisteredList(){
    const dummydata: Project[] = [
        {
            _id: '1',
            name: 'Clean Water Initiative',
            ngo: 'AquaLife Foundation',
            date: '2023-10-25'
        },
        {
            _id: '2',
            name: 'Urban Reforestation',
            ngo: 'Green Earth Society',
            date: '2023-11-05'
        },
        {
            _id: '3',
            name: 'Digital Literacy for Seniors',
            ngo: 'TechConnect NGO',
            date: '2023-09-15'
        },
        {
            _id: '4',
            name: 'Food Bank Drive',
            ngo: 'Community Meals',
            date: '2023-12-01'
        }
    ];

    const [projects, setProjects] = useState<Project[]>([]);
    
        useEffect(() => {
            // axios
            //     .get<Project[]>('http://localhost:8082/api/projects')
            //     .then((res) => {
            //         setProjects(res.data);
            //     })
            //     .catch((err) => {console.log('Error from showProjectList', err)});
            setProjects(dummydata);
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