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
  validateURLTemplate,
} = validators;

export const customFormats = (jiraHost: string) => ({
  // Permit empty string but disallow whitespace
  noSpaces: /^$|^\S+$/,

  validDuration: validateDuration,

  validJiraTicket: validateJira,

  validJiraURL: (url: string) => validateJiraURL(jiraHost, url),

  validEmail: validateEmail,

  validPercentage: validatePercentage,

  validRegex: validateRegexp,

  validSlack: validateSlack,
  // Permit url
  validURL: validateURL,
  validURLTemplate: validateURLTemplate,
});
