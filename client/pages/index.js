import axios from "axios";
import Products from "../components/Products";
import buildClient from "../helper/build-client";

export default function LandingPage({ products }) {
  return <Products products={products} />;
}

export async function getStaticProps() {
  const client = buildClient();
  const { data } = await client.get("/api/tickets");
  return {
    props: { products: data },
  };
}
