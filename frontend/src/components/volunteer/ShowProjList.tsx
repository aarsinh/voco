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
    <div className="bg-neutral-50 p-8 rounded-xl shadow-lg border border-tertiary min-h-full">
      <h2 className="text-2xl font-headline font-bold mb-6 text-primary">
        {filterByPrefs ? 'Projects Matching My Preferences' : 'All Upcoming Projects'}
      </h2>


      {projects.length === 0 ? (
        <div className="text-secondary">No projects found</div>
      ) : (
        <div className="flex flex-col gap-4 mt-2">
          {projects.map((project) => (
            <ProjectCard project={project} key={project._id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ShowProjectList;