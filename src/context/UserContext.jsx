import { createContext, useState, useEffect } from "react";
import api from "../utils/axios";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]); // <-- add this
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/users/me"); // fetch current user
        setUser(res.data);

        // if your API returns cart with user
        setCart(res.data.cart || []);
      } catch (err) {
        console.error("USER FETCH ERROR:", err);
        localStorage.removeItem("token");
        setToken("");
        setUser(null);
        setCart([]);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [token]);

  const login = (tokenValue, userData) => {
    localStorage.setItem("token", tokenValue);
    setToken(tokenValue);
    setUser(userData);
    setCart(userData.cart || []); // <-- add cart on login
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setCart([]); // <-- reset cart on logout
    window.location.href = "/login";
  };

  return (
    <UserContext.Provider value={{ user, setUser, cart, setCart, token, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}
