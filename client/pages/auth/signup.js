import Router from "next/router";
import SignUp from "../../components/SignUp";

export default function signup() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const { doRequest, errors } = useRequest({
  //   url: "/api/users/signup",
  //   method: "post",
  //   body: {
  //     email,
  //     password,
  //   },
  //   onSuccess: () => Router.push("/"),
  // });

  // const onSubmit = async (event) => {
  //   event.preventDefault();
  //   doRequest();
  // };

  return (
    <SignUp />
    // <form onSubmit={onSubmit}>
    //   <h1>Sign Up</h1>
    //   <div className="form-group">
    //     <label htmlFor="">Email Address</label>
    //     <input
    //       value={email}
    //       className="form-control"
    //       onChange={(e) => setEmail(e.target.value)}
    //     />
    //   </div>
    //   <div>
    //     <label htmlFor="">Password</label>
    //     <input
    //       value={password}
    //       type="password"
    //       className="form-control"
    //       onChange={(e) => setPassword(e.target.value)}
    //     />
    //   </div>
    //   {errors}
    //   <button className="btn btn-primary">Sing Up</button>
    // </form>
  );
}
