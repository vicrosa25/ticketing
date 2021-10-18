import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";

function OrderDetails({ order, price, currentUser }) {
  const [timeLeft, setTimeLeft] = useState(0);

  // Hooks
  const { doRequest, errors } = useRequest({
    url: "/api/payment",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => console.log(payment),
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

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51H3edbCCKwqv3ka1MTcHhRSy1R5MS5ag8GlepEYQUsdJlStjTEkNbT36qKtuZdIkmW0tiS97W6wQF6206olFEClE00grZLtX5C"
        amount={price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
}

OrderDetails.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const response = await client.get(`/api/order/${orderId}`);
  const order = response.data;

  const { data } = await client.get(`/api/tickets/${order.ticketid}`);
  const price = data.price;

  return {
    order,
    price,
  };
};

export default OrderDetails;
