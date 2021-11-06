import { useEffect, useState, useContext } from "react";
import Router from "next/router";
import { useRouter } from "next/router";
import axios from "axios";
import AuthContext from "../../contexts/AuthContext";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/useRequest";
import buildClient from "../../helper/build-client";
import OrderStyles from "../../components/styles/OrderStyles";

function OrderDetails({ order }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  // Hooks
  const { doRequest, errors } = useRequest({
    url: "/api/payment",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push("/order"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      // Calculate the number of second left
      const msLeft = new Date(order.expireAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    // Call this function every second
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    // Stop the timer when you navegate away from this component
    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  // Cancel the order
  const handleCancel = async (e) => {
    await axios.delete(`/api/order/${order.id}`);
    router.push("/");
  };

  const amount = order.ticket.price * 100;

  return (
    <div>
      <OrderStyles>
        Time left to pay: {timeLeft} seconds
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
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51H3edbCCKwqv3ka1MTcHhRSy1R5MS5ag8GlepEYQUsdJlStjTEkNbT36qKtuZdIkmW0tiS97W6wQF6206olFEClE00grZLtX5C"
        amount={order.ticket.price * 100}
        email={user.email}
      />
      <button onClick={handleCancel}>Cancel</button>
      {errors}
    </div>
  );
}

export async function getServerSideProps({ req, params }) {
  const client = buildClient(req);
  const { data: order } = await client.get(`/api/order/${params.orderId}`);
  return {
    props: {
      order,
    },
  };
}

export default OrderDetails;
