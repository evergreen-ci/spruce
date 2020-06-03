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
