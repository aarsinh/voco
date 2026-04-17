import { useState, useEffect } from "react";
import axios from "axios";
import ProjectCard from './ProjectCard.tsx';
import type { Project } from '../../types';
import { useAuth } from "../../hooks/useAuth.ts";

interface ShowProjectListProps {
  readonly filterByPrefs?: boolean;
}

function ShowProjectList({ filterByPrefs = false }: ShowProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const { userId: vid } = useAuth()
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!vid) return;
    try {
      const url = filterByPrefs 
        ? `${API}/api/volunteer/${vid}?filterByPrefs=true`
        : `${API}/api/volunteer/${vid}`;
      axios
        .get(url)
        .then((res) => {
          setProjects(res.data.upcomingProjects);
        })
        .catch((err) => { console.log('Error from showProjectList', err) });
    } catch (err) {
      console.error("ShowProjList", err);
    }
  }, [vid, filterByPrefs]);

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg min-h-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {filterByPrefs ? 'Projects Matching My Preferences' : 'All Upcoming Projects'}
      </h2>


      {projects.length === 0 ? (
        <div className="text-gray-500">No projects found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="bg-gray-800 text-white p-4 first:rounded-tl-lg">Project</th>
                <th className="bg-gray-800 text-white p-4">NGO</th>
                <th className="bg-gray-800 text-white p-4">Date</th>
                <th className="bg-gray-800 text-white p-4 last:rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.map((project) => (
                <ProjectCard project={project} key={project._id} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ShowProjectList;