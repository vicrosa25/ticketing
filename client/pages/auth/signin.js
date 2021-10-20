// import { useState } from "react";
// import Router from "next/router";
// import useRequest from "../../hooks/use-request";

// export default function Signin() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const { doRequest, errors } = useRequest({
//     url: "/api/users/signin",
//     method: "post",
//     body: {
//       email,
//       password,
//     },
//     onSuccess: () => Router.push("/"),
//   });

//   const onSubmit = async (event) => {
//     event.preventDefault();
//     doRequest();
//   };

//   return (
//     <form onSubmit={onSubmit}>
//       <h1>Sign In</h1>
//       <div className="form-group">
//         <label htmlFor="">Email Address</label>
//         <input
//           value={email}
//           className="form-control"
//           onChange={(e) => setEmail(e.target.value)}
//         />
//       </div>
//       <div>
//         <label htmlFor="">Password</label>
//         <input
//           value={password}
//           type="password"
//           className="form-control"
//           onChange={(e) => setPassword(e.target.value)}
//         />
//       </div>
//       {errors}
//       <button className="btn btn-primary">Sing In</button>
//     </form>
//   );
// }

import styled from "styled-components";
// import RequestReset from "../components/RequestReset";
import SignIn from "../../components/SignIn";
// import SignUp from '../components/SignUp';

const GridStyles = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 2rem;
`;

export default function SignInPage() {
  return (
    <GridStyles>
      <SignIn />
      {/* <SignUp /> */}
      {/* <RequestReset /> */}
    </GridStyles>
  );
}
