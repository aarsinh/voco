import { useState } from "react"
import { RolePicker } from "./components/RolePicker"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "./hooks/useAuth"

export function Signup() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [role, setRole] = useState<"volunteer" | "ngo">("volunteer")
  const [form, setForm] = useState({
    username: "", password: "", name: "", email: "",
    phoneNumber: "", age: "", sex: "", website: ""
  })
  const [error, setError] = useState("")

  const commonFields = [
    { name: "username", placeholder: "Username", type: "text" },
    { name: "password", placeholder: "Password", type: "password" },
    { name: "name", placeholder: "Name", type: "text" },
    { name: "email", placeholder: "Email", type: "email" },
    { name: "phoneNumber", placeholder: "Phone Number", type: "text" }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("")

    try {
      await signup(form, role);
      navigate("/login")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="rounded-lg w-full max-w-md border-2 border-primary overflow-hidden bg-neutral-50 shadow-lg">
        <div className="bg-primary p-3 text-neutral-50 text-center text-2xl">
          <h2 className="font-headline font-semibold">Sign Up</h2>
        </div>
        <div className='flex items-center justify-center pt-5'>
          <RolePicker role={role} setRole={setRole} />
        </div>
        <div className='px-4 pb-5'>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {commonFields.map((field) => (
              <input key={field.name} name={field.name} className="outline outline-1 outline-secondary/30 border-2 border-tertiary shadow-sm focus:outline-2 focus:outline-primary focus:ring-0 w-full px-4 py-2 rounded-md bg-neutral-50 transition-all" required placeholder={field.placeholder} type={field.type} onChange={handleChange} />
            ))}

            {role === "volunteer" &&
              <>
                <input name="age" placeholder="Age" type="number" min={18} max={100} className="outline outline-1 outline-secondary/30 border-2 border-tertiary shadow-sm focus:outline-2 focus:outline-primary focus:ring-0 w-full px-4 py-2 rounded-md bg-neutral-50 transition-all" required onChange={handleChange} />
                <select className="outline outline-1 outline-secondary/30 border-2 border-tertiary shadow-sm focus:outline-2 focus:outline-primary focus:ring-0 w-full text-left px-4 py-2 rounded-md bg-neutral-50 transition-all" required name="sex" onChange={handleChange} value={form.sex}>
                  <option value="" disabled>Select Sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </>
            }

            {
              role === "ngo" &&
              <input 
                  type="text"
                  name="website"
                  placeholder="www.example.com" 
                  className="outline outline-1 outline-secondary/30 border-2 border-tertiary shadow-sm focus:outline-2 focus:outline-primary focus:ring-0 w-full px-4 py-2 rounded-md bg-neutral-50 transition-all"
                  required 
                  onChange={handleChange}
                  pattern="^(www\.)?([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-z]{2,}$"
                  title="Please enter a valid website address (e.g., www.example.com)"
                />
            }
            <button className="bg-primary hover:bg-secondary transition-colors rounded-md w-full p-2.5 text-neutral-50 font-semibold text-lg drop-shadow-md">Sign Up</button>
          </form>
          <div className="flex items-center justify-center gap-1 pt-2">
            <p>Already have an account?</p>
            <Link to="/login" className="text-primary hover:text-secondary font-semibold hover:underline">Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
