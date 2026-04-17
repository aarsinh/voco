import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth";

interface StatusCounts {
    Pending: number;
    Ongoing: number;
    Completed: number;
    Terminated: number;
}

const SLICES = [
    { key: "Pending", color: "#3b82f6" },
    { key: "Ongoing", color: "#e2f554" },
    { key: "Completed", color: "#64f55d" },
    { key: "Terminated", color: "#ef4444" },
] as const;

function PieChart({ counts }: { counts: StatusCounts }) {
    const total = SLICES.reduce((sum, s) => sum + (counts[s.key] || 0), 0);

    if (total === 0) {
        return <p className="text-slate-500 text-sm">No project data yet.</p>;
    }

    const activeSlices = SLICES.filter(s => (counts[s.key] || 0) > 0);

    let cumulative = 0;
    const stops = activeSlices.map(s => {
        const start = (cumulative / total) * 360;
        cumulative += counts[s.key] || 0;
        const end = (cumulative / total) * 360;
        return `${s.color} ${start}deg ${end}deg`;
    }).join(", ");

    return (
        <div className="flex items-center gap-8">
            <div
                className="rounded-full shrink-0"
                style={{
                    width: 160,
                    height: 160,
                    background: `conic-gradient(${stops})`,
                }}
            />
            <div className="flex flex-col gap-2">
                {activeSlices.map(s => (
                    <div key={s.key} className="flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
                        <span className="text-slate-300">{s.key}</span>
                        <span className="text-slate-500 ml-1">
                            {counts[s.key]} ({Math.round(((counts[s.key] || 0) / total) * 100)}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StatusPie() {
    const API = import.meta.env.VITE_API_URL;
    const { userId: ngoId } = useAuth();
    const [statusCounts, setStatusCounts] = useState<StatusCounts | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!ngoId) return;
        axios.get(`${API}/api/ngo/projectStatusPie/${ngoId}`)
            .then(res => setStatusCounts(res.data))
            .catch(err => console.error("projectStatusPie fetch error", err))
            .finally(() => setLoading(false));
    }, [ngoId]);

    return (
        <div className="bg-slate-800 rounded-xl p-6 w-fit">
            <h2 className="text-sm uppercase tracking-widest text-slate-400 mb-5">
                Project Status Breakdown
            </h2>
            {loading
                ? <p className="text-slate-500 text-sm">Loading...</p>
                : statusCounts
                    ? <PieChart counts={statusCounts} />
                    : <p className="text-slate-500 text-sm">Failed to load data.</p>
            }
        </div>
    );
}

export default StatusPie;