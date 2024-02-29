/**
 * `validateDuration` tests if a provided string is a valid duration
 * @param duration - the duration to validate
 * @returns - true if the provided string is a valid duration, false otherwise
 */
const validateDuration = (duration: string) => {
  const durationAsInt = parseInt(duration, 10);
  if (
    (!durationAsInt && durationAsInt !== 0) ||
    !Number.isInteger(+durationAsInt)
  ) {
    return false;
  }
  if (+durationAsInt < 0) {
    return false;
  }
  return true;
};

/**
 * `validateEmail` tests if a provided string is a valid email address
 * @param v - the string to test
 * @returns - true if the provided string is a valid email address, false otherwise
 */
const validateEmail = (v: string): boolean => /\S+@\S+\.\S+/.test(v);

const jiraTicketNumberRegex = ".+-[0-9]+";

/**
 * `validateJira` tests if a provided string is a valid jira ticket number
 * @param v - the string to test
 * @returns - true if the provided string is a valid jira ticket number, false otherwise
 * @example
 * validateJira("ABC-123") // true
 * validateJira("ABC-123-456") // false
 */
const validateJira = (v: string) => new RegExp(jiraTicketNumberRegex).test(v);

/**
 * `validateJiraURL` tests if a provided url is a valid jira url
 * @param jiraURL - the jira host url
 * @param url - the url to test
 * @returns - true if the provided url is a valid jira url, false otherwise
 */
const validateJiraURL = (jiraURL: string, url: string): boolean =>
  new RegExp(`^https://${jiraURL}/browse/${jiraTicketNumberRegex}$`).test(url);

/**
 * `validateURL` tests if a provided url is a valid url
 * @param url - the url to test
 * @returns - true if the provided url is a valid url, false otherwise
 */
const validateURL = (url: string): boolean => {
  const validateUrlRegex =
    /^(https?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-.@:%_+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/;
  if (!url) {
    return false;
  }
  return validateUrlRegex.test(url);
};

/**
 * `validateURLTemplate` tests if a provided url is a valid url template with a version_id placeholder
 * @param url - the url to test
 * @returns - true if the provided url is a valid url template with a version_id placeholder, false otherwise
 */
const validateURLTemplate = (url: string): boolean => {
  if (!url) {
    return true;
  }
  const formattedURL = url.replace("{version_id}", "version_id");
  return validateURL(formattedURL);
};

/**
 * `validateSSHPublicKey` tests if a provided string is a valid ssh public key
 * @param v - the ssh public key to test
 * @returns - true if the provided string is a valid ssh public key, false otherwise
 */
const validateSSHPublicKey = (v: string): boolean => {
  const validSSHKey = /^(ssh-rsa|ssh-dss|ssh-ed25519|ecdsa-sha2-nistp256) /;
  return validSSHKey.test(v);
};

/**
 * `validatePercentage` tests if a provided string is a valid percentage over 0
 * @param percent - the percentage to validate
 * @returns - true if the provided string is a valid percentage, false otherwise
 */
const validatePercentage = (percent: string) => {
  const posNumRegex = /^[0-9]+([,.][0-9]+)?$/g;
  if (!posNumRegex.test(percent)) {
    return false;
  }
  return true;
};

/**
 *
 * @param v - the slack channel, user, or id to validate
 * @returns - true if the provided string is a valid slack channel, user, or id, false otherwise
 */
const validateSlack = (v: string): boolean => {
  const validTarget = /(^\S+$)/;
  return validTarget.test(v);
};

/**
 *  `validateObjectId` tests if a provided id is a mongo objectId indicating that it likely belongs to a patch and not a version
 *  @param id - the id to test
 *  @returns - true if it is a mongo objectId, false otherwise
 */
//
const validateObjectId = (id: string): boolean => {
  // Official regex the mongodb bson specification uses https://github.com/mongodb/js-bson/blob/6ceaa05a68c1a89e43b3b6d0002e5bab69e2613f/src/objectid.ts#L6
  const mgobsonRegex = /^[0-9a-fA-F]{24}$/i;
  return mgobsonRegex.test(id);
};

/**
 * `validateRegexp` tests if a provided string is a valid regular expression
 * @param regexp - the regexp to test
 * @returns - true if it is a valid regexp, false otherwise
 */
const validateRegexp = (regexp: string): boolean => {
  try {
    // eslint-disable-next-line no-new
    new RegExp(regexp);
    return true;
  } catch (e) {
    return false;
  }
};

const allowedSymbols = "-._~()";

/**
 * `validateNoSpecialCharacters` tests if a provided string contains no special characters
 * @param str - The string to test.
 * @returns - true if the string has no special characters and false otherwise
 */
const validateNoSpecialCharacters = (str: string): boolean => {
  const noSpecialCharacters = new RegExp(`^[0-9a-zA-Z${allowedSymbols}]*$`);
  return noSpecialCharacters.test(str);
};

/**
 * `validateNoStartingOrTrailingWhitespace` tests if a provided string contains no starting or trailing whitespace
 * @param str - The string to test.
 * @returns - true if the string has no starting or trailing whitespace and false otherwise
 */
const validateNoStartingOrTrailingWhitespace = (str: string): boolean => {
  const noStartingOrTrailingWhitespaceRegex = /^(?! ).*(?<! )$/;
  return noStartingOrTrailingWhitespaceRegex.test(str);
};

export {
  allowedSymbols,
  validateDuration,
  validateEmail,
  validateJira,
  validateJiraURL,
  validateNoSpecialCharacters,
  validateNoStartingOrTrailingWhitespace,
  validateObjectId,
  validatePercentage,
  validateRegexp,
  validateSlack,
  validateSSHPublicKey,
  validateURL,
  validateURLTemplate,
};
