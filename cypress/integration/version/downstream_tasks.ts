const patchWithDownstreamTasks = "5f74d99ab2373627c047c5e5";
const DOWNSTREAM_TASKS_ROUTE = `/version/${patchWithDownstreamTasks}/downstream-tasks`;

describe("Downstream Tasks Tab", () => {
  before(() => {
    cy.visit(DOWNSTREAM_TASKS_ROUTE);
  });

  it("shows the number of failed patches in the Downstream Tasks tab label", () => {
    cy.dataCy("downstream-tasks-tab-badge").should("exist");
    cy.dataCy("downstream-tasks-tab-badge").should("contain.text", "1");
  });

  it("shows the child patches", () => {
    cy.dataCy("project-accordion").should("have.length", 3);
    cy.dataCy("project-title").should("have.length", 3);
  });

  it("opens failed child patches by default", () => {
    cy.dataCy("project-accordion")
      .eq(1)
      .within(() => {
        cy.dataCy("tasks-table").should("be.visible");
      });
  });

  it("links to base commit", () => {
    cy.dataCy("accordion-toggle").eq(1).click();
    cy.dataCy("accordion-toggle").eq(0).click();

    cy.dataCy("downstream-task-base-commit")
      .should("have.attr", "href")
      .and(
        "includes",
        "/version/logkeeper_3c5a8112efdb98f3710b89d553af602e355aa5c9"
      );
  });

  it("filters by test name", () => {
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
      expect(loc.pathname).to.equal(DOWNSTREAM_TASKS_ROUTE);
    });
  });
});
