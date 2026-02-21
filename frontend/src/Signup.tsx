import { useState } from "react"
import { RolePicker } from "./components/RolePicker"
import { Link } from "react-router-dom"

export function Signup() {
  const [role, setRole] = useState<"volunteer" | "ngo">("volunteer")
  const [form, setForm] = useState({
    username: "", password: "", name: "", email: "",
    phoneNumber: "", age: "", sex: "", website: ""
  })

  const commonFields = [
    { name: "username", placeholder: "Username", type: "text" },
    { name: "password", placeholder: "Password", type: "password" },
    { name: "name", placeholder: "Name", type: "text" },
    { name: "email", placeholder: "Email", type: "email" },
    { name: "phoneNumber", placeholder: "Phone Number", type: "text" }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const response = await fetch("http://localhost:8082/api/auth/signup", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      })
    } catch {

    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="rounded-lg w-full max-w-md border-2 overflow-hidden">
        <div className="bg-blue-500  p-3 text-white text-center text-2xl">
          <h2>Sign Up</h2>
        </div>
        <div className='flex items-center justify-center pt-5'>
          <RolePicker role={role} setRole={setRole} />
        </div>
        <div className='px-4 pb-5'>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {commonFields.map((field) => (
              <input key={field.name} className="border w-full px-4 py-2 rounded-md" required placeholder={field.placeholder} type={field.type} onChange={handleChange} />
            ))}

            {role === "volunteer" &&
              <>
                <input placeholder="Age" type="number" min={18} max={100} className="border w-full px-4 py-2 rounded-md" required onChange={handleChange} />
                <select className="border w-full text-left px-4 py-2 rounded-md" required onChange={handleChange}>
                  <option value="">Select Sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </select>
              </>
            }

            {
              role === "ngo" &&
              <>
                <input placeholder="Website" className="border w-full px-4 py-2 rounded-md" type="url" required onChange={handleChange} />
              </>
            }
            <button className="bg-blue-500 rounded-md w-full p-2 text-white">Sign Up</button>
          </form>
          <div className="flex items-center justify-center gap-1 pt-2">
            <p>Already have an account?</p>
            <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
