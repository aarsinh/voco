import Header from "./Headers"
import Events from "./Events"
import type { EventType } from "./types"

interface OngoingEventsProps {
  events: EventType[]
  deleteEvent: (id: string) => void
}

function volunteerList() {
  return (
    <div className="bg-white max-w-5xl mx-auto shadow-[0_10px_40px_rgba(0,0,0,0.08)] mt-10 mb-8 min-h-75 border border-gray-100 p-8 rounded-xl overflow-auto">
      <Header />
      
        
    </div>
  )
}

export default volunteerList

