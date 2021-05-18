// This takes in an array and an id and safely inserts or removes the value from
// the array so that there is never a duplicate value
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

// Takes an array of objects and a key
// and returns an object using the provided key as a key and the elements in the array as values
export const convertArrayToObject = <T>(
  array: T[],
  key: string
): { [key: string]: T } => {
  const initialValue = {};
  if (array === undefined) return initialValue;
  return array.reduce((obj, item) => {
    if (item[key] === undefined) return { ...obj };
    return {
      ...obj,
      [item[key]]: item,
    };
  }, initialValue);
};

// Takes in an object of key value[] pairs
// and returns an array of objects with the value[] split out
export const convertObjectToArray = <T>(object: {
  [key: string]: T[] | T;
}): { key: string; value: T }[] => {
  const result = [];
  if (object === undefined) return result;
  const objectKeys = Object.keys(object);
  objectKeys.forEach((key) => {
    const value = object[key];
    if (!Array.isArray(value)) {
      result.push({ key, value });
      return;
    }
    value.forEach((v) => {
      result.push({ key, value: v });
    });
  });
  return result;
};

// Takes a deduplicated string array and returns an object of key value pairs where the array keys  are the object key mapped to a value
export const mapStringArrayToObject = <T>(
  array: string[],
  v: T
): { [key: string]: T } =>
  array.reduce((prev, curr) => {
    let value = v;
    if (typeof v === "function") {
      value = v(curr);
    }
    return { ...prev, [curr]: value };
  }, {});
