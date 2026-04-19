import Event from "./Event"
import type { EventType } from "./types"

interface EventsProps {
    readonly events: EventType[]
    readonly onDelete: (id: string) => void
}

function Events({ events, onDelete }: EventsProps) {
    return (
        <>
            {events.map((event) => (
                <Event
                    key={event._id}
                    event={event}
                    onDelete={onDelete}
                />
            ))}
        </>
    )
}

export default Events