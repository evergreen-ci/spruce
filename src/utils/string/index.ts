export const msToDuration = (ms: number): string => {
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const daysMilli = ms % (24 * 60 * 60 * 1000);
  const hours = Math.floor(daysMilli / (60 * 60 * 1000));
  const hoursMilli = ms % (60 * 60 * 1000);
  const minutes = Math.floor(hoursMilli / (60 * 1000));
  const minutesMilli = ms % (60 * 1000);
  const seconds = Math.floor(minutesMilli / 1000);
  const milliseconds = ms % 1000;
  if (days > 1) {
    return `${Math.trunc(days)}d ${hours}h ${minutes}m ${seconds}s`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  if (seconds > 0) {
    return `${seconds}s ${milliseconds}ms`;
  }
  return `${milliseconds}ms`;
};
