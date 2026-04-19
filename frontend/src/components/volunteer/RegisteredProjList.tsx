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
    <div className="bg-neutral-50 p-8 rounded-xl shadow-lg border border-tertiary min-h-full">
      <h2 className="text-2xl font-headline font-bold mb-6 text-primary">Registered Projects</h2>

      {projects.length === 0 ? (
        <div className="text-secondary">No projects found</div>
      ) : (
        <div className="flex flex-col gap-4 mt-2">
          {projects.map((regProject) => (
            <RegProjectCard project={regProject.project} status={regProject.status} key={regProject.project._id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ShowRegisteredList;
