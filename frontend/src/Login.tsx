import React, { useState } from 'react';
import { RolePicker } from './components/RolePicker';
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth';

export function Login() {
  const [role, setRole] = useState<"volunteer" | "ngo">("volunteer")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    try {
      await login(username, password, role);
      navigate(role === "ngo" ? "/ngo" : "/volunteer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="rounded-lg w-full max-w-md border-2 border-primary overflow-hidden bg-neutral-50 shadow-lg">
        <div className="bg-primary p-3 text-neutral-50 text-center text-2xl">
          <h2 className="font-headline font-semibold">Login</h2>
        </div>
        <div className='flex items-center justify-center pt-5'>
          <RolePicker role={role} setRole={setRole} />
        </div>
        <div className='px-4 pb-5'>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <input placeholder="username" required className="outline outline-1 outline-secondary/30 border-2 border-tertiary focus:outline-2 focus:outline-primary focus:ring-0 w-full px-4 py-2 rounded-md bg-neutral-50 shadow-sm transition-all" onChange={(e) => { setUsername(e.target.value) }}></input>
            <input placeholder="password" required className="outline outline-1 outline-secondary/30 border-2 border-tertiary focus:outline-2 focus:outline-primary focus:ring-0 w-full px-4 py-2 rounded-md bg-neutral-50 shadow-sm transition-all" type='password' onChange={(e) => { setPassword(e.target.value) }}></input>
            <button className="bg-primary hover:bg-secondary transition-colors rounded-md w-full p-2.5 text-neutral-50 font-semibold text-lg drop-shadow-md" type='submit'>Sign In</button>
          </form>
          <div className="flex items-center justify-center gap-1 pt-2">
            <p>Don't have an account?</p>
            <Link to="/signup" className="text-primary hover:text-secondary font-semibold hover:underline">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
