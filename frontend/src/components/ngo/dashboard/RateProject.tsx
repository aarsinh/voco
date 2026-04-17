import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth"; // Adjust path as needed
import {
    LineChart,
    Line,

    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface RatingData {
    count: number;
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
                    count: index + 1,
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
                        <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                            {/* Subtly colored grid lines */}
                            <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />

                            <XAxis
                                dataKey="count"
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => Math.round(val).toString()}
                            />

                            {/* Dark mode custom tooltip */}
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b', // slate-900 
                                    borderColor: '#334155',     // slate-700
                                    borderRadius: '0.5rem',
                                    color: '#f8fafc'            // slate-50
                                }}
                                itemStyle={{ color: '#3b82f6' }} // matching the blue slice
                            />

                            <Line
                                type="monotone"
                                dataKey="rating"
                                name="Rating"
                                stroke="#3b82f6" // Matches your "Pending" blue color
                                strokeWidth={3}
                                dot={{ fill: '#1e293b', stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

export default ProjectRatingsBar;