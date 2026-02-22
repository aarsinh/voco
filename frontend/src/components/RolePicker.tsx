import type React from "react"

type RolePickerProps = {
  role: "volunteer" | "ngo",
  setRole: React.Dispatch<React.SetStateAction<"volunteer" | "ngo">>
}

export function RolePicker({ role, setRole }: RolePickerProps) {
  return (
    <>
      <div className='flex mb-6 gap-4'>
        <button type='button' onClick={
          () => setRole("volunteer")
        } className={`min-w-30 py-2 rounded-lg border ${role === 'volunteer' ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`}>
          volunteer
        </button>

        <button type='button' onClick={
          () => setRole("ngo")
        } className={`min-w-30 py-2 rounded-lg border ${role === 'ngo' ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`}>
          NGO
        </button>



      </div >
    </>
  )
}
