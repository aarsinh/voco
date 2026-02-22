import { useState } from "react";

interface AddEventProps {
  onAdd: (event: {
    name: string;
    ngo: string;
    date: string;
    address: string;
  }) => void;
  ngo: string;
}

function Addevent({ onAdd, ngo }: AddEventProps) {
  const [Eventname, setEventname] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!Eventname || !day || !address) {
      alert("Please add all details");
      return;
    }

    onAdd({
      name: Eventname,
      ngo: ngo,
      date: day,
      address: address
    });

    setEventname("");
    setDay("");
    setAddress("");
  }

  return (
    <form
      className="bg-gray-900 p-6 rounded-lg shadow-md max-w-xl mx-auto space-y-4"
      onSubmit={onSubmit}
    >
      <div className="flex flex-col">
        <label className="mb-1 text-sm text-gray-300">Event Name</label>
        <input
          className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-sky-400 outline-none"
          type="text"
          placeholder=""
          value={Eventname}
          onChange={(e) => setEventname(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm text-gray-300">Date</label>
        <input
          className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-sky-400 outline-none"
          type="date"
          placeholder="Add Date"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm text-gray-300">Address</label>
        <input
          className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-sky-400 outline-none"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>

      <input
        className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-md transition"
        type="submit"
        value="Save Event"
      />
    </form>
  );
}

export default Addevent;
