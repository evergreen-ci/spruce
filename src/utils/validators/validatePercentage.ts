export default (percent: any) => {
  if (!Number.isFinite(percent)) {
    return "Percent must be a number";
  }
  if (+percent <= 0) {
    return "Percent cannot be negative";
  }
  return "";
};
