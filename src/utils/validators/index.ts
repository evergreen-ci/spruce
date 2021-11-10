export const validateDuration = (duration: any) => {
  if ((!duration && duration !== 0) || !Number.isInteger(+duration)) {
    return "Duration must be an integer";
  }
  if (+duration < 0) {
    return "Duration cannot be negative";
  }
  return "";
};

export const validateEmail = (v: string): boolean => /\S+@\S+\.\S+/.test(v);

export const validateJira = (v: string) => v.match(".+-[0-9]+") !== null;

export const validatePercentage = (percent: any) => {
  const posNumRegex = /^[0-9]+([,.][0-9]+)?$/g;
  if (!posNumRegex.test(percent)) {
    return "Percent must be a positive number";
  }

  return "";
};

export const validateSlack = (v: string): boolean =>
  v.match("(#|@).+") !== null;

/**
 *  validatePatchId tests if a provided id is a mongo objectId indicating that it likely belongs to a patch and not a version
 *  @param  {string} id - the id to test
 * @return {boolean} - true if it is a mongo objectId, false otherwise
 */
//
export const validateObjectId = (id: string): boolean => {
  // Official regex the mongodb bson specification uses https://github.com/mongodb/js-bson/blob/6ceaa05a68c1a89e43b3b6d0002e5bab69e2613f/src/objectid.ts#L6
  const mgobsonRegex = /^[0-9a-fA-F]{24}$/i;
  return mgobsonRegex.test(id);
};
