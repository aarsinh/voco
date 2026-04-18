import type { EventType } from "./types"
import Button from "./Button"
import { Link } from 'react-router-dom'
import axios from 'axios'

interface EventProps {
    readonly event: EventType
    readonly onDelete: (id: string) => void
}

function Event({ event, onDelete }: EventProps) {
    const API = import.meta.env.VITE_API_URL;

    const completeEvent = async () => {
        try {
            await axios.patch(`${API}/api/ngo/completeEvent`, {
                projectId: event._id,
            });
            globalThis.location.reload();
        } catch (err) {
            console.error('NGO Event completeEvent', err);
        }
    }

    const now = new Date();

    return (
        <div className="bg-primary m-2 px-6 py-5 cursor-pointer rounded-xl flex flex-col gap-1 hover:bg-secondary transition shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-headline font-bold text-2xl text-neutral-50 tracking-wide mt-1">
                    {event.name}
                </h3>
                <Button
                    text="Terminate Project"
                    onClick={() => onDelete(event._id)}
                    className="text-neutral-50 text-sm font-semibold cursor-pointer transition-colors bg-red-700/80 px-4 py-2 rounded hover:bg-red-800 transition mt-2 shadow-sm"
                />
            </div>

            <p className="text-neutral">
                Registrations: {event.registrations?.toLocaleString()}
            </p>

            <p className="text-neutral">
                {new Date(event.date).toLocaleDateString('en-GB')}
            </p>

            <p className="text-neutral">
                {event.address}
            </p>

            <Link to={`volunteerList/${event._id}`} className="hover:text-tertiary">
                <p className="text-neutral">
                    Click to view volunteer details
                </p>
            </Link>

            {/* Tags and Action Bar */}
            <div className="flex justify-between items-center mt-3 gap-4">

                {/* Tags (Left Aligned) */}
                <div className="flex flex-wrap justify-start gap-2">
                    {event.tags?.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-neutral-50/20 shadow-sm text-neutral-50 font-medium text-xs rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Action buttons and Status (Right Aligned) */}
                <div className="flex justify-end shrink-0">
                    {now > new Date(event.date) && event.status !== 'Completed' ?
                        (<Button
                            text="Complete Project"
                            onClick={() => completeEvent()}
                            className="text-primary font-semibold cursor-pointer transition-colors bg-tertiary px-2 py-2 rounded-lg hover:bg-[#D4C8B1] transition shadow-sm"
                        />) : (
                            <p className="text-neutral-50 opacity-90 font-semibold tracking-wide">
                                {event.status === 'Completed' ? '✓ Completed' : '• Not Started'}
                            </p>
                        )
                    }
                </div>
            </div>

        </div>
    )
}

export default Event
