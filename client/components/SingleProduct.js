import Router from "next/router";
import { useState, useContext } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import styled from "styled-components";
import AuthContext from "../contexts/AuthContext";
import Slider from "../components/Slider";
import useRequest from "../hooks/useRequest";
import ChatProduct from "./ChatProduct";
import SickButton from "../components/styles/SickButton";

export default function SingleProduct({ product }) {
  // SWR fetching the Seller
  const { data, error } = useSWR(`/api/users/${product.userId}`);

  // Get the Buyer
  const { user } = useContext(AuthContext);

  // Hooks
  const [showChat, setShowChat] = useState(false);
  const router = useRouter();

  // Custom Hook to make Requests - Create a new order
  const { doRequest, errors } = useRequest({
    url: "/api/order",
    method: "post",
    body: {
      ticketId: product.id,
    },
    onSuccess: (order) => Router.push("/order/[orderId]", `/order/${order.id}`),
  });

  const slides = product.photos.map((photo) => photo.secureUrl);

  const handleChat = (e) => {
    e.preventDefault();
    if (!user) {
      router.push("/auth/signin");
      return;
    }
    setShowChat(!showChat);
  };

  const handlePurchase = (e) => {
    e.preventDefault();
    if (!user) {
      router.push("/auth/signin");
      return;
    }
    doRequest();
  };

  // Check seller and buyer must be different users
  let areDifferent = false;
  if (user && data) {
    areDifferent = user.email !== data.email;
  }

  return (
    <ProductStyles>
      <Slider slides={slides} />
      <div className="details">
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        {areDifferent && (
          <div>
            <SickButton onClick={handleChat}>Chat</SickButton>
            <SickButton onClick={handlePurchase}>Purchase</SickButton>
          </div>
        )}
      </div>
      {showChat && (
        <ChatProduct seller={data} buyer={user} title={product.title} />
      )}
      {error}
      {errors}
    </ProductStyles>
  );
}

// CSS
const ProductStyles = styled.div`
  max-width: var(--maxWidth);
  justify-content: center;
  align-items: top;
  gap: 3rem;
`;
