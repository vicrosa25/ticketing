import Router from "next/router";
import Link from "next/link";
import styled from "styled-components";
import useForm from "../hooks/useForm";
import useRequest from "../hooks/use-request";
import DisplayError from "../components/DisplayError";
import Modal from "../components/Modal";

export default function SignIn() {
  // Hooks
  const { inputs, handleChange, resetForm } = useForm({
    email: "",
    password: "",
  });
  const { email, password } = inputs;
  const { doRequest, error } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    doRequest();
    resetForm();
  };

  return (
    <Modal show={true} onClose={() => Router.push("/")}>
      <form method="POST" onSubmit={handleSubmit}>
        <DisplayError error={error} />
        <Input
          type="email"
          name="email"
          placeholder="EMAIL"
          autoComplete="email"
          value={inputs.email}
          onChange={handleChange}
        />
        <Input
          type="password"
          name="password"
          placeholder="PASSWORD"
          autoComplete="password"
          value={inputs.password}
          onChange={handleChange}
        />
        <Button type="submit">LOG IN</Button>
        <Text>
          <div>
            <Span>DON'T HAVE AN ACCOUNT?</Span>
          </div>
          <Link href={"/auth/signup"}>
            <A> SING UP</A>
          </Link>
        </Text>
      </form>
    </Modal>
  );
}

const Input = styled.input`
  display: flex;
  flex-direction: column;
  border: 1px solid #3a3939;
  padding: 1rem 0.7rem;
  margin-bottom: 2rem;
  width: 100%;
  outline: 0;
  &:focus {
    outline: 0;
    border-color: var(--red);
  }
`;

const Button = styled.button`
  width: 100%;
  background: red;
  color: white;
  font-size: 2rem;
  font-weight: 600;
  padding: 0.5rem 1.2rem;
  margin-bottom: 5rem;
`;
const Text = styled.div`
  display: flex;
  margin: 1rem;
  justify-content: space-space-between;
`;

const Span = styled.span`
  color: #757474;
  margin-right: 10px;
`;

const A = styled.a`
  text-decoration: none;
  color: #000000;
`;
