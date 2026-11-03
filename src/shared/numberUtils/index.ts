export const percentageByTotal = (value: number, total: number) =>
  value / (total / 100);

export const decimalFormat = (value: number, decimalLength = 1) => {
  const isInteger = value % 1 === 0;
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: isInteger ? 0 : decimalLength,
    maximumFractionDigits: decimalLength,
  }).format(value);
};

export const numberFormat = (value: number, noDecimals = false) => {
  const newValue = noDecimals ? Math.trunc(value) : value;
  return newValue.toLocaleString("pt-BR");
};
