import { DurationInputArg1, duration } from "moment";

export const msToTime = (ms: DurationInputArg1): String => {
  var diff = duration(ms, "milliseconds");
  const days = diff.asDays();
  const hours = diff.asHours();
  const minutes = diff.asMinutes();
  const seconds = diff.asSeconds();
  const milli = diff.asMilliseconds();
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  if (seconds > 0) {
    return `${seconds}s ${milli}ms`;
  }
  return `${milli}ms`;
};
