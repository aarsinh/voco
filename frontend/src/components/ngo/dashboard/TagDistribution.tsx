import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip
} from "recharts";

interface TagData {
    subject: string;
    count: number;
}

function ProjectDistributionRadar() {
    const API = import.meta.env.VITE_API_URL;
    const { userId: ngoId } = useAuth();
    const [data, setData] = useState<TagData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!ngoId) return;

        axios.get(`${API}/api/ngo/projectTags/${ngoId}`)
            .then(res => setData(res.data))
            .catch(err => {
                console.error("projectTags fetch error", err);
                setError("Failed to load category data.");
            })
            .finally(() => setLoading(false));
    }, [ngoId, API]);

    return (
        <div className="bg-slate-800 rounded-xl p-6 w-full h-full flex flex-col">
            <h2 className="text-sm uppercase tracking-widest text-slate-400 mb-5 text-center">
                Mission Balance
            </h2>

            {loading ? (
                <p className="text-slate-500 text-sm text-center mt-10">Loading...</p>
            ) : error ? (
                <p className="text-slate-500 text-sm text-center mt-10">{error}</p>
            ) : data.length === 0 ? (
                <p className="text-slate-500 text-sm text-center mt-10">No tagged projects yet.</p>
            ) : (
                <div className="flex-1 min-h-[250px] w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                            {/* The spider web background grid */}
                            <PolarGrid stroke="#334155" />

                            {/* The text labels around the outside (Education, Health, etc) */}
                            <PolarAngleAxis
                                dataKey="subject"
                                tick={{ fill: '#cbd5e1', fontSize: 12 }}
                            />

                            {/* The internal rings (hiding the numbers so it looks cleaner) */}
                            <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />

                            {/* Dark Mode Tooltip */}
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    borderColor: '#334155',
                                    borderRadius: '0.5rem',
                                    color: '#f8fafc'
                                }}
                                itemStyle={{ color: '#8b5cf6' }}
                            />

                            {/* The actual colored shape */}
                            <Radar
                                name="Projects"
                                dataKey="count"
                                stroke="#8b5cf6" // Violet-500
                                fill="#8b5cf6"
                                fillOpacity={0.5}
                                isAnimationActive={true}
                                animationDuration={1200}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

export default ProjectDistributionRadar;