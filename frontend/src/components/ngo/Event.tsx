import type { EventType } from "./types"
import Button from "./Button"
import { Link } from 'react-router-dom'
import axios from 'axios'

interface EventProps {
    event: EventType
    onDelete: (id: string) => void
}

function Event({ event, onDelete }: EventProps) {

    const changeStatus = async (newStatus: string) => {
        try{
            await axios.patch('http://localhost:8082/api/ngo/changeStatus', {
                projectId: event._id,
                status: newStatus
            });
            window.location.reload();
        } catch (err) {
            console.error('NGO Event Changestatus', err);
        }
    };

    return (
        <div className="bg-slate-900 m-1 px-5 py-2.5 cursor-pointer rounded-md hover:bg-slate-800 transition">
            <h3 className="flex justify-between items-center font-semibold text-white">
                {event.name}
                <Button
                    text="Terminate Project"
                    onClick={() => onDelete(event._id)}
                    className="text-white-500 hover:text-white-700 cursor-pointer transition-colors bg-red-500/50 px-4 py-2 rounded hover:bg-red-600 transition"
                />
            </h3>

            <p className="text-slate-300">
                Registrations: {event.registrations?.toLocaleString()}
            </p>

            <p className="text-slate-300">
                Date: {new Date(event.date).toLocaleDateString()}
            </p>

            <p className="text-slate-300">
                Address: {event.address}
            </p>

            <div className="flex items-center gap-2 mt-1">
                <span className="text-slate-300 text-sm">Status:</span>
                <select
                    value={event.status}
                    onChange={(e) => changeStatus(e.target.value)}
                    className="bg-slate-700 text-slate-200 border border-slate-600 rounded px-2 py-1 text-sm"
                >
                    <option value="pending">Not Started</option>
                    <option value="ongoing">Active</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            <Link to={'volunteerList/${event.id}'} className="hover:opacity-80">
            <p className="text-slate-300">
                Click to view volunteer details
            </p>
            </Link>
        </div>
    )
}

export default Event