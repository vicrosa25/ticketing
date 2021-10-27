import buildClient from "../../helper/build-client";

function OrderIndex({ orders }) {
  return (
    <div>
      <ul>
        {orders.map((order) => {
          return (
            <li key={order.id}>
              {order.ticket.title} - {order.ticket.price}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const client = buildClient(req);
  const response = await client.get("/api/orders");

  return {
    props: {
      orders: response.data,
    },
  };
}

export default OrderIndex;
