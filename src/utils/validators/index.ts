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

const validateEmail = (v: string): boolean => /\S+@\S+\.\S+/.test(v);

const jiraTicketNumberRegex = ".+-[0-9]+";

const validateJira = (v: string) => new RegExp(jiraTicketNumberRegex).test(v);

const validateJiraURL = (jiraURL: string, url: string): boolean =>
  new RegExp(`^https://${jiraURL}/browse/${jiraTicketNumberRegex}$`).test(url);

const validateURL = (url: string): boolean => {
  if (!url) {
    return false;
  }
  const validateUrl =
    /^(https?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-.@:%_+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/;
  return validateUrl.test(url);
};

const validateSSHPublicKey = (v: string): boolean => {
  const validSSHKey = /^(ssh-rsa|ssh-dss|ssh-ed25519|ecdsa-sha2-nistp256) /;
  return validSSHKey.test(v);
};

const validatePercentage = (percent: string) => {
  const posNumRegex = /^[0-9]+([,.][0-9]+)?$/g;
  if (!posNumRegex.test(percent)) {
    return false;
  }
  return true;
};

const validateSlack = (v: string): boolean =>
  v.match("(#|@).+|(^S+$)") !== null;

/**
 *  validateObjectId tests if a provided id is a mongo objectId indicating that it likely belongs to a patch and not a version
 *  @param  {string} id - the id to test
 *  @return {boolean} - true if it is a mongo objectId, false otherwise
 */
//
const validateObjectId = (id: string): boolean => {
  // Official regex the mongodb bson specification uses https://github.com/mongodb/js-bson/blob/6ceaa05a68c1a89e43b3b6d0002e5bab69e2613f/src/objectid.ts#L6
  const mgobsonRegex = /^[0-9a-fA-F]{24}$/i;
  return mgobsonRegex.test(id);
};

/**
 * validateRegexp tests if a provided string is a valid regular expression
 * @param regexp - the regexp to test
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

export {
  validateDuration,
  validateEmail,
  validateJira,
  validateJiraURL,
  validateObjectId,
  validatePercentage,
  validateRegexp,
  validateSSHPublicKey,
  validateSlack,
  validateURL,
};
