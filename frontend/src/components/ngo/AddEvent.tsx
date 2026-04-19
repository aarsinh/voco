import { useState } from "react";
import Header from "./Headers";

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
    <div className="bg-neutral-50 max-w-3xl mx-auto shadow-[0_10px_40px_rgba(0,0,0,0.08)] mt-10 mb-8 border border-tertiary p-10 rounded-xl min-h-[450px]">
      <Header title="Create a project" />
      <form
        className="bg-primary p-8 rounded-lg shadow-md max-w-2xl mx-auto space-y-5 mt-4"
        onSubmit={onSubmit}
      >
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-semibold text-neutral-50">
            {"Event Name"}
            <input
              className="w-full p-2 rounded-md bg-neutral-50 border border-tertiary text-primary focus:ring-2 focus:ring-tertiary outline-none mt-1"
              type="text"
              placeholder=""
              value={Eventname}
              onChange={(e) => setEventname(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-semibold text-neutral-50">
            {"Date"}
            <input
              className="w-full p-2 rounded-md bg-neutral-50 border border-tertiary text-primary focus:ring-2 focus:ring-tertiary outline-none mt-1"
              type="date"
              placeholder="Add Date"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-semibold text-neutral-50">
            {"Address"}
            <input
              className="w-full p-2 rounded-md bg-neutral-50 border border-tertiary text-primary focus:ring-2 focus:ring-tertiary outline-none mt-1"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="flex flex-col">
          <p className="mb-1 text-sm font-semibold text-neutral-50">Tags (select at least one)</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {TAGS.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedTags.includes(tag)
                  ? 'bg-tertiary text-primary font-bold'
                  : 'bg-neutral/20 text-neutral-50 hover:bg-secondary'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <input
          className="w-full bg-tertiary hover:bg-secondary text-primary hover:text-neutral-50 font-bold py-2 rounded-md transition cursor-pointer"
          type="submit"
          value="Save Event"
        />
      </form>
    </div>
  );
}

export default Addevent;
