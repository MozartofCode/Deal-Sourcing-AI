import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Hardcoded dummy user to bypass authentication
    const [user, setUser] = useState({
        id: '00000000-0000-0000-0000-000000000000',
        email: 'guest@example.com',
        name: 'Guest User'
    });
    const [loading, setLoading] = useState(false);

    // No-op functions for login/register/logout since we are bypassing auth
    const login = async () => { };
    const register = async () => { };
    const logout = () => { };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
            loading,
            isAuthenticated: true // Always authenticated
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
