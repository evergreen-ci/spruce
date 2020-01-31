import { DurationInputArg1, duration } from "moment";

export const msToDuration = (ms: DurationInputArg1): string => {
  const diff = duration(ms, "milliseconds");
  const days = diff.asDays();
  const hours = diff.hours();
  const minutes = diff.minutes();
  const seconds = diff.seconds();
  const milli = diff.milliseconds();
  if (days > 1) {
    return `${Math.trunc(days)}d ${hours}h ${minutes}m ${seconds}s`;
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
