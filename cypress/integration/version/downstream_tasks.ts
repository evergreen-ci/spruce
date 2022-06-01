const patchWithDownstreamTasks = "5f74d99ab2373627c047c5e5";
const DOWNSTREAM_TASKS_ROUTE = `/version/${patchWithDownstreamTasks}/downstream-tasks`;

describe("Downstream Tasks Tab", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("Shows the child patches", () => {
    cy.visit(DOWNSTREAM_TASKS_ROUTE);

    cy.dataCy("project-accordion").should("have.length", 3);
    cy.dataCy("accordion-toggle").should("be.visible");
    cy.dataCy("accordion-toggle").first().click();
    cy.dataCy("tasks-table").should("be.visible");
    cy.dataCy("project-title").should("be.visible");
  });

  it("Links to base commit", () => {
    cy.dataCy("downstream-task-base-commit").should("contain.text", "1483700");
    cy.dataCy("downstream-task-base-commit")
      .should("have.attr", "href")
      .and(
        "includes",
        "/version/logkeeper_3c5a8112efdb98f3710b89d553af602e355aa5c9"
      );
  });

  it("Filters by test name", () => {
    cy.get("tbody").first().children().should("have.length", 1);
    cy.toggleTableFilter(1);
    cy.dataCy("taskname-input-wrapper")
      .find("input")
      .focus()
      .type("filter")
      .type("{enter}");
    cy.get("tbody").first().contains("No Data");
  });

  it("Does not push query params to the URL", () => {
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(DOWNSTREAM_TASKS_ROUTE);
    });
  });
});
