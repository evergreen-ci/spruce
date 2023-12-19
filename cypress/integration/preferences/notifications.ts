const pageRoute = "/preferences/notifications";

describe("global subscription settings", () => {
  it("updating a field should enable the submit button", () => {
    cy.visit(pageRoute);
    cy.dataCy("save-profile-changes-button").should(
      "have.attr",
      "aria-disabled",
      "true"
    );
    cy.dataCy("slack-member-id-field").clear();
    cy.dataCy("slack-member-id-field").type("12345");
    cy.dataCy("save-profile-changes-button").should(
      "not.have.attr",
      "aria-disabled",
      "true"
    );
  });
  it("saving changes to a field should work", () => {
    cy.visit(pageRoute);
    cy.dataCy("slack-username-field").clear();
    cy.dataCy("slack-username-field").type("slack.user");
    cy.dataCy("save-profile-changes-button").click();
    cy.validateToast("success", "Your changes have successfully been saved.");
  });
});

describe("user subscriptions table", () => {
  beforeEach(() => {
    cy.visit(pageRoute);
  });

  it("shows all of a user's subscriptions and expands with details", () => {
    cy.dataCy("leafygreen-table-row").should("have.length", 3);

    cy.dataCy("regex-selectors").should("not.be.visible");
    cy.dataCy("trigger-data").should("not.be.visible");
    cy.dataCy("leafygreen-table-row")
      .eq(0)
      .within(() => {
        cy.get("button").first().click();
      });
    cy.dataCy("regex-selectors").should("be.visible");
    cy.dataCy("trigger-data").should("not.be.visible");
    cy.dataCy("leafygreen-table-row")
      .eq(2)
      .within(() => {
        cy.get("button").first().click();
      });
    cy.dataCy("regex-selectors").should("be.visible");
    cy.dataCy("trigger-data").should("be.visible");
  });

  it("Shows the selected count in the 'Delete' button", () => {
    cy.dataCy("leafygreen-table-row")
      .eq(0)
      .within(() => {
        cy.get("input[type=checkbox]").check({ force: true });
      });
    cy.dataCy("delete-some-button").contains("Delete (1)");

    cy.get("thead").within(() => {
      cy.get("input[type=checkbox]").check({ force: true });
    });
    cy.dataCy("delete-some-button").contains("Delete (3)");

    cy.get("thead").within(() => {
      cy.get("input[type=checkbox]").uncheck({ force: true });
    });
    cy.dataCy("delete-some-button").contains("Delete");
    cy.dataCy("delete-some-button").should(
      "have.attr",
      "aria-disabled",
      "true"
    );
  });

  describe("Deleting subscriptions", () => {
    it("Deletes a single subscription", () => {
      cy.dataCy("leafygreen-table-row")
        .eq(0)
        .within(() => {
          cy.get("input[type=checkbox]").check({ force: true });
        });
      cy.dataCy("delete-some-button").click();
      cy.validateToast("success", "Deleted 1 subscription.");
      cy.dataCy("leafygreen-table-row").should("have.length", 2);
    });
  });
});
