import React, { useContext, useEffect, useState } from 'react'
import { StudentDataContext } from '../context/StudentContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const StudentProtectWrapper = ({
    children
}) => {

    const token = localStorage.getItem('student-token')
    const navigate = useNavigate()
    const { student, setStudent } = useContext(StudentDataContext)
    const [ isLoading, setIsLoading ] = useState(true)

    useEffect(() => {
        if (!token) {
            navigate('/student/login')
        }

        axios.get("http://localhost:5001/api/student/profile", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {

                setStudent(response.data.captain)
                setIsLoading(false)
            }
        })
            .catch(err => {

                localStorage.removeItem('student-token')
                navigate('/student/login')
            })
    }, [ token ])

    

    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }



    return (
        <>
            {children}
        </>
    )
}

export default StudentProtectWrapper