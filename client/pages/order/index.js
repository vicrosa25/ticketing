function OrderIndex({ orders }) {
  return <div>OrderIndex</div>;
}

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");
  return {
    orders: data,
  };
};

export default OrderIndex;
