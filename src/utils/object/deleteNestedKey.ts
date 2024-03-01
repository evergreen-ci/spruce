/**
 *
 * Deletes a key from an object, including any nested objects.
 *
 * It modifies the original object by removing any property that matches the key name.
 * If the key is found in nested objects, those are removed as well. The function works
 * recursively to ensure all instances of the key are deleted throughout the object.
 * @param obj The object to remove the key from.
 * @param keyToDelete The name of the key to be removed.
 * @returns The object with the key removed.
 */
export function deleteNestedKey<T extends object>(
  obj: T,
  keyToDelete: string,
): Partial<T> {
  const deleteKey = (currentObject: any) => {
    Object.keys(currentObject).forEach((key) => {
      if (key === keyToDelete) {
        // eslint-disable-next-line no-param-reassign
        delete currentObject[key];
      } else if (
        typeof currentObject[key] === "object" &&
        currentObject[key] !== null
      ) {
        // eslint-disable-next-line no-param-reassign
        deleteKey(currentObject[key]);
      }
    });
  };
  deleteKey(obj);
  return obj;
}
