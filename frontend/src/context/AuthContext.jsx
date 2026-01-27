import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { logError } from '../lib/utils';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
console.log('Auth Context Initialized with API_URL:', API_URL);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const res = await axios.get(`${API_URL}/auth/me`);
            setUser(res.data);
        } catch (error) {
            logError("AuthContext/fetchUser", error);
            // Only logout if it's an authentication error (401)
            // Other errors might be temporary (500, network issues, etc.)
            if (error.response?.status === 401) {
                logout();
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await axios.post(`${API_URL}/auth/login`, { email, password });
        const { access_token, user } = res.data;

        // Set header immediately to avoid race conditions with navigation
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

        localStorage.setItem('token', access_token);
        setToken(access_token);
        setUser(user);
        return res.data;
    };

    const register = async (email, password, name) => {
        const res = await axios.post(`${API_URL}/auth/register`, { email, password, name });
        const { access_token, user } = res.data;

        // Set header immediately to avoid race conditions with navigation
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

        localStorage.setItem('token', access_token);
        setToken(access_token);
        setUser(user);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
