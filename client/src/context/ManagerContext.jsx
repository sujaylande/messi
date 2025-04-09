import { createContext, useState, useContext } from 'react';

export const ManagerDataContext = createContext();

const ManagerContext = ({ children }) => {
    const [ manager, setManager ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    const updateCaptain = (ManagerData) => {
        setManager(ManagerData);
    };

    const value = {
        manager,
        setManager,
        isLoading,
        setIsLoading,
        error,
        setError,
        updateCaptain
    };

    return (
        <ManagerDataContext.Provider value={value}>
            {children}
        </ManagerDataContext.Provider>
    );
};

export default ManagerContext;