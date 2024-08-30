import { createContext, useState } from 'react';


export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <ContextStore.Provider value={{ user, setUser }}>
            {children}
        </ContextStore.Provider>
    );
};



export const ContextStore = createContext();
