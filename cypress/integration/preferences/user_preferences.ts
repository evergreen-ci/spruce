const baseRoute = "/preferences";
const tabNames = {
  profile: "/profile",
  notifications: "/notifications",
  cli: "/cli",
};
describe("user preferences pages", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });
  it("visiting /preferences should redirect to the profile tab", () => {
    cy.visit(baseRoute);
    cy.url().should("include", `${baseRoute}${tabNames.profile}`);
  });
  it("should be able to navigate between tabs using the side nav", () => {
    cy.dataCy("preferences-tab-title").should("have.text", "Profile");
    cy.dataCy("notifications-nav-tab").click();
    cy.dataCy("preferences-tab-title").should("have.text", "Notifications");
  });
  it("updating a field should enable the submit button", () => {
    cy.dataCy("save-profile-changes-button").should("be.disabled");
    cy.dataCy("slack-username-field").type("mohamed.khelif");
    cy.dataCy("save-profile-changes-button").should("not.be.disabled");
  });
  it("saving changes to a field should work", () => {
    cy.dataCy("save-profile-changes-button").click();
    cy.validateToast("success", "Your changes have successfully been saved.");
  });
});
