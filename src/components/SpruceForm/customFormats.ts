import { validators } from "utils";

const {
  validateDuration,
  validateEmail,
  validateJira,
  validateJiraURL,
  validatePercentage,
  validateRegexp,
  validateSlack,
  validateURL,
} = validators;

export const customFormats = (jiraHost: string) => ({
  // Permit empty string but disallow whitespace
  noSpaces: /^$|^\S+$/,
  // Permit url
  validURL: validateURL,
  validDuration: validateDuration,
  validPercentage: validatePercentage,
  validJiraTicket: validateJira,
  validJiraURL: (url: string) => validateJiraURL(jiraHost, url),
  validRegex: validateRegexp,
  validSlack: validateSlack,
  validEmail: validateEmail,
});
