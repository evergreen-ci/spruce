describe("Downstream Projects Tab", () => {
  const DOWNSTREAM_ROUTE = `/version/5f74d99ab2373627c047c5e5/downstream-projects`;

  beforeEach(() => {
    cy.visit(DOWNSTREAM_ROUTE);
  });

  it("shows the number of failed patches in the Downstream tab label", () => {
    cy.dataCy("downstream-tab-badge").should("exist");
    cy.dataCy("downstream-tab-badge").should("contain.text", "1");
  });

  it("shows the child patches", () => {
    cy.dataCy("project-accordion").should("have.length", 3);
    cy.dataCy("project-title").should("have.length", 3);
    // On CI, none of the child patches failed, so no tables should be visible.
    cy.dataCy("tasks-table").should("not.be.visible");
  });

  it("links to base commit", () => {
    cy.dataCy("accordion-toggle").first().click();
    cy.dataCy("downstream-base-commit")
      .should("have.attr", "href")
      .and(
        "includes",
        "/version/logkeeper_3c5a8112efdb98f3710b89d553af602e355aa5c9",
      );
  });

  it("filters by test name", () => {
    cy.dataCy("accordion-toggle").first().click();
    cy.get("tbody").first().children().should("have.length", 1);
    cy.toggleTableFilter(1);
    cy.dataCy("taskname-input-wrapper")
      .find("input")
      .focus()
      .type("filter")
      .type("{enter}");
    cy.get("tbody").first().contains("No Data");
  });

  it("does not push query params to the URL", () => {
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(DOWNSTREAM_ROUTE);
    });
  });
});
