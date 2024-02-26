import {
  validateJira,
  validateJiraURL,
  validateNoSpecialCharacters,
  validateNoStartingOrTrailingWhitespace,
  validateObjectId,
  validateRegexp,
  validateSlack,
  validateSSHPublicKey,
  validateURL,
} from ".";

describe("validateNoSpecialCharacters", () => {
  it("returns true if string has no special characters", () => {
    expect(validateNoSpecialCharacters("")).toBe(true);
    expect(validateNoSpecialCharacters("helloworld-_~)(")).toBe(true);
    expect(validateNoSpecialCharacters("hello-world123")).toBe(true);
    expect(validateNoSpecialCharacters("helloworld.123")).toBe(true);
    expect(validateNoSpecialCharacters("hellowo~rld.123")).toBe(true);
    expect(validateNoSpecialCharacters("helloWorld123")).toBe(true);

    expect(validateNoSpecialCharacters(" ")).toBe(false);
    expect(validateNoSpecialCharacters("he/lloworld")).toBe(false);
    expect(validateNoSpecialCharacters("hello%world")).toBe(false);
  });
});

describe("validateNoStartingOrTrailingWhitespace", () => {
  it("returns true if string has no starting or trailing whitespace", () => {
    expect(validateNoStartingOrTrailingWhitespace("")).toBe(true);
    expect(validateNoStartingOrTrailingWhitespace("helloworld")).toBe(true);
    expect(validateNoStartingOrTrailingWhitespace(" helloWorld123")).toBe(
      false,
    );
    expect(validateNoStartingOrTrailingWhitespace("helloWorld123 ")).toBe(
      false,
    );
  });
});

describe("validateObjectId", () => {
  it("validates object ids", () => {
    expect(validateObjectId("5f74d99ab2373627c047c5e5")).toBeTruthy();
    expect(validateObjectId("5e6bb9e23066155a993e0f1a")).toBeTruthy();
    expect(
      validateObjectId("spruce_v2.11.1_60eda8722a60ed09bb78a2ff"),
    ).toBeFalsy();
    expect(
      validateObjectId(
        "mongodb_mongo_master_16085c4b28bd438e1c7608d0aa645de1c1811e7f",
      ),
    ).toBeFalsy();
  });
});

describe("validateRegexp", () => {
  it("returns true for valid regular expressions", () => {
    expect(validateRegexp("^[0-9]+$")).toBeTruthy();
    expect(validateRegexp(".")).toBeTruthy();
    expect(validateRegexp("^[0-9]+([,.][0-9]+)?$")).toBeTruthy();
  });
  it("returns false for invalid regular expressions", () => {
    expect(validateRegexp("variant[")).toBeFalsy();
    expect(validateRegexp("[")).toBeFalsy();
    expect(validateRegexp("test(")).toBeFalsy();
  });
});
describe("validateSSHPublicKey", () => {
  it("validates ssh public keys", () => {
    expect(validateSSHPublicKey("ssh-rsa someHash")).toBeTruthy();
    expect(validateSSHPublicKey("ssh-dss someHash")).toBeTruthy();
    expect(validateSSHPublicKey("ssh-ed25519 someHash")).toBeTruthy();
    expect(validateSSHPublicKey("ecdsa-sha2-nistp256 someHash")).toBeTruthy();
    expect(validateSSHPublicKey("ssh-dssNoSpace")).toBeFalsy();
    expect(validateSSHPublicKey("ssh-badStart someHash")).toBeFalsy();
  });
});

describe("validateJiraURL", () => {
  it("validates jira urls", () => {
    expect(
      validateJiraURL(
        "jira.example.com",
        "https://jira.example.com/browse/TEST-1",
      ),
    ).toBeTruthy();
    expect(
      validateJiraURL(
        "jira.example.com",
        "https://jira.example.com/browse/EVG-1",
      ),
    ).toBeTruthy();
    expect(
      validateJiraURL(
        "jira.example.com",
        "https://jira.example.com/browse/PD-1234",
      ),
    ).toBeTruthy();
    expect(
      validateJiraURL(
        "jira.example.com",
        "https://jira.example.com/browse/PD-1234",
      ),
    ).toBeTruthy();
    expect(validateJiraURL("jira.example.com", "")).toBeFalsy();
    expect(validateJiraURL("jira.example.com", "jira.example.com")).toBeFalsy();
    expect(
      validateJiraURL("jira.example.com", "https://jira.example.com/browse/"),
    ).toBeFalsy();
    expect(
      validateJiraURL(
        "jira.example.com",
        "https://jira.example.com/browse/EVG-1/some/path",
      ),
    ).toBeFalsy();
  });
});

describe("validateJira", () => {
  it("validates jira tickets", () => {
    expect(validateJira("TEST-1")).toBeTruthy();
    expect(validateJira("EVG-1")).toBeTruthy();
    expect(validateJira("PD-1234")).toBeTruthy();
    expect(validateJira("PD-")).toBeFalsy();
  });
});

describe("validateURL", () => {
  it("validates urls", () => {
    expect(validateURL("www.mongodb.com")).toBeTruthy();
    expect(validateURL("https://www.mongodb.net")).toBeTruthy();
    expect(validateURL("http://www.mongodb.org")).toBeTruthy();
    expect(validateURL("ftp://mongodb.com")).toBeTruthy();

    expect(validateURL("https://jira.org/browse/ABC-1234")).toBeTruthy();
    expect(
      validateURL("ftp://www.mongodb.com/moreUrlParams?hi=bye"),
    ).toBeTruthy();

    expect(validateURL("ww.fake.org")).toBeFalsy();
    expect(validateURL("bad.org")).toBeFalsy();
  });
});

describe("validateSlack", () => {
  it("validates slack targets", () => {
    expect(validateSlack("@user")).toBeTruthy();
    expect(validateSlack("#channel")).toBeTruthy();
    expect(validateSlack("BWQLY36TP")).toBeTruthy();
    expect(validateSlack("hello there")).toBeFalsy();
  });
});
