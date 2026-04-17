import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth"; // Adjust path as needed
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip
} from "recharts";

// 1. Maintain your exact interface
interface StatusCounts {
    Pending: number;
    Ongoing: number;
    Completed: number;
    Terminated: number;
}

// 2. Transformed the SLICES list to include colors directly
const SLICES_CONFIG = [
    { key: "Pending", color: "#3b82f6" },
    { key: "Ongoing", color: "#e2f554" },
    { key: "Completed", color: "#64f55d" },
    { key: "Terminated", color: "#ef4444" },
] as const;

// Internal type for Recharts data structure
interface FormattedSlice {
    name: string;
    value: number;
    fill: string;
    percentage: number;
}

function StatusPie() {
    const API = import.meta.env.VITE_API_URL;
    const { userId: ngoId } = useAuth();
    const [rawCounts, setRawCounts] = useState<StatusCounts | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!ngoId) return;
        axios.get(`${API}/api/ngo/projectStatusPie/${ngoId}`)
            .then(res => setRawCounts(res.data))
            .catch(err => console.error("projectStatusPie fetch error", err))
            .finally(() => setLoading(false));
    }, [ngoId, API]);

    // Data Transformation: Turn the counts object into an array for Recharts
    const processData = (counts: StatusCounts | null): FormattedSlice[] => {
        if (!counts) return [];
        const total = SLICES_CONFIG.reduce((sum, s) => sum + (counts[s.key] || 0), 0);
        if (total === 0) return [];

        return SLICES_CONFIG
            // Only include slices with values > 0
            .filter(s => (counts[s.key] || 0) > 0)
            .map(s => {
                const value = counts[s.key] || 0;
                return {
                    name: s.key,
                    value: value,
                    fill: s.color,
                    percentage: Math.round((value / total) * 100)
                };
            });
    };

    const data = processData(rawCounts);

    return (
        <div className="bg-slate-800 rounded-xl p-6 w-full h-full flex flex-col">
            <h2 className="text-sm uppercase tracking-widest text-slate-400 mb-5">
                Project Status Breakdown
            </h2>

            {loading ? (
                <p className="text-slate-500 text-sm">Loading...</p>
            ) : data.length === 0 ? (
                <p className="text-slate-500 text-sm">No project data yet.</p>
            ) : (
                <div className="flex items-center gap-10 mt-2">
                    {/* Left: Animated Pie Chart */}
                    <div className="w-40 h-40 shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                <Pie
                                    data={data}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    // Set innerRadius to give it that 'central void' donut style
                                    innerRadius={60}
                                    paddingAngle={2} // Subtly separates segments
                                    isAnimationActive={true} // FANS OUT THE SLICES!
                                    animationDuration={1000} // Fast but visible growth
                                    animationEasing="ease-out"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                                    ))}
                                </Pie>

                                {/* Matches the dark tooltip theme from the line chart */}
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        borderColor: '#334155',
                                        borderRadius: '0.5rem',
                                        color: '#f8fafc',
                                        fontSize: '12px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Right: Recreating your exact Legend style */}
                    <div className="flex flex-col gap-3">
                        {data.map(slice => (
                            <div key={slice.name} className="flex items-center gap-2 text-sm">
                                <span
                                    className="w-3 h-3 rounded-full shrink-0"
                                    style={{ background: slice.fill }}
                                />
                                <span className="text-slate-300 font-medium">{slice.name}</span>
                                <span className="text-slate-500 ml-1">
                                    {slice.value} ({slice.percentage}%)
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default StatusPie;