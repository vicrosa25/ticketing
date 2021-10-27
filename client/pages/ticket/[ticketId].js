import buildClient from "../../helper/build-client";
import SingleProduct from "../../components/SingleProduct";

function TicketDetail({ ticket }) {
  return <SingleProduct product={ticket} />;
}

export async function getStaticProps({ params }) {
  const client = buildClient();
  const response = await client.get(`/api/tickets/${params.ticketId}`);

  return {
    props: {
      ticket: response.data,
    },
  };
}

export async function getStaticPaths() {
  const client = buildClient();
  const response = await client.get("/api/tickets");

  const ids = response.data.map((product) => product.id.toString());
  const pathsWithParams = ids.map((id) => ({ params: { ticketId: id } }));

  return {
    paths: pathsWithParams,
    fallback: false,
  };
}

export default TicketDetail;
