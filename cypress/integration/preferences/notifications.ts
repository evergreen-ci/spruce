const pageRoute = "/preferences/notifications";

describe("global subscription settings", () => {
  it("updating a field should enable the submit button", () => {
    cy.visit(`${pageRoute}`);
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
    cy.visit(`${pageRoute}`);
    cy.dataCy("slack-username-field").clear().type("slack.user");
    cy.dataCy("save-profile-changes-button").click();
    cy.validateToast("success", "Your changes have successfully been saved.");
  });
});

describe.only("user subscriptions table", () => {
  it("shows all of a user's subscriptions and expands with details", () => {
    cy.visit(`${pageRoute}`);
    cy.dataCy("subscription-row").should("have.length", 3);

    cy.dataCy("regex-selectors").should("not.be.visible");
    cy.dataCy("trigger-data").should("not.be.visible");
    cy.get("tr button").first().click();
    cy.dataCy("regex-selectors").should("be.visible");
    cy.dataCy("trigger-data").should("not.be.visible");
    cy.get("tr button").last().click();
    cy.dataCy("regex-selectors").should("be.visible");
    cy.dataCy("trigger-data").should("be.visible");
  });
});
