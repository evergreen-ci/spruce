const baseRoute = "/preferences";
const tabNames = {
  profile: "/profile",
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
    const defaultApiKey = "abb623665fdbf368a1db980dde6ee0f0";
    cy.visit(`${baseRoute}${tabNames.cli}`);
    cy.contains("Download the authentication file.").scrollIntoView();
    cy.contains(defaultApiKey).should("be.visible");
    cy.contains("button", "Reset key").click();
    cy.contains(defaultApiKey).should("not.exist");
  });
});
