import { useEffect, useState, useContext } from "react";
import Router from "next/router";
import AuthContext from "../../contexts/AuthContext";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/useRequest";
import buildClient from "../../helper/build-client";

function OrderDetails({ order }) {
  const [timeLeft, setTimeLeft] = useState(0);

  const { user } = useContext(AuthContext);

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
  }, []);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  const amount = order.ticket.price * 100;

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51H3edbCCKwqv3ka1MTcHhRSy1R5MS5ag8GlepEYQUsdJlStjTEkNbT36qKtuZdIkmW0tiS97W6wQF6206olFEClE00grZLtX5C"
        amount={order.ticket.price * 100}
        email={user.email}
      />
      {errors}
    </div>
  );
}

OrderDetails.getInitialProps = async (context) => {
  const { orderId } = context.query;
  const client = buildClient();
  const { data } = await client.get(`/api/order/${orderId}`);

  return {
    order: data,
  };
};

export default OrderDetails;
