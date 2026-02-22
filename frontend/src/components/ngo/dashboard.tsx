import Ongoing from "./Ongoing-Events";
import AddProjButton from "./AddProjButton";
import Addevent from "./AddEvent";
import { useState, useEffect } from "react";
import type { EventType } from "./types";

function App() {
  const ngoName: string = localStorage.getItem('ngoName') || 'Dummy NGO';

  const [events, setEvents] = useState<EventType[]>([]);
  const [showAddEvents, setShowAddEvent] = useState<boolean>(false);
  const ngoId = localStorage.getItem('ngoId') || '699972a0e5f9c4f5cba2a8f0'

  useEffect(() => {
    fetch(`http://localhost:8082/api/ngo/${ngoId}`)
      .then((res) => res.json())
      .then((data: EventType[]) => setEvents(data))
      .catch(err => console.error('failed to fetch events: ', err));
  }, [ngoId]);

  async function deleteEvent(id: string): Promise<void> {
    try {
      const res = await fetch(`http://localhost:8082/api/ngo/delProject`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ngoId: ngoId,
          projId: id
        })
      });
      if (res.ok) {
        setEvents(events.filter((event) => event._id !== id));
      }
      else {
        alert('Failed to delete, try again');
      }

    } catch (err) {
      console.error('Deleting event: ', err);
    }
  }

  async function addEvent(event: Omit<EventType, "_id">): Promise<void> {
    const res = await fetch(`http://localhost:8082/api/ngo/addProject/${ngoId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

    const data: EventType = await res.json();
    setEvents([...events, data]);
  }

  return (
    <div>
      <div className="flex justify-center pt-5">
        <AddProjButton
          onAdd={() => setShowAddEvent(!showAddEvents)}
          showAddEvents={showAddEvents}
        />
      </div>
      {showAddEvents &&
        <div className="pt-3">
          <Addevent onAdd={addEvent} ngo={ngoName} />
        </div>
      }
      <Ongoing events={events} deleteEvent={deleteEvent} />
    </div>
  );
}

export default App;
