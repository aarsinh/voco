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

    const completeEvent = async() => {
        try{
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
                Date: {new Date(event.date).toLocaleDateString('en-GB')}
            </p>

            <p className="text-slate-300">
                Address: {event.address}
            </p>

            <Link to={`volunteerList/${event._id}`} className="hover:opacity-80">
            <p className="text-slate-300">
                Click to view volunteer details
            </p>
            </Link>
        
          <div className="flex flex-wrap justify-between gap-2 mt-1">
            {event.tags?.map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-sky-500/30 text-sky-300 text-sm rounded-full">
                {tag}
              </span>
            ))}

            {now > new Date(event.date) && event.status !== 'Completed' ?
                (<Button
                    text="Complete Project"
                    onClick={() => completeEvent()}
                    className="text-white hover:text-white-700 cursor-pointer transition-colors bg-green-500/50 px-4 py-2 rounded hover:bg-green-600 transition"
                />) : (
                    <p className="text-slate-300">
                        {event.status === 'Completed' ? 'Completed' : 'Not Started'}
                    </p>
                )
            }
          </div>

        </div>
    )
}

export default Event
