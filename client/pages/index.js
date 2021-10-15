import buildClient from "../helper/build-client";

const LandingPage = ({ currentUser }) => {
  console.log("From Landing page", currentUser);

  return currentUser ? (
    <h1>Your are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  console.log("Landing page");
  const client = buildClient(context);
  const { data } = await client.get("/api/users/currentuser");
  return data;
};

export default LandingPage;
