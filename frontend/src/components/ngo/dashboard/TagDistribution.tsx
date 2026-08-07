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
            .then(res => {
                const rawData: TagData[] = res.data;
                const totalProjects = rawData.reduce((sum, item) => sum + item.count, 0);

                if (totalProjects === 0) {
                    setData(rawData);
                    return;
                }

                const normalizedData = rawData.map(item => ({
                    subject: item.subject,
                    originalCount: item.count,
                    count: Math.round((item.count / totalProjects) * 100)
                }));

                setData(normalizedData);
            })
            .catch(err => {
                console.error("projectTags fetch error", err);
                setError("Failed to load category data.");
            })
            .finally(() => setLoading(false));
    }, [ngoId, API]);

    let content;
    if(loading) {
        content = <p className="text-secondary text-sm text-center mt-10">Loading...</p>;
    } else if(error) {
        content = <p className="text-secondary text-sm text-center mt-10">{error}</p>;
    } else if(data.length === 0) {
        content = <p className="text-secondary text-sm text-center mt-10">No tagged projects yet.</p>;
    } else {
        content = (
            <div className="flex-1 min-h-[250px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        {/* The spider web background grid */}
                        <PolarGrid stroke="#9ca3af" strokeWidth={2} />

                        {/* The text labels around the outside (Education, Health, etc) */}
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: 'var(--color-secondary)', fontWeight: 'bold', fontSize: 15 }}
                        />

                        {/* The internal rings (hiding the numbers so it looks cleaner) */}
                        <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />

                        {/* Dark Mode Tooltip */}
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--color-neutral-50)',
                                borderColor: 'var(--color-tertiary)',
                                borderRadius: '0.5rem',
                                color: 'var(--color-secondary)'
                            }}
                            itemStyle={{ color: 'var(--color-chart-gold)' }}
                        />

                        {/* The actual colored shape */}
                        <Radar
                            name="Projects"
                            dataKey="count"
                            stroke="var(--color-chart-gold)"
                            fill="var(--color-chart-gold)"
                            fillOpacity={0.5}
                            isAnimationActive={true}
                            animationDuration={1200}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        );
    }

    return (
        <div className="bg-neutral-50 border border-tertiary shadow-sm rounded-xl p-6 w-full h-full flex flex-col">
            <h2 className="text-sm uppercase font-headline tracking-widest text-secondary mb-5 text-center">
                Mission Balance
            </h2>

            {content}
        </div>
    );
}

export default ProjectDistributionRadar;