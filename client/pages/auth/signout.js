import { useContext, useEffect } from "react";
import AuthContext from "../../contexts/AuthContext";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignOut = () => {
  const router = useRouter();
  const { signOut } = useContext(AuthContext);
  useEffect(() => {
    toast.info("Good bye, hope see you soon");
    signOut(() => {
      setTimeout(() => {
        router.push("/");
      }, 3000);
    });
  }, []);

  return (
    <div>
      <ToastContainer />
    </div>
  );
};

export default SignOut;
