describe("using the distro dropdown", () => {
  beforeEach(() => {
    cy.visit("/distro/localhost/settings");
  });

  it("navigates to distro when clicked", () => {
    cy.dataCy("distro-select").should("be.visible").click();
    cy.dataCy("distro-select-options").should("be.visible");
    cy.dataCy("distro-select-options").within(() => {
      cy.contains("rhel71-power8-large").click();
    });
    cy.location("pathname").should("not.contain", "localhost");
    cy.location("pathname").should("contain", "rhel71-power8-large");
  });
});
