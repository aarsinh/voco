import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth";

interface TopProject {
    _id: string;
    name: string;
    registrations: number;
    date: string;
    status: string;
}

function TopProjectsList() {
    const API = import.meta.env.VITE_API_URL;
    const { userId: ngoId } = useAuth();
    const [projects, setProjects] = useState<TopProject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!ngoId) return;

        axios.get(`${API}/api/ngo/topProjects/${ngoId}`)
            .then(res => setProjects(res.data))
            .catch(err => console.error("Top projects fetch error", err))
            .finally(() => setLoading(false));
    }, [ngoId, API]);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    let content;
    if(loading) {
        content = <p className="text-secondary text-sm mt-4">Loading...</p>;
    } else if(projects.length === 0) {
        content = <p className="text-secondary text-sm mt-4">No projects found.</p>;
    } else {
        content = (
            <div className="flex flex-col gap-4 mt-2">
                {projects.map((proj, index) => (
                    <div
                        key={proj._id}
                        className="flex items-center justify-between p-3 rounded-lg bg-tertiary/10 border border-tertiary hover:bg-tertiary/20 transition-colors"
                    >
                        {/* Left Side: Rank, Name, Date */}
                        <div className="flex items-center gap-4">
                            <span className="text-xl font-bold text-tertiary w-6 text-center">
                                #{index + 1}
                            </span>
                            <div>
                                <h3 className="text-primary font-bold">{proj.name}</h3>
                                <p className="text-xs text-secondary">
                                    {formatDate(proj.date)} • {proj.status}
                                </p>
                            </div>
                        </div>

                        {/* Right Side: Volunteer Count */}
                        <div className="flex flex-col items-end">
                            <span className="text-lg font-semibold text-primary">
                                {proj.registrations}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-secondary">
                                Vols
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="bg-neutral-50 border border-tertiary shadow-sm rounded-xl p-6 w-full h-full flex flex-col">
            <h2 className="text-sm uppercase font-headline tracking-widest text-secondary mb-5">
                Top 5 Projects (By Turnout)
            </h2>

            {content}
        </div>
    );
}

export default TopProjectsList;