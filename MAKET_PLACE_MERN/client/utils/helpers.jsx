export const currencyFormatter = (data) => {
  return ((data.amount * 10000) / 100).toLocaleString(data.currency, {
    style: "currency",
    currency: data.currency,
  });
};

export const stripeCurrencyFormatter = (data) => {
  return (data.amount / 10).toLocaleString(data.currency, {
    style: "currency",
    currency: data.currency,
  });
};
