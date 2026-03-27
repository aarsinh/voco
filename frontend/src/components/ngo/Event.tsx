import type { EventType } from "./types"
import Button from "./Button"
import { Link } from 'react-router-dom'

interface EventProps {
  event: EventType
  onDelete: (id: string) => void
}

function Event({ event, onDelete }: EventProps) {
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

      <Link to={`volunteers/${event._id}`} className="hover:opacity-80">
        <p className="text-slate-300">
          Click to view volunteer details
        </p>
      </Link>

      <div className="flex flex-wrap gap-2 mt-2">
        {event.tags?.map(tag => (
          <span key={tag} className="px-2 py-0.5 bg-sky-500/30 text-sky-300 text-xs rounded-full">
            {tag}
          </span>
        ))}
      </div>

    </div>
  )
}

export default Event
