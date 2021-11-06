import buildClient from "../../helper/build-client";
import OrderStyles from "../../components/styles/OrderStyles";

function OrderIndex({ orders }) {
  let created;
  const orderList = orders.map((order) => {
    // Format the createAt date to spanish format
    created = new Date(order.createAt).toLocaleDateString("es-Es");
    return (
      <OrderStyles key={order.id}>
        <p>
          <span>Date: </span>
          <span>{created}</span>
        </p>
        <p>
          <span>Order id: </span>
          <span>{order.id}</span>
        </p>
        <p>
          <span>Order Status: </span>
          <span>{order.status}</span>
        </p>
        <div className="items">
          <div className="order-item">
            <img
              src={order.ticket.photos[0].secureUrl}
              alt={order.ticket.title}
            />
            <div className="item-details">
              <h2>{order.ticket.title}</h2>
              <p>Price: {order.ticket.price}€</p>
              <p>{order.ticket.description}</p>
            </div>
          </div>
        </div>
      </OrderStyles>
    );
  });

  return <div>{orderList}</div>;
}

export async function getServerSideProps({ req }) {
  const client = buildClient(req);
  const { data } = await client.get("/api/orders");

  const orders = data.filter((order) => order.status !== "Awaiting Payment");

  return {
    props: {
      orders,
    },
  };
}

export default OrderIndex;
