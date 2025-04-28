// import React, { useContext, useEffect, useState } from 'react'
// import { StudentDataContext } from '../context/StudentContext'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'

// const StudentProtectWrapper = ({
//     children
// }) => {

//     const token = localStorage.getItem('student-token')
//     const navigate = useNavigate()
//     const { student, setStudent } = useContext(StudentDataContext)
//     const [ isLoading, setIsLoading ] = useState(true)

//     useEffect(() => {
//         if (!token) {
//             navigate('/')
//         }

//         axios.get("http://localhost:5001/api/student/profile").then(response => {
//             if (response.status === 200) {

//                 setStudent(response.data.student)
//                 setIsLoading(false)
//             }
//         })
//             .catch(err => {

//                 // localStorage.removeItem('student-token')
//                 navigate('/')
//             })
//     }, [ token ])

//     if (isLoading) {
//         return (
//             <div>Loading...</div>
//         )
//     }

//     return (
//         <>
//             {children}
//         </>
//     )
// }

// export default StudentProtectWrapper

import React, { useContext, useEffect, useState } from 'react';
import { StudentDataContext } from '../context/StudentContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import studentAxios from '../api/studentAxios';

const StudentProtectWrapper = ({ children }) => {
  const navigate = useNavigate();
  const { student, setStudent } = useContext(StudentDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the student profile — the cookie will be sent automatically
    studentAxios.get("/profile", {
      withCredentials: true // Just in case axios.defaults.withCredentials isn't set
    })
      .then((response) => {
        if (response.status === 200 && response.data?.student) {
          setStudent(response.data.student);
        } else {
          navigate('/');
        }
      })
      .catch((err) => {
        console.error("Auth check failed:", err?.response?.data?.message || err.message);
        navigate('/');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default StudentProtectWrapper;
