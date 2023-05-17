/**
 * toDecimal takes a string or number that represents a percentage value and returns a float
 * @param value - A string or number that represents a percentage value.
 * @return {number} A float representing the percentage value.
 * @example
 * toDecimal("50") // => 0.5
 * toDecimal("100") // => 1.0
 */
const toDecimal = (value: string | null): number => {
  const number = parseFloat(value);
  if (Number.isNaN(number)) {
    return null;
  }
  return number / 100;
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

/**
 * formatZeroIndexForDisplay formats a zero-indexed number for display in the UI.
 */
const formatZeroIndexForDisplay = (value: number): number => value + 1;

/**
 * roundDecimal rounds a decimal number to include a certain number of decimal places. It does not add trailing
 * zeroes.
 * @param value - the number to round
 * @param decimalPlaces - the number of decimal places to preserve
 * @example roundDecimal(0.54672, 3) // => 0.547
 * @example roundDecimal(11) // => 11
 */
const roundDecimal = (value: number, decimalPlaces: number = 0): number =>
  parseFloat(value.toFixed(decimalPlaces));

/**
 * cryptoRandom is a replacement for Math.random() using the web crypto API.
 * cryptoRandom generates a number between 0 (inclusive) and 1 (exclusive).
 */
const cryptoRandom = () => {
  const arr = new Uint32Array(1);
  const randomNumber = crypto.getRandomValues(arr)[0];
  return randomNumber / 2 ** 32;
};

export {
  toDecimal,
  toPercent,
  formatZeroIndexForDisplay,
  roundDecimal,
  cryptoRandom,
};
