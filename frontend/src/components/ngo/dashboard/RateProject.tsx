import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth"; // Adjust path as needed
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";

interface RatingData {
    name: string;
    rating: number;
}

function ProjectRatingsBar() {
    const API = import.meta.env.VITE_API_URL;
    const { userId: ngoId } = useAuth();
    const [data, setData] = useState<RatingData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!ngoId) return;

        // Make sure this matches the actual route you set up in Express
        axios.get(`${API}/api/ngo/projectRatings/${ngoId}`)
            .then(res => {
                // Transform your flat array [4.5, 3.2] into Recharts objects
                const formattedData = res.data.map((avg: number, index: number) => ({
                    name: `Proj ${index + 1}`,
                    // Round to 1 decimal place for cleaner display
                    rating: Number(avg.toFixed(1))
                }));
                setData(formattedData);
            })
            .catch(err => {
                console.error("projectRatings fetch error", err);
                setError("Failed to load rating data.");
            })
            .finally(() => setLoading(false));
    }, [ngoId, API]);

    return (
        <div className="bg-slate-800 rounded-xl p-6 w-full h-full flex flex-col">
            <h2 className="text-sm uppercase tracking-widest text-slate-400 mb-5">
                Average Project Ratings
            </h2>

            {loading ? (
                <p className="text-slate-500 text-sm">Loading...</p>
            ) : error ? (
                <p className="text-slate-500 text-sm">{error}</p>
            ) : data.length === 0 ? (
                <p className="text-slate-500 text-sm">No ratings yet.</p>
            ) : (
                <div className="flex-1 min-h-[250px] w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                            <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />

                            <XAxis
                                dataKey="name"
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            {/* Set domain to 0-5 since it's a 5-star rating system */}
                            <YAxis
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                domain={[0, 5]}
                                ticks={[0, 1, 2, 3, 4, 5]}
                            />

                            <Tooltip
                                cursor={{ fill: '#334155', opacity: 0.4 }} // Hover highlight on the background
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    borderColor: '#334155',
                                    borderRadius: '0.5rem',
                                    color: '#f8fafc'
                                }}
                                itemStyle={{ color: '#14b8a6' }} // Teal text in tooltip
                            />

                            {/* Teal colored bars with rounded top corners */}
                            <Bar
                                dataKey="rating"
                                name="Avg Rating"
                                radius={[4, 4, 0, 0]}
                                fill="#14b8a6"
                                isAnimationActive={true}
                                animationDuration={1000}
                            >
                                {/* Optional: Dim bars that have a very low score */}
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.rating < 3 ? '#64748b' : '#14b8a6'}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

export default ProjectRatingsBar;