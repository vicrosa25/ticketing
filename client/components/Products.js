import styled from "styled-components";
// import { perPage } from "../config";
import Product from "./Product";

const ProductsListStyles = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
`;

export default function Products({ products }) {
  return (
    <ProductsListStyles>
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </ProductsListStyles>
  );
}
