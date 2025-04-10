import { createContext, useState, useContext } from 'react';

export const StudentDataContext = createContext();

const StudentContext = ({ children }) => {
    const [ student, setStudent ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    const updateStudent = (StudentData) => {
        setStudent(StudentData);
    };

    const value = {
        student,
        setStudent,
        isLoading,
        setIsLoading,
        error,
        setError,
        updateStudent
    };

    return (
        <StudentDataContext.Provider value={value}>
            {children}
        </StudentDataContext.Provider>
    );
};

export default StudentContext;