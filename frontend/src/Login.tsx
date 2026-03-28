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
      <div className="rounded-lg w-full max-w-md border-2 overflow-hidden">
        <div className="bg-gray-800  p-3 text-white text-center text-2xl">
          <h2>Login</h2>
        </div>
        <div className='flex items-center justify-center pt-5'>
          <RolePicker role={role} setRole={setRole} />
        </div>
        <div className='px-4 pb-5'>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <input placeholder="username" required className="border w-full px-4 py-2 rounded-md" onChange={(e) => { setUsername(e.target.value) }}></input>
            <input placeholder="password" required className="border w-full px-4 py-2 rounded-md" type='password' onChange={(e) => { setPassword(e.target.value) }}></input>
            <button className="bg-gray-800 rounded-md w-full p-2 text-white" type='submit'>Sign In</button>
          </form>
          <div className="flex items-center justify-center gap-1 pt-2">
            <p>Don't have an account?</p>
            <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
