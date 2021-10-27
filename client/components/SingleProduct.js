import Router from "next/router";
import styled from "styled-components";
import Slider from "../components/Slider";
import useRequest from "../hooks/useRequest";

const ProductStyles = styled.div`
  display: grid;
  /* grid-auto-columns: 1fr; */
  grid-template-columns: 80% 20%;
  grid-auto-flow: column;
  max-width: var(--maxWidth);
  justify-content: center;
  align-items: top;
  gap: 3rem;
`;

export default function SingleProduct({ product }) {
  // Hook
  const { doRequest, errors } = useRequest({
    url: "/api/order",
    method: "post",
    body: {
      ticketId: product.id,
    },
    onSuccess: (order) => Router.push("/order/[orderId]", `/order/${order.id}`),
  });

  const slides = product.photos.map((photo) => photo.secureUrl);

  return (
    <ProductStyles>
      <Slider slides={slides} />
      <div className="details">
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <button onClick={() => doRequest()}>Purchase</button>
      </div>
      {errors}
    </ProductStyles>
  );
}
