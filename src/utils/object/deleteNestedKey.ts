/**
 *
 * Deletes a key from an object, including any nested objects.
 *
 * It modifies the original object by removing or updating any property that matches the
 * key name. If the key is found in nested objects, those are removed as well. The function
 * works recursively to ensure all instances of the key are deleted throughout the object. If
 * redactedString is provided, the key is replaced with the redactedString instead of being
 * deleted.
 * @param obj The object to remove the key from.
 * @param keyToUpdate The name of key(s) to be removed or updated.
 * @param redactedString The string to replace the key with if provided.
 * @returns The object with the key removed.
 */
export function deleteNestedKey<T extends object>(
  obj: T,
  keyToUpdate: string | string[],
  redactedString?: string,
): Partial<T> {
  const deleteKey = (currentObject: any) => {
    Object.keys(currentObject).forEach((key) => {
      if (key === keyToUpdate || keyToUpdate?.includes(key)) {
        if (redactedString) {
          // eslint-disable-next-line no-param-reassign
          currentObject[key] = redactedString;
        } else {
          // eslint-disable-next-line no-param-reassign
          delete currentObject[key];
        }
      } else if (
        typeof currentObject[key] === "object" &&
        currentObject[key] !== null
      ) {
        deleteKey(currentObject[key]);
      }
    });
  };
  deleteKey(obj);
  return obj;
}
