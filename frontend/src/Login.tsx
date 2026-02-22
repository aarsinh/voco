import React, { useState } from 'react';
import { RolePicker } from './components/RolePicker';
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [role, setRole] = useState<"volunteer" | "ngo">("volunteer")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const response = await fetch("http://localhost:8082/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ username, password, role })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      if (data.role === 'ngo') {
        localStorage.setItem('ngoId', data.id);
        localStorage.setItem('ngoName', data.name);
        navigate("/ngo");
      } else if (data.role === 'volunteer') {
        localStorage.setItem('volunteerId', data.id);
        navigate("/volunteer")
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <div className="h-screen flex items-center justify-center">
        <div className="rounded-lg w-full max-w-md border-2 overflow-hidden">
          <div className="bg-blue-500  p-3 text-white text-center text-2xl">
            <h2>Login</h2>
          </div>
          <div className='flex items-center justify-center pt-5'>
            <RolePicker role={role} setRole={setRole} />
          </div>
          <div className='px-4 pb-5'>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input placeholder="username" required className="border w-full px-4 py-2 rounded-md" onChange={(e) => { setUsername(e.target.value) }}></input>
              <input placeholder="password" required className="border w-full px-4 py-2 rounded-md" type='password' onChange={(e) => { setPassword(e.target.value) }}></input>
              <button className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-md w-full p-2 text-white" type='submit'>Sign In</button>
            </form>
            <div className="flex items-center justify-center gap-1 pt-2">
              <p>Don't have an account?</p>
              <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
