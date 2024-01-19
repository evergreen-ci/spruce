describe("Name change modal", () => {
  beforeEach(() => {
    cy.visit("version/5f74d99ab2373627c047c5e5");
  });

  it("Use the name change modal to change the name of a patch", () => {
    const originalName = "main: EVG-7823 add a commit queue message (#4048)";
    cy.contains(originalName);
    cy.dataCy("name-change-modal-trigger").click();
    const newName = "a different name";
    cy.get("textarea").clear();
    cy.get("textarea").type(newName);
    cy.contains("Confirm").click();
    cy.get("textarea").should("not.exist");
    cy.contains(newName);
    cy.validateToast("success", "Patch name was successfully updated.", true);
    // revert name change
    cy.dataCy("name-change-modal-trigger").click();
    cy.get("textarea").clear();
    cy.get("textarea").type(originalName);
    cy.contains("Confirm").click();
    cy.get("textarea").should("not.exist");
    cy.validateToast("success", "Patch name was successfully updated.", true);
    cy.contains(originalName);
  });

  it("The confirm button is disabled when the text area value is empty or greater than 300 characters", () => {
    cy.dataCy("name-change-modal-trigger").click();
    cy.get("textarea").clear();
    cy.contains("button", "Confirm").should(
      "have.attr",
      "aria-disabled",
      "true",
    );
    cy.get("textarea").type("lol");
    cy.contains("button", "Confirm").should(
      "have.attr",
      "aria-disabled",
      "false",
    );
    const over300Chars =
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    cy.get("textarea").type(over300Chars);
    cy.contains("button", "Confirm").should(
      "have.attr",
      "aria-disabled",
      "true",
    );
    cy.contains("Value cannot exceed 300 characters");
  });
});
