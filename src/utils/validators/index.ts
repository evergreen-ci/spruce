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
 *
 */
//
export const validatePatchId = (id: string): boolean => {
  const mgobsonRegex = /^[a-f\d]{24}$/i;
  return mgobsonRegex.test(id);
};
