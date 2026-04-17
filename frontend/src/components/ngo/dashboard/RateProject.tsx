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

        axios.get(`${API}/api/ngo/projectRatings/${ngoId}`)
            .then(res => {
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

    let content;

    if (loading) {
        content = <p className="text-slate-500 text-sm">Loading...</p>;
    } else if (error) {
        content = <p className="text-slate-500 text-sm">{error}</p>;
    } else if (data.length === 0) {
        content = <p className="text-slate-500 text-sm">No ratings yet.</p>;
    } else {
        content = (
            <div className="flex-1 min-h-[250px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
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

                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1e293b',
                                borderColor: '#334155',
                                borderRadius: '0.5rem',
                                color: '#f8fafc'
                            }}
                            itemStyle={{ color: '#3b82f6' }}
                        />

                        <Line
                            type="monotone"
                            dataKey="rating"
                            name="Rating"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ fill: '#1e293b', stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }

    return (
        <div className="bg-slate-800 rounded-xl p-6 w-full h-full flex flex-col">
            <h2 className="text-sm uppercase tracking-widest text-slate-400 mb-5">
                Average Project Ratings
            </h2>

            {content}

        </div>
    );
}

export default ProjectRatingsBar;