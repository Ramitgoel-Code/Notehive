import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const login = async (username, password) => {
        try {
            const { data } = await axios.post("/auth/login", { username, password });
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify({ username, role: data.role }));
            setUser({ username, role: data.role });
        } catch (error) {
            console.error("Login Failed:", error.response.data.message);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
