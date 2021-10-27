import { useContext, useEffect } from "react";
import AuthContext from "../../contexts/AuthContext";

const SignOut = () => {
  const { signOut } = useContext(AuthContext);
  useEffect(() => {
    signOut();
  }, []);

  return <div>Signing you out... </div>;
};

export default SignOut;
