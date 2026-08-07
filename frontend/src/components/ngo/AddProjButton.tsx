interface AddProjButtonProps {
  onAdd: () => void;
  showAddEvents: boolean;
}

function AddProjButton({ onAdd, showAddEvents }: Readonly<AddProjButtonProps>) {
  return (
    <button
      className="flex justify-center bg-primary font-semibold font-headline text-neutral-50 px-10 py-5 rounded hover:bg-secondary transition"
      onClick={onAdd}
    >
      {showAddEvents ? "Close" : "Add Event"}
    </button>
  );
}

export default AddProjButton;
