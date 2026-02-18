import React, { useState, useEffect } from "react";
import '../App.css';
import axios from "axios";
import { Link } from "react-router-dom";
import ProjectCard from './ProjectCard';

function showProjectList(){
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        axios
            .get('http://localhost:8082/api/projects')
            .then((res) => {
                setProjects(res.data);
            })
            .catch((err) => {console.log('Error from showProjectList')});
    }, []);

    const projectList = 
        projects.length === 0 ?
            'there are no projects'
            : projects.map((project, k) => <ProjectCard project={project} key={k}/>);

    return (
        <div className="ShowProjectList">
            <div className="container">
                <h2 className="m-3">Project List</h2>

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
                                <th scope="col">Registrations</th>
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