const yellow = (text: string) => `\x1b[33m${text}\x1b[0m`;
const red = (text: string) => `\x1b[31m${text}\x1b[0m`;
const green = (text: string) => `\x1b[32m${text}\x1b[0m`;
const underline = (text: string) => `\x1b[4m${text}\x1b[0m`;

export { yellow, red, green, underline };
