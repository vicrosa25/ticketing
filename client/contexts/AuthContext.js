import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState(null);
  const router = useRouter();

  useEffect(() => currentUser(), []);

  // Sign UP
  const signUp = async (user, onSuccess) => {
    const { email, password } = user;
    try {
      const { data } = await axios.post("/api/users/signup", {
        email,
        password,
      });
      setUser(data);
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      setErrors(error.response.data.errors);
    }
  };

  // Sign In
  const signIn = async ({ email, password }, onSuccess) => {
    try {
      const { data } = await axios.post("/api/users/signin", {
        email,
        password,
      });
      setUser(data);
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      setErrors(error.response.data.errors);
    }
  };

  // Sign Out
  const signOut = async (onSuccess) => {
    await axios.post("/api/users/signout");
    setUser(null);
    if (onSuccess) {
      onSuccess();
    }
    // router.push("/");
  };

  // Current User
  const currentUser = async (user) => {
    const { data } = await axios("/api/users/currentuser");
    setUser(data.currentUser);
    try {
    } catch (error) {
      setErrors(error.response.data.errors);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, errors, setErrors, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
