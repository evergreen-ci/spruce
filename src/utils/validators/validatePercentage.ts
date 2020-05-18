export default (percent: any) => {
  if (!Number.isFinite(percent)) {
    return `${percent} must be a number`;
  }
  if (+percent <= 0) {
    return `${percent} must be positive`;
  }
  return "";
};
