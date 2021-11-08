import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import Router from "next/router";
import styled from "styled-components";
import Modal from "../components/Modal";
import LogingForm from "./styles/LoginForm";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setSignIn] = useState(true);
  const { signUp, signIn, errors, setErrors } = useContext(AuthContext);

  useEffect(() => {
    let loginErrors = null;
    if (errors) {
      loginErrors = errors;
      loginErrors.forEach((error) => toast.error(error.message));
    }
    return () => {
      setErrors(null);
    };
  });

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();
    try {
      await signUp({ email, password }, () => {
        toast.success("Your account has been created !!!");
        setTimeout(() => {
          Router.push("/");
        }, 1000);
      });
    } catch (error) {}
  };

  const handleSignInSubmit = async (event) => {
    event.preventDefault();
    await signIn({ email, password }, () => {
      toast.success("Your are now login");
      setTimeout(() => {
        Router.push("/");
      }, 1000);
    });
  };

  return (
    <Modal show={true} onClose={() => Router.push("/")}>
      <ToastContainer />
      {isSignIn && (
        <LogingForm method="POST" onSubmit={handleSignInSubmit}>
          <input
            type="text"
            name="email"
            placeholder="Your Email Address"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign In</button>
        </LogingForm>
      )}
      {!isSignIn && (
        <LogingForm method="POST" onSubmit={handleSignUpSubmit}>
          <input
            type="text"
            name="email"
            placeholder="Your Email Address"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign Up</button>
        </LogingForm>
      )}
      <Text>
        <div>
          <span>
            {isSignIn
              ? "DON'T HAVE AN ACCOUNT?  "
              : "DO YOU HAVE AN ACCOUNT?  "}
          </span>
          <LoginButton onClick={() => setSignIn(!isSignIn)}>
            {isSignIn ? "Sign Up" : "Sign In"}
          </LoginButton>
        </div>
      </Text>
    </Modal>
  );
}

const Text = styled.div`
  display: flex;
  margin: 1rem;
  justify-content: space-between;
`;

const LoginButton = styled.button`
  background: none;
  border: none;
  margin: 0;
  padding-left: 10px;
  cursor: pointer;
`;
