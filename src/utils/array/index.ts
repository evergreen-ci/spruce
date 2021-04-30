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
  const queryParamsList = Object.keys(object);
  queryParamsList.forEach((key) => {
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
