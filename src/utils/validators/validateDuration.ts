export default (duration: any) => {
  if (duration === "" || !Number.isInteger(+duration)) {
    return "Duration must be an integer";
  }
  if (+duration < 0) {
    return "Duration cannot be negative";
  }
  return "";
};
