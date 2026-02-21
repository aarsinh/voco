import { useState, useEffect } from "react";
import axios from "axios";
import ProjectCard from './ProjectCard.tsx';
import type { Project } from '../types';

function ShowProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const vid = localStorage.getItem('volunteerId');
    const testid = '699898687aa56327e25b3785';
    try {
      axios
        .get<Project[]>(`http://localhost:8082/api/volunteer/${testid}`)
        .then((res) => {
          setProjects(res.data);
        })
        .catch((err) => { console.log('Error from showProjectList', err) });
    } catch (err) {
      console.error("ShowProjList", err);
    }
  }, []);

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg h-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Upcoming Projects</h2>

      {projects.length === 0 ? (
        <div className="text-gray-500">No projects found</div>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="bg-gray-800 text-white p-4 first:rounded-tl-lg">Project Name</th>
              <th className="bg-gray-800 text-white p-4">NGO Name</th>
              <th className="bg-gray-800 text-white p-4">Date</th>
              <th className="bg-gray-800 text-white p-4">Registrations</th>
              <th className="bg-gray-800 text-white p-4 last:rounded-tr-lg">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {projects.map((project, k) => (
              <ProjectCard project={project} key={k} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ShowProjectList;
