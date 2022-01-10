/**
 * This takes in an array of values regardless of type and a new value and safely inserts the value if it doesn't exist in the array.
 * It removes the value from the array if it already exists
 * @param array The array to insert the value into.
 * @param value The value to insert into the array.
 * @returns The new array with the value inserted.
 */
export const toggleArray = <T>(value: T, array: T[]) => {
  const tempArray = [...array];
  const idIndex = tempArray.findIndex(
    (e) => JSON.stringify(value) === JSON.stringify(e)
  );
  if (idIndex !== -1) {
    tempArray.splice(idIndex, 1);
  } else {
    tempArray.push(value);
  }
  return tempArray;
};

/**
 * Takes an array of objects and a key
 * and returns an object using the provided value of the key as a key and the rest of the object as the value
 * @param array The array of objects to convert to an object
 * @param key The key to use as the key of the object
 * @returns The object created from the array
 * */
export const convertArrayToObject = <T = { [key: string]: any }>(
  array: T[],
  key: keyof T
): { [key: string]: T } => {
  const initialValue = {};
  if (array === undefined) {
    return initialValue;
  }
  return array.reduce((obj, item) => {
    if (item[key] === undefined) return { ...obj };
    // if the object value is not a valid object key type throw an error
    if (typeof item[key] !== "string") {
      throw new TypeError("Object keys must be of type `string`");
    }
    return {
      ...obj,
      [item[key] as any]: item,
    };
  }, initialValue);
};

/**
 * Takes an object and returns an array with each of the entries in the object as a value in the array
 * If the entry is an array it will also split up the indices of the array into the array
 * @param object The object to convert to an array
 * @returns The array created from the object
 */
export const convertObjectToArray = <T>(object: { [key: string]: T[] | T }) => {
  const result = [];
  if (object === undefined) return result;
  const objectEntries = Object.entries(object);
  return objectEntries.flatMap(([key, value]) => {
    const entries = toArray(value);
    return entries.map((v) => ({ key, value: v }));
  });
};

/**
 * Takes an array of strings and a value and returns an object with a string as the key and the value as the value
 * @param array The string array to convert to an object
 * @param v The value to use as the value of the object or a function that generates a value from the key
 * @returns The object created from the array
 */
export const mapStringArrayToObject = <T>(
  array: string[],
  v: T
): { [key: string]: T } => {
  if (array === undefined) {
    return {};
  }
  return array.reduce((prev, curr) => {
    let value = v;
    if (typeof v === "function") {
      value = v(curr);
    }
    return { ...prev, [curr]: value };
  }, {});
};

/** toArray takes a value and converts it into an array if it is not already */
export const toArray = <T>(value: T | T[]): T[] => {
  if (Array.isArray(value)) {
    return value;
  }
  return value === undefined ? [] : [value];
};
