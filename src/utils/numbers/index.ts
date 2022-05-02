/**
 * toFloat takes a string or number that represents a percentage value and returns a float
 * @param value - A string or number that represents a percentage value.
 * @return {number} A float representing the percentage value.
 * @example
 * toFloat("50") // => 0.5
 * toFloat("100") // => 1.0
 */
const toFloat = (value: string | number): number => {
  if (typeof value === "number") {
    return value;
  }
  return parseFloat(value);
};

/**
 *
 * @param value - A string or number that represents a percentage value between 0 and 1.
 * @return {number} A float representing the percentage value.
 * @example
 * toPercentage("0.5") // => 50
 * toPercentage("1") // => 100
 */
const toPercent = (value: string | number): number => {
  if (typeof value === "number") {
    return value * 100;
  }
  return parseFloat(value) * 100;
};

export { toFloat, toPercent };
