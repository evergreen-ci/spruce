describe("Downstream Projects Tab", () => {
  const DOWNSTREAM_ROUTE = `/version/5f74d99ab2373627c047c5e5/downstream-projects`;

  beforeEach(() => {
    cy.visit(DOWNSTREAM_ROUTE);
  });

  it("shows number of failed patches in the Downstream tab label", () => {
    cy.dataCy("downstream-tab-badge").should("exist");
    cy.dataCy("downstream-tab-badge").should("contain.text", "1");
  });

  it("renders child patches", () => {
    cy.dataCy("project-accordion").should("have.length", 3);
    cy.dataCy("project-title").should("have.length", 3);
    cy.dataCy("downstream-tasks-table").should("have.length", 3);
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
    cy.dataCy("task-name-filter").eq(1).click();
    cy.dataCy("task-name-filter-wrapper")
      .find("input")
      .as("testnameInputWrapper");
    cy.get("@testnameInputWrapper").focus();
    cy.get("@testnameInputWrapper").type("generate-lint");
    cy.get("@testnameInputWrapper").type("{enter}");
    cy.location("search").should("not.contain", "generate-lint"); // Should not update the URL.
    cy.contains("generate-lint").should("be.visible");
  });

  it("does not push query params to the URL", () => {
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(DOWNSTREAM_ROUTE);
    });
  });
});
