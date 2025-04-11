import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ManagerDataContext } from '../context/ManagerContext'
import { Link } from 'react-router-dom'

const ManagerLogin = () => {

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const { manager, setManager } = React.useContext(ManagerDataContext)
  const navigate = useNavigate()



  const submitHandler = async (e) => {
    e.preventDefault();
    const manager = {
      email: email,
      password
    }

    const response = await axios.post("http://localhost:5000/api/manager/login", manager)

    if (response.status === 200) {
      const data = response.data

      setManager(data.manager)

      console.log(data.manager)

      // localStorage.setItem('manager-token', data.token)
      navigate('/homepage')

    } else {
      navigate('/manager-login')
    }

    setEmail('')
    setPassword('')
  }
  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <form onSubmit={(e) => {
          submitHandler(e)
        }}>
          <h3 className='text-lg font-medium mb-2'>What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            type="email"
            placeholder='email@example.com'
          />

          <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

          <input
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            required type="password"
            placeholder='password'
          />

          <button
            className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
          >Login</button>

        </form>
        <Link
                to="/student/login"
                className="text-green-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Student Login?
              </Link>
      </div>
    </div>
  )
}

export default ManagerLogin