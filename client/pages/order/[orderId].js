import { useEffect, useState } from "react";
import buildClient from "../../helper/build-client";

function OrderDetails({ order }) {
  const [timeLeft, setTimeLeft] = useState(0);

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

  return <div>Time left to pay: {timeLeft} seconds</div>;
}

OrderDetails.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/order/${orderId}`);

  return {
    order: data,
  };
};

export default OrderDetails;
