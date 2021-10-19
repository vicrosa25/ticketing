export default function formatMoney(amount = 0) {
  const options = {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  };

  // check if its a clean dollar amount
  if (amount % 100 === 0) {
    options.minimumFractionDigits = 0;
  }

  const formatter = Intl.NumberFormat("es-ES", options);

  return formatter.format(amount / 100);
}
