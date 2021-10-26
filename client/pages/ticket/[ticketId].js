import SingleProduct from "../../components/SingleProduct";

function TicketDetail({ ticket }) {
  return <SingleProduct product={ticket} />;
}

TicketDetail.getInitialProps = async (context, client) => {
  const tickeId = context.query.ticketId;

  const { data } = await client.get(`/api/tickets/${tickeId}`);

  return {
    ticket: data,
  };
};

export default TicketDetail;
