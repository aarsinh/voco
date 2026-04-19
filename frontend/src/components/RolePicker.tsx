import type React from "react"

type RolePickerProps = {
  role: "volunteer" | "ngo",
  setRole: React.Dispatch<React.SetStateAction<"volunteer" | "ngo">>
}

export function RolePicker({ role, setRole }: Readonly<RolePickerProps>) {
  return (
    <div className='flex mb-6 gap-4'>
      <button type='button' onClick={
        () => setRole("volunteer")
      } className={`min-w-30 py-2 rounded-lg border font-semibold transition-colors ${role === 'volunteer' ? "bg-primary border-tertiary text-neutral-50" : "bg-neutral-50 border-primary text-primary hover:bg-tertiary hover:text-primary"}`}>
        Volunteer
      </button>

      <button type='button' onClick={
        () => setRole("ngo")
      } className={`min-w-30 py-2 rounded-lg border font-semibold transition-colors ${role === 'ngo' ? "bg-primary border-tertiary text-neutral-50" : "bg-neutral-50 border-primary text-primary hover:bg-tertiary hover:text-primary"}`}>
        NGO
      </button>
    </div >
  )
}
