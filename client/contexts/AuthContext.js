import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => currentUser(), []);

  // Sign UP
  const signUp = async (user) => {
    const { email, password } = user;
    try {
      const { data } = await axios.post("/api/users/signup", {
        email,
        password,
      });
      setUser(data);
      router.push("/");
    } catch (error) {
      setError(error);
    }
  };

  // Sign In
  const signIn = async ({ email, password }) => {
    try {
      const { data } = await axios.post("/api/users/signin", {
        email,
        password,
      });
      setUser(data);
      router.push("/");
    } catch (error) {
      setError(error);
    }
  };

  // Sign Out
  const signOut = async () => {
    await axios.post("/api/users/signout");
    setUser(null);
    router.push("/");
  };

  // Current User
  const currentUser = async (user) => {
    const { data } = await axios("/api/users/currentuser");
    setUser(data.currentUser);
    try {
    } catch (error) {}
  };

  return (
    <AuthContext.Provider value={{ user, error, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
