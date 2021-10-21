import Link from "next/link";
import ItemStyles from "./styles/ItemStyles";
import Title from "./styles/Title";
import PriceTag from "./styles/PriceTag";
import formatMoney from "../helper/formatMoney";
// import DeleteProduct from './DeleteProduct';
// import AddToCart from './AddToCart';

export default function Product({ product }) {
  return (
    <ItemStyles>
      <img src={product.photos[0].secureUrl} alt={product.title} />
      <Title>
        <Link href={`/ticket/${product.id}`}>{product.title}</Link>
      </Title>
      <PriceTag>{formatMoney(product.price * 100)}</PriceTag>
      <p>{product.description}</p>
    </ItemStyles>
  );
}
