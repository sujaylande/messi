import { useState } from 'react';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reg_no, setRegNo] = useState('');
  const [roll_no, setRollNo] = useState('');
  const [password, setPassword] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/manager/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("manager-token")}`,
       },
      body: JSON.stringify({ name, email, reg_no, roll_no, password })
    });
    const data = await response.json();

    //if status code is 400 then alert the error message
    if(response.status === 201){
      alert(data.message);
    }else{
      alert(data.error)
    }

    // clear form
    setName('');
    setEmail('');
    setRegNo('');
    setRollNo('');
    setPassword('');
  };

  return (
    <div className='p-5 bg-white min-h-screen flex flex-col items-center justify-center'>
      <h2 className='text-2xl font-semibold mb-6'>Register Student</h2>
      <form onSubmit={handleSubmit} className='w-full max-w-md space-y-4'>
        <input className='w-full p-2 border rounded-lg' type='text' placeholder='Name' value={name} onChange={e => setName(e.target.value)} required />
        <input className='w-full p-2 border rounded-lg' type='email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} required />
        <input className='w-full p-2 border rounded-lg' type='text' placeholder='Mess reg_no' value={reg_no} onChange={e => setRegNo(e.target.value)} required />
        <input className='w-full p-2 border rounded-lg' type='text' placeholder='roll_no' value={roll_no} onChange={e => setRollNo(e.target.value)} required />
        <input className='w-full p-2 border rounded-lg' type='text' placeholder='password' value={password} onChange={e => setPassword(e.target.value)} required />
        <button className='w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600' type='submit'>Register</button>
      </form>
    </div>
  );
}

export default Register;