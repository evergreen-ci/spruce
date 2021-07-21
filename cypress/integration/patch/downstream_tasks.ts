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

    cy.dataCy("project-accordion").first().click();
    cy.dataCy("tasks-table").should("be.visible");
    cy.dataCy("project-title").should("be.visible");
  });

  it("Correctly filters results", () => {
    cy.get("tbody").first().children().should("have.length", 1);
    cy.dataCy("task-name-input").first().type("filter");
    cy.get("tbody").first().contains("No Data");
  });

  it("Does not push query params to the URL", () => {
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(DOWNSTREAM_TASKS_ROUTE);
    });
  });
});
