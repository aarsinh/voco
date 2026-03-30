import { useState, useEffect } from "react";
import axios from "axios";
import RegProjectCard from './RegProjectCard';
import type { Project } from '../../types';
import { useAuth } from "../../hooks/useAuth";

interface RegProject {
  project: Project;
  status: string;
}

function ShowRegisteredList() {
  const [projects, setProjects] = useState<RegProject[]>([]);
  const { userId: vid } = useAuth()
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API}/api/volunteer/registered/${vid}`)
      .then((res) => {
        const allProjects = res.data.regProj || [];
        const validProjects = allProjects.filter((rp: RegProject) => rp.project != null);
        setProjects(validProjects);
      })
      .catch((err) => { console.log('Error from showProjectList', err) });
  }, [vid]);

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg min-h-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Registered Projects</h2>

      {projects.length === 0 ? (
        <div className="text-gray-500">No projects found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="bg-gray-800 text-white p-4 first:rounded-tl-lg">Project Name</th>
                <th className="bg-gray-800 text-white p-4">NGO Name</th>
                <th className="bg-gray-800 text-white p-4">Date</th>
                <th className="bg-gray-800 text-white p-4">Task Status</th>
                <th className="bg-gray-800 text-white p-4 last:rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.map((regProject, k) => (
                <RegProjectCard project={regProject.project} status={regProject.status} key={k} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ShowRegisteredList;
