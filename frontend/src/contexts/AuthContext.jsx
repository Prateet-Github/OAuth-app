import { createContext, useContext, useState, useEffect } from "react";
import API from "../api";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const res = await API.post("/auth/refresh_token");
        const { accessToken } = res.data;
        if (accessToken) {
          const decoded = jwtDecode(accessToken);
          setUser(decoded);
          API.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        }
      } catch {
        setUser(null);
      }
    };
    refreshAccessToken();
  }, []);

  const loginWithGoogle = async (credentialResponse) => {
    try {
      const res = await API.post("/auth/google", {
        idToken: credentialResponse.credential,
      });
      const { accessToken } = res.data;
      const decoded = jwtDecode(accessToken);
      setUser(decoded);
      API.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
      setUser(null);
      delete API.defaults.headers.common["Authorization"];
    } catch (err) {
      console.error("Logout error:", err);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};