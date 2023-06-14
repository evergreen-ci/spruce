/**
 * `toDecimal` takes a string or number that represents a percentage value and returns a float
 * @param value - A string or number that represents a percentage value.
 * @returns A float representing the percentage value.
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
 * `toPercent` takes a string or number that represents a percentage value and returns a float
 * @param value - A string or number that represents a percentage value between 0 and 1.
 * @returns A float representing the percentage value.
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
 * `formatZeroIndexForDisplay` formats a zero-indexed number for display in the UI.
 * @param value - the zero-indexed number to format
 * @returns the number plus one
 * @example formatZeroIndexForDisplay(0) // => 1
 * @example formatZeroIndexForDisplay(1) // => 2
 */
const formatZeroIndexForDisplay = (value: number): number => value + 1;

/**
 * `roundDecimal` rounds a decimal number to include a certain number of decimal points. It does not add trailing
 * zeroes.
 * @param value - the number to round
 * @param decimalPlaces - the number of decimal places to preserve
 * @returns the rounded number
 * @example roundDecimal(0.54672, 3) // => 0.547
 * @example roundDecimal(11) // => 11
 */
const roundDecimal = (value: number, decimalPlaces: number = 0): number =>
  parseFloat(value.toFixed(decimalPlaces));

/**
 * `cryptoRandom` is a replacement for Math.random() using the web crypto API.
 * cryptoRandom generates a number between 0 (inclusive) and 1 (exclusive).
 * @returns a random number between 0 and 1
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
