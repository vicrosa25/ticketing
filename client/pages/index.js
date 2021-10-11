import axios from "axios";

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>Your are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

export async function getServerSideProps({ req }) {
  // console.log("Landing Page");
  // const { data } = await axios.get(
  //   "http://auth-srv:3000/api/users/currentuser",
  //   {
  //     headers: req.headers,
  //   }
  // );
  // return {
  //   props: { data },
  // };
  return {
    props: {},
  };
}

export default LandingPage;
