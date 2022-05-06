const validateDuration = (duration: any) => {
  if ((!duration && duration !== 0) || !Number.isInteger(+duration)) {
    return "Duration must be an integer";
  }
  if (+duration < 0) {
    return "Duration cannot be negative";
  }
  return "";
};

const validateEmail = (v: string): boolean => /\S+@\S+\.\S+/.test(v);

const jiraTicketNumberRegex = "[A-z]+-[0-9]+";

const validateJira = (v: string) =>
  new RegExp(`/^${jiraTicketNumberRegex}/`).test(v);

const validateJiraURL = (jiraURL: string, url: string): boolean =>
  new RegExp(`^https://${jiraURL}/browse/${jiraTicketNumberRegex}$`).test(url);

const validateSSHPublicKey = (v: string): boolean => {
  const validSSHKey = new RegExp(
    /^(ssh-rsa|ssh-dss|ssh-ed25519|ecdsa-sha2-nistp256) /
  );
  return validSSHKey.test(v);
};

const validatePercentage = (percent: any) => {
  const posNumRegex = /^[0-9]+([,.][0-9]+)?$/g;
  if (!posNumRegex.test(percent)) {
    return "Percent must be a positive number";
  }

  return "";
};

const validateSlack = (v: string): boolean => v.match("(#|@).+") !== null;

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
};
