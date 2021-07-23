import axios from "axios";

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>Your are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

export async function getServerSideProps({ req }) {
  const { data } = await axios.get(
    "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
    {
      headers: req.headers,
    }
  );
  return {
    props: data,
  };
}

export default LandingPage;
