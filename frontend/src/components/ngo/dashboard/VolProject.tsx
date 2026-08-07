import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

interface ChartData {
    count: number;
    volunteers: number;
}

function VolPerProject() {
    const API = import.meta.env.VITE_API_URL;
    const { userId: ngoId } = useAuth();
    const [data, setData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!ngoId) return;

        axios.get(`${API}/api/ngo/volPerProject/${ngoId}`)
            .then(res => {
                const formattedData = res.data.volNum.map((count: number, index: number) => ({
                    count: index + 1,
                    volunteers: count
                }));
                setData(formattedData);
            })
            .catch(err => {
                console.error("volPerProject fetch error", err);
                setError("Failed to load data.");
            })
            .finally(() => setLoading(false));
    }, [ngoId, API]);

    let content;
    if(loading) {
        content = <p className="text-secondary text-sm">Loading...</p>;
    } else if(error) {
        content = <p className="text-secondary text-sm">{error}</p>;
    } else if(data.length === 0) {
        content = <p className="text-secondary text-sm">No project data yet.</p>;
    } else {
        content = (
            <div className="flex-1 min-h-[250px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                        <CartesianGrid stroke="#9ca3af" strokeDasharray="3 3" vertical={false} strokeWidth={1.5} />

                        <XAxis
                            dataKey="count"
                            stroke="var(--color-secondary)"
                            tick={{ fill: 'var(--color-secondary)', fontWeight: 'bold', fontSize: 15 }}
                            tickLine={{ stroke: 'var(--color-secondary)', strokeWidth: 2 }}
                            axisLine={{ stroke: 'var(--color-secondary)', strokeWidth: 2 }}
                            dy={10}
                        />
                        
                        <YAxis
                            stroke="var(--color-secondary)"
                            tick={{ fill: 'var(--color-secondary)', fontWeight: 'bold', fontSize: 15 }}
                            tickLine={{ stroke: 'var(--color-secondary)', strokeWidth: 2 }}
                            axisLine={{ stroke: 'var(--color-secondary)', strokeWidth: 2 }}
                            domain={[0, 5]}
                            ticks={[0, 1, 2, 3, 4, 5]}
                        />

                        <Tooltip
                            cursor={{ fill: '#e5e7eb', opacity: 0.8 }}
                            contentStyle={{
                                backgroundColor: 'var(--color-neutral-50)',
                                borderColor: 'var(--color-tertiary)',
                                borderRadius: '0.5rem',
                                color: 'var(--color-secondary)'
                            }}
                            itemStyle={{ color: 'var(--color-primary)' }}
                        />

                        <Bar
                            dataKey="volunteers"
                            name="Volunteers"
                            radius={[4, 4, 0, 0]}
                            fill="var(--color-primary)"
                            isAnimationActive={true}
                            animationDuration={1000}
                        >
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    }

    return (
        <div className="bg-neutral-50 border border-tertiary shadow-sm rounded-xl p-6 w-full h-full flex flex-col">
            <h2 className="text-sm uppercase font-headline tracking-widest text-secondary mb-5">
                Volunteer Growth Over Time
            </h2>

            {content}
        </div>
    );
}

export default VolPerProject;