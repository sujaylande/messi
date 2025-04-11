import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { StudentDataContext } from '../context/StudentContext'
import { Link } from 'react-router-dom'


const StudentLogin = () => {

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const { student, setStudent } = React.useContext(StudentDataContext)
  const navigate = useNavigate()


  const submitHandler = async (e) => {
    e.preventDefault();
    const student = {
      email: email,
      password
    }

    const response = await axios.post("http://localhost:5001/api/student/login", student)


    if (response.status === 200) {
      const data = response.data

      setStudent(data.student)

      // localStorage.setItem('student-token', data.token)
      navigate('/student-public')

    } else {
      navigate('/')
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
                to="/manager/login"
                className="text-green-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Manager Login?
              </Link>
      </div>
    </div>
  )
}

export default StudentLogin