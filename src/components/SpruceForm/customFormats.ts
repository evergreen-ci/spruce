import { validators } from "utils";

const { validateURL, validateJiraURL } = validators;

export const customFormats = (jiraHost: string) => ({
  // Permit empty string but disallow whitespace
  noSpaces: /^$|^\S+$/,
  // Permit url
  validURL: validateURL,
  validJiraTicket: (url: string) => validateJiraURL(jiraHost, url),
});
