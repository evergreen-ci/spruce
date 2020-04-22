/// <reference types="Cypress" />

const commit_queue = {
  id: "mongodb-mongo-master",
};
const COMMIT_QUEUE_ROUTE = `/commit-queue/${commit_queue.id}`;

describe("commit queue page", function() {
  beforeEach(() => {
    cy.server();
    cy.login();
  });

  it("Should render the commit queue page with one card", () => {
    cy.visit(COMMIT_QUEUE_ROUTE);
    cy.get("[data-cy=commit-queue-card]").should("have.length", 1);
  });
  it("Should be able to click on Total Code changes and toggle a drop down table", () => {
    cy.visit(COMMIT_QUEUE_ROUTE);
    cy.get("[data-cy=code-changes-table]").should("not.exist");
    cy.get("[data-cy=accordian-toggle]").click();
    cy.get("[data-cy=code-changes-table]").should("exist");
  });
});
