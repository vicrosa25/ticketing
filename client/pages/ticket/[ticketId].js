import Router from "next/router";
import useRequest from "../../hooks/use-request";

function TicketDetail({ ticket }) {
  // Hook
  const { doRequest, errors } = useRequest({
    url: "/api/order",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => Router.push("/order/[orderId]", `/order/${order.id}`),
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <button onClick={() => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
}

TicketDetail.getInitialProps = async (context, client) => {
  const tickeId = context.query.ticketId;

  const { data } = await client.get(`/api/tickets/${tickeId}`);

  return {
    ticket: data,
  };
};

export default TicketDetail;
