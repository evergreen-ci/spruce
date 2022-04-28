import {
  validateRegexp,
  validateObjectId,
  validateSSHPublicKey,
  validateJiraURL,
} from ".";

describe("validateObjectId", () => {
  it("validates object ids", () => {
    expect(validateObjectId("5f74d99ab2373627c047c5e5")).toBeTruthy();
    expect(validateObjectId("5e6bb9e23066155a993e0f1a")).toBeTruthy();
    expect(
      validateObjectId("spruce_v2.11.1_60eda8722a60ed09bb78a2ff")
    ).toBeFalsy();
    expect(
      validateObjectId(
        "mongodb_mongo_master_16085c4b28bd438e1c7608d0aa645de1c1811e7f"
      )
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
        "https://jira.example.com",
        "https://jira.example.com/browse/TEST-1"
      )
    ).toBeTruthy();
    expect(
      validateJiraURL(
        "https://jira.example.com",
        "https://jira.example.com/browse/EVG-1"
      )
    ).toBeTruthy();
    expect(
      validateJiraURL(
        "https://jira.example.com",
        "https://jira.example.com/browse/PD-1234"
      )
    ).toBeTruthy();
    expect(
      validateJiraURL(
        "https://jira.example.com",
        "https://jira.example.com/browse/PD-1234"
      )
    ).toBeTruthy();
    expect(validateJiraURL("https://jira.example.com", "")).toBeFalsy();
    expect(
      validateJiraURL("https://jira.example.com", "https://jira.example.com")
    ).toBeFalsy();
    expect(
      validateJiraURL(
        "https://jira.example.com",
        "https://jira.example.com/browse/"
      )
    ).toBeFalsy();
    expect(
      validateJiraURL(
        "https://jira.example.com",
        "https://jira.example.com/browse/EVG-1/"
      )
    ).toBeFalsy();
  });
});
