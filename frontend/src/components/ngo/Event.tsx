import type { EventType } from "./types"
import Button from "./Button"

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
                {new Date(event.date).toLocaleDateString()}
            </p>
        </div>
    )
}

export default Event