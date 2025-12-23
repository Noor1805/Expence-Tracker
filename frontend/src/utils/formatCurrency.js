export const formatCurrency = (amount, currency = "USD") => {
  if (amount === undefined || amount === null) return "";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};
