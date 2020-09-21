// This takes in an array and an id and safely inserts or removes the value from
// the array so that there is never a duplicate value
export const toggleArray = (id: string, array: any[]) => {
  const tempArray = [...array];
  const idIndex = tempArray.indexOf(id);
  if (idIndex !== -1) {
    tempArray.splice(idIndex, 1);
  } else {
    tempArray.push(id);
  }
  return tempArray;
};

export const convertArrayToObject = (array: Object[], key: string): Object => {
  const initialValue = {};
  return array.reduce(
    (obj, item) => ({
      ...obj,
      [item[key]]: item,
    }),
    initialValue
  );
};
