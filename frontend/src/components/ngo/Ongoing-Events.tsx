import Header from "./Headers"
import Events from "./Events"
import type { EventType } from "./types"

interface OngoingEventsProps {
  readonly events: EventType[]
  readonly deleteEvent: (id: string) => void
}

function OngoingEvents({ events, deleteEvent }: OngoingEventsProps) {
  return (
    <div className="bg-neutral-50 max-w-5xl mx-auto shadow-[0_10px_40px_rgba(0,0,0,0.08)] mt-10 mb-8 min-h-75 border border-tertiary p-8 rounded-xl overflow-auto">
      <Header title = "Ongoing Events"/>
      {events.length > 0 ? (
        <Events events={events} onDelete={deleteEvent} />
      ) : (
        <p className="text-center text-xl text-secondary">No Events</p>
      )}
    </div>
  )
}

export default OngoingEvents
