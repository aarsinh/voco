import { useState } from "react";

const TAGS = [
  "Education",
  "Environment",
  "Healthcare",
  "Elderly Care",
  "Animal Welfare"
];

interface AddEventProps {
  onAdd: (event: {
    name: string;
    ngo: string;
    date: Date;
    address: string;
    tags: string[];
  }) => void;
  ngo: string;
}

function Addevent({ onAdd, ngo }: Readonly<AddEventProps>) {
  const [Eventname, setEventname] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!Eventname || !day || !address) {
      alert("Please add all details");
      return;
    }

    if (selectedTags.length === 0) {
      alert("Please select at least one tag");
      return;
    }

    onAdd({
      name: Eventname,
      ngo: ngo,
      date: new Date(day),
      address: address,
      tags: selectedTags
    });

    setEventname("");
    setDay("");
    setAddress("");
    setSelectedTags([]);
  }

  return (
    <form
      className="bg-gray-900 p-6 rounded-lg shadow-md max-w-xl mx-auto space-y-4"
      onSubmit={onSubmit}
    >
      <div className="flex flex-col">
        <label className="mb-1 text-sm text-gray-300">
          Event Name
          <input
            className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-sky-400 outline-none"
            type="text"
            placeholder=""
            value={Eventname}
            onChange={(e) => setEventname(e.target.value)}
            required
            />
        </label>
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm text-gray-300">
          Date
          <input
            className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-sky-400 outline-none"
            type="date"
            placeholder="Add Date"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            required
            />
        </label>
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm text-gray-300">
          Address
          <input
            className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-sky-400 outline-none"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            />
        </label>
      </div>

      <div className="flex flex-col">
        <p className="mb-1 text-sm text-gray-300">Tags (select at least one)</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {TAGS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedTags.includes(tag)
                ? 'bg-sky-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              {tag}
            </button>
          ))}
        </div>
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
