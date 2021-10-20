import Router from "next/router";
import Form from "./styles/Form";
import useForm from "../hooks/useForm";
import useRequest from "../hooks/use-request";
import DisplayError from "../components/DisplayError";

export default function SignIn() {
  // Hooks
  const { inputs, handleChange, resetForm } = useForm({
    email: "",
    password: "",
  });

  const { doRequest, error } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: {
      email: inputs.email,
      password: inputs.password,
    },
    onSuccess: () => Router.push("/"),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    doRequest();
    resetForm();
  };

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Sign Into Your Account</h2>
      <DisplayError error={error} />
      <fieldset>
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Sign In!</button>
      </fieldset>
    </Form>
  );
}
