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

    cy.dataCy("project-accordion").eq(1).click();
    cy.dataCy("tasks-table").should("be.visible");
    cy.dataCy("project-title").should("be.visible");
  });

  it("Correctly filters results", () => {
    cy.get("tbody").eq(1).children().should("have.length", 10);
    cy.dataCy("task-status-filter").eq(1).click();
    cy.dataCy("checkbox").eq(1).click({ force: true });
    cy.get("tbody").eq(1).children().should("have.length", 3);
  });

  it("Does not push query params to the URL", () => {
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(DOWNSTREAM_TASKS_ROUTE);
    });
  });
});
