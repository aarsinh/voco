interface AddProjButtonProps {
  onAdd: () => void;
  showAddEvents: boolean;
}

function AddProjButton({ onAdd, showAddEvents }: Readonly<AddProjButtonProps>) {
  return (
    <button
      className="flex justify-center bg-blue-600 text-white px-10 py-5 rounded hover:bg-blue-700 transition"
      onClick={onAdd}
    >
      {showAddEvents ? "Close" : "Add Event"}
    </button>
  );
}

export default AddProjButton;
