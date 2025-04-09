import React, { useContext, useEffect, useState } from 'react'
import { ManagerDataContext } from '../context/ManagerContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const ManagerProtectWrapper = ({
    children
}) => {

    const token = localStorage.getItem('manager-token')
    const navigate = useNavigate()
    const { manager, setManager } = useContext(ManagerDataContext)
    const [ isLoading, setIsLoading ] = useState(true)

    useEffect(() => {
        if (!token) {
            navigate('/manager/login')
        }

        axios.get("http://localhost:5000/api/manager/profile", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {

                setManager(response.data.captain)
                setIsLoading(false)
            }
        })
            .catch(err => {

                localStorage.removeItem('manager-token')
                navigate('/manager/login')
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

export default ManagerProtectWrapper