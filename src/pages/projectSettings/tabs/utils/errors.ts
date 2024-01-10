/**
 * `findDuplicateIndices` finds and returns the indices of duplicates in an array.
 * @param array - an array of objects in which to check for duplicates
 * @param key - the key by which to compare objects
 * @returns an array of numbers indicating the indices of duplicates
 */
export const findDuplicateIndices = <T = { [key: string]: any }>(
  array: T[],
  key: keyof T,
) => {
  const duplicateIndices = array
    .map((item) => item[key])
    .map(
      (val, index, arr) =>
        val !== "" && arr.lastIndexOf(val) !== index && index,
    )
    .filter((index) => array[index]);
  return duplicateIndices;
};
