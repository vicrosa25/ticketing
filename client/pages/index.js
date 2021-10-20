import Link from "next/dist/client/link";
import Products from "../components/Products";

const LandingPage = ({ currentUser, tickets }) => {
  return <Products products={tickets} />;
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  // Fetching all the tickets
  const { data } = await client.get("/api/tickets");
  return { tickets: data };
};

export default LandingPage;
