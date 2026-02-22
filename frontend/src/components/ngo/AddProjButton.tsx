interface AddProjButtonProps {
  onAdd: () => void;
  showAddEvents: boolean;
}

function AddProjButton({ onAdd, showAddEvents }: AddProjButtonProps) {
  return (
    <button
      className="flex justify-center bg-blue-600 text-white px-10 py-5 rounded hover:bg-blue-700 transition"
      onClick={onAdd}
    >
      {!showAddEvents ? "Add Event" : "Close"}
    </button>
  );
}

export default AddProjButton;
