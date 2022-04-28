const toDecimal = (value: string | null) => {
  if (value === null) {
    return null;
  }
  const number = parseFloat(value);
  if (Number.isNaN(number)) {
    return null;
  }
  return number / 100;
};

export { toDecimal };
