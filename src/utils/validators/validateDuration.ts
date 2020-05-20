export const validateDuration = (duration: any) => {
  if ((!duration && duration !== 0) || !Number.isInteger(+duration)) {
    return "Duration must be an integer";
  }
  if (+duration < 0) {
    return "Duration cannot be negative";
  }
  return "";
};
