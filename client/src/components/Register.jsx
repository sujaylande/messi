// import { useState } from 'react';
// import axios from 'axios';
// axios.defaults.withCredentials = true;


// function Register() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [reg_no, setRegNo] = useState('');
//   const [roll_no, setRollNo] = useState('');
//   const [password, setPassword] = useState('');


//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const response = await axios.post('http://localhost:5000/api/manager/register', {
//       name,
//       email,
//       reg_no,
//       roll_no,
//       password,
//     });
  
//     const data = response.data;

//     //if status code is 400 then alert the error message
//     if(response.status === 201){
//       alert(data.message);
//     }else{
//       alert(data.error)
//     }

//     // clear form
//     setName('');
//     setEmail('');
//     setRegNo('');
//     setRollNo('');
//     setPassword('');
//   };

//   return (
//     <div className='p-5 bg-white min-h-screen flex flex-col items-center justify-center'>
//       <h2 className='text-2xl font-semibold mb-6'>Register Student</h2>
//       <form onSubmit={handleSubmit} className='w-full max-w-md space-y-4'>
//         <input className='w-full p-2 border rounded-lg' type='text' placeholder='Name' value={name} onChange={e => setName(e.target.value)} required />
//         <input className='w-full p-2 border rounded-lg' type='email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} required />
//         <input className='w-full p-2 border rounded-lg' type='text' placeholder='Mess reg_no' value={reg_no} onChange={e => setRegNo(e.target.value)} required />
//         <input className='w-full p-2 border rounded-lg' type='text' placeholder='roll_no' value={roll_no} onChange={e => setRollNo(e.target.value)} required />
//         <input className='w-full p-2 border rounded-lg' type='text' placeholder='password' value={password} onChange={e => setPassword(e.target.value)} required />
//         <button className='w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600' type='submit'>Register</button>
//       </form>
//     </div>
//   );
// }

// export default Register;




// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { io } from 'socket.io-client';

// axios.defaults.withCredentials = true;

// const socket = io('http://localhost:5000'); // Adjust this based on your deployment

// function Register() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [reg_no, setRegNo] = useState('');
//   const [roll_no, setRollNo] = useState('');
//   const [password, setPassword] = useState('');

//   const [registrationStatus, setRegistrationStatus] = useState(null);


//   useEffect(() => {
//     socket.on("connect", () => {
//       console.log("Connected to socket:", socket.id);
//     });
  
//     socket.on("registration-status", (data) => {
//       // console.log("📦 Received registration status from backend:", data);
//       setRegistrationStatus(data.status);
//       alert(`Registration ${data.status}`);
//     });
  
//     return () => {
//       socket.off("registration-status");
//     };
//   }, []);
  
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post('http://localhost:5000/api/manager/register', {
//         name,
//         email,
//         reg_no,
//         roll_no,
//         password,
//       });

//       const data = response.data;

//       if (response.status === 201) {
//         alert(data.message);
//       } else {
//         alert(data.error);
//       }

//     } catch (error) {
//       console.error("Registration failed:", error);
//       alert("Something went wrong!");
//     }

//     // Clear form
//     setName('');
//     setEmail('');
//     setRegNo('');
//     setRollNo('');
//     setPassword('');
//   };

//   return (
//     <div className='p-5 bg-white min-h-screen flex flex-col items-center justify-center'>
//       <h2 className='text-2xl font-semibold mb-6'>Register Student</h2>
//       <form onSubmit={handleSubmit} className='w-full max-w-md space-y-4'>
//         <input className='w-full p-2 border rounded-lg' type='text' placeholder='Name' value={name} onChange={e => setName(e.target.value)} required />
//         <input className='w-full p-2 border rounded-lg' type='email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} required />
//         <input className='w-full p-2 border rounded-lg' type='text' placeholder='Mess reg_no' value={reg_no} onChange={e => setRegNo(e.target.value)} required />
//         <input className='w-full p-2 border rounded-lg' type='text' placeholder='roll_no' value={roll_no} onChange={e => setRollNo(e.target.value)} required />
//         <input className='w-full p-2 border rounded-lg' type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} required />
//         <button className='w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600' type='submit'>Register</button>
//       </form>

//       {registrationStatus && (
//         <div className="mt-4 text-lg">
//           Status for Reg No <strong>{reg_no}</strong>: <span className={`font-bold ${registrationStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>{registrationStatus}</span>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Register;



"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { io } from "socket.io-client"
import managerAxios from '../api/managerAxios'

axios.defaults.withCredentials = true

const socket = io("http://localhost:5000") // Adjust this based on your deployment

function Register() {
  // Form input states
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [reg_no, setRegNo] = useState("")
  const [roll_no, setRollNo] = useState("")
  const [password, setPassword] = useState("")

  // UI state management
  const [step, setStep] = useState("form") // 'form', 'waiting', 'result'
  const [registrationStatus, setRegistrationStatus] = useState(null)

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id)
    })

    socket.on("registration-status", (data) => {
      setRegistrationStatus(data.status)
      setStep("result") // Move to result step when we get status
    })

    return () => {
      socket.off("registration-status")
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStep("waiting") // Show waiting message

    try {
      const response = await managerAxios.post("/register", {
        name,
        email,
        reg_no,
        roll_no,
        password,
      })

      // We don't need to handle the response here as the socket will update the status
      console.log("Registration submitted:", response.data)

      // Note: We don't clear the form here in case we need to retry
    } catch (error) {
      console.error("Registration failed:", error)
      setRegistrationStatus("fail")
      setStep("result") // Move to result step with failure status
    }
  }

  const resetForm = () => {
    setName("")
    setEmail("")
    setRegNo("")
    setRollNo("")
    setPassword("")
    setRegistrationStatus(null)
    setStep("form")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 transition-all duration-300">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {step === "form" && "Register Student"}
          {step === "waiting" && "Processing Registration"}
          {step === "result" && (registrationStatus === "success" ? "Registration Successful" : "Registration Failed")}
        </h2>

        {/* Registration Form */}
        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                type="text"
                placeholder="Registration Number"
                value={reg_no}
                onChange={(e) => setRegNo(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                type="text"
                placeholder="Roll Number"
                value={roll_no}
                onChange={(e) => setRollNo(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
              type="submit"
            >
              Register
            </button>
          </form>
        )}

        {/* Waiting Message */}
        {step === "waiting" && (
          <div className="text-center py-8">
            <div className="animate-pulse mb-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </div>
            </div>
            <p className="text-lg text-gray-700 mb-2">Please wait and smile</p>
            <p className="text-gray-500">Camera will start in a few seconds</p>
          </div>
        )}

        {/* Result View */}
        {step === "result" && (
          <div className="text-center py-4">
            <div
              className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
                registrationStatus === "success" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {registrationStatus === "success" ? (
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              ) : (
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              )}
            </div>

            <div className="mb-8">
              <h3
                className={`text-xl font-semibold mb-2 ${
                  registrationStatus === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                Registration {registrationStatus}
              </h3>
              <p className="text-gray-600">
                {registrationStatus === "success"
                  ? `Student ${name} has been registered successfully.`
                  : "There was a problem with the registration."}
              </p>
              {reg_no && (
                <p className="text-gray-500 mt-2">
                  Registration Number: <span className="font-medium">{reg_no}</span>
                </p>
              )}
            </div>

            <button
              onClick={resetForm}
              className={`px-6 py-2 rounded-lg font-medium transition-colors duration-300 ${
                registrationStatus === "success"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {registrationStatus === "success" ? "Register New Student" : "Try Again"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Register
