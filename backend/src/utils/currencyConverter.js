import axios from "axios";

export async function convertCurrency(amount, fromCurrency, toCurrency) {
  try {
    const apiUrl = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`;

    const response = await axios.get(apiUrl);
    const rates = response.data.rates;

    if (!rates[toCurrency]) {
      throw new Error("Target currency not supported");
    }

    const convertedAmount = amount * rates[toCurrency];

    return Number(convertedAmount.toFixed(2));

  } catch (error) {
    console.error("Currency Conversion Error:", error.message);
    throw new Error("Failed to convert currency");
  }
}
