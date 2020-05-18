export default (duration: any) => {
  if (duration === "" || !Number.isInteger(+duration)) {
    return `A duration must be an integer: ${duration}`;
  }
  if (+duration < 0) {
    return `A duration cannot be negative: ${duration}`;
  }
  return "";
};
