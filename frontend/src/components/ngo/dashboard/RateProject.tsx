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
        content = <p className="text-secondary text-sm">Loading...</p>;
    } else if (error) {
        content = <p className="text-secondary text-sm">{error}</p>;
    } else if (data.length === 0) {
        content = <p className="text-secondary text-sm">No ratings yet.</p>;
    } else {
        content = (
            <div className="flex-1 min-h-[250px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
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
                            tickFormatter={(val) => Math.round(val).toString()}
                        />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--color-neutral-50)',
                                borderColor: 'var(--color-tertiary)',
                                borderRadius: '0.5rem',
                                color: 'var(--color-secondary)'
                            }}
                            itemStyle={{ color: 'var(--color-chart-sage)' }}
                        />

                        <Line
                            type="monotone"
                            dataKey="rating"
                            name="Rating"
                            stroke="var(--color-chart-sage)"
                            strokeWidth={3}
                            dot={{ fill: 'var(--color-neutral-50)', stroke: 'var(--color-chart-sage)', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, fill: 'var(--color-chart-sage)', stroke: 'var(--color-neutral-50)' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }

    return (
        <div className="bg-neutral-50 border border-tertiary shadow-sm rounded-xl p-6 w-full h-full flex flex-col">
            <h2 className="text-sm uppercase font-headline tracking-widest text-secondary mb-5">
                Average Project Ratings
            </h2>

            {content}

        </div>
    );
}

export default ProjectRatingsBar;