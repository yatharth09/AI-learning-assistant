import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if(!context){
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context
}


export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null)
    const [email, setEmail] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [notif, setNotif] = useState([])


    const handleNotification = (notification) => {
        setNotif((prev) => {
        const updated = [...prev, notification];

        // keep only last 10 (FIFO: remove from start)
        if (updated.length > 10) {
        updated.shift();
        }

        return updated;
    });
    };


    useEffect(() => {
        checkAuthStatus()
    }, [])

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token')
            const userStr = localStorage.getItem('user')
            const email = localStorage.getItem('email')

            if(token && user){
                const userData = userStr
                setEmail(email)
                setUser(userData)
                setIsAuthenticated(true)
            }
        } catch (error) {
            console.error("Auth check failed", error)
            logout()
        }finally{
            setLoading(false)
        }
    }

    const login = (userData, token, email) => {
        localStorage.setItem('token', token)
        localStorage.setItem('user',userData)
        localStorage.setItem('email', email)

        setUser(userData)
        setEmail(email)
        setIsAuthenticated(true)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        setUser(null)
        setIsAuthenticated(false)
        window.location.href = '/'
    }

    const updateUser = (updatedUserData) => {
        const newUserData = {...user, ...updatedUserData}
        localStorage.setItem('user', newUserData)

        setUser(newUserData)
    }

    const value = {
        user,
        notif,
        handleNotification,
        email,
        loading,
        isAuthenticated,
        updateUser,
        login,
        logout,
        checkAuthStatus
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}