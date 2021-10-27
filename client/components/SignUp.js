import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import Router from "next/router";
import Link from "next/link";
import styled from "styled-components";
import useForm from "../hooks/useForm";
import DisplayError from "../components/DisplayError";
import Modal from "../components/Modal";
import LogingForm from "./styles/LoginForm";

export default function SignIn() {
  // Hooks
  const { inputs, handleChange, resetForm } = useForm({
    email: "",
    password: "",
  });

  const { email, password } = inputs;

  const { signUp, error } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    signUp({ email, password });
    resetForm();
  };

  return (
    <Modal show={true} onClose={() => Router.push("/")}>
      <LogingForm method="POST" onSubmit={handleSubmit}>
        <DisplayError error={error} />
        <input
          type="email"
          name="email"
          placeholder="Your Email Address"
          autoComplete="email"
          value={inputs.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="password"
          value={inputs.password}
          onChange={handleChange}
        />
        <button type="submit">Sign In!</button>
        <Text>
          <div>
            <span>DO YOU HAVE AN ACCOUNT?</span>
          </div>
          <Link href={"/auth/signin"}>
            <a>LOG IN</a>
          </Link>
        </Text>
      </LogingForm>
    </Modal>
  );
}

const Text = styled.div`
  display: flex;
  margin: 1rem;
  justify-content: space-space-between;
`;
