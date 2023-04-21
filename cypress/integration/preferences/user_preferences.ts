const baseRoute = "/preferences";
const tabNames = {
  profile: "/profile",
  notifications: "/notifications",
  cli: "/cli",
};
describe("user preferences pages", () => {
  it("visiting /preferences should redirect to the profile tab", () => {
    cy.visit(baseRoute);
    cy.url().should("include", `${baseRoute}${tabNames.profile}`);
  });
  it("should be able to navigate between tabs using the side nav", () => {
    cy.visit(baseRoute);
    cy.dataCy("preferences-tab-title").should("have.text", "Profile");
    cy.dataCy("notifications-nav-tab").click();
    cy.dataCy("preferences-tab-title").should("have.text", "Notifications");
  });
  it("should be able to reset Evergreen API key", () => {
    const apiKey = "abb623665fdbf368a1db980dde6ee0f0";
    cy.visit(`${baseRoute}${tabNames.cli}`);
    cy.contains("Download the authentication file.").scrollIntoView();
    cy.contains(apiKey).should("be.visible");
    cy.contains("button", "Reset key").click();
    cy.contains(apiKey).should("not.exist");
  });
  it("updating a field should enable the submit button", () => {
    cy.visit(`${baseRoute}${tabNames.notifications}`);
    cy.dataCy("save-profile-changes-button").should(
      "have.attr",
      "aria-disabled",
      "true"
    );
    cy.dataCy("slack-member-id-field").clear().type("12345");
    cy.dataCy("save-profile-changes-button").should(
      "not.have.attr",
      "aria-disabled",
      "true"
    );
  });
  it("saving changes to a field should work", () => {
    cy.visit(`${baseRoute}${tabNames.notifications}`);
    cy.dataCy("slack-username-field").clear().type("slack.user");
    cy.dataCy("save-profile-changes-button").click();
    cy.validateToast("success", "Your changes have successfully been saved.");
  });
});
