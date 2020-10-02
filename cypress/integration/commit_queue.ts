// / <reference types="Cypress" />

const commitQueue = {
  id1: "mongodb-mongo-master",
  id2: "mongodb-mongo-test",
  id3: "non-existant-item",
  id4: "evergreen",
};
const COMMIT_QUEUE_ROUTE_1 = `/commit-queue/${commitQueue.id1}`;
const COMMIT_QUEUE_ROUTE_2 = `/commit-queue/${commitQueue.id2}`;
const INVALID_COMMIT_QUEUE_ROUTE = `/commit-queue/${commitQueue.id3}`;
const COMMIT_QUEUE_ROUTE_4 = `/commit-queue/${commitQueue.id4}`;

describe("commit queue page", () => {
  before(() => {
    cy.login();
  });
  beforeEach(() => {
    cy.preserveCookies();
  });

  it("Should render the commit queue page with one card", () => {
    cy.visit(COMMIT_QUEUE_ROUTE_1);
    cy.get("[data-cy=commit-queue-card]").should("have.length", 1);
  });

  it("Clicking on Total Code changes should toggle a drop down table", () => {
    cy.visit(COMMIT_QUEUE_ROUTE_1);
    cy.get("[data-cy=code-changes-table]").should("not.exist");
    cy.get("[data-cy=accordian-toggle]").click();
    cy.get("[data-cy=code-changes-table]").should("exist");
  });

  it("visiting a page with multiple sets of code changes should have multiple tables", () => {
    cy.visit(COMMIT_QUEUE_ROUTE_2);
    cy.get("[data-cy=accordian-toggle]").should("have.length", 2);
  });

  xit("visiting a non existant commit queue page should display an error", () => {
    cy.visit(INVALID_COMMIT_QUEUE_ROUTE);
    // TODO: converting these requests to an xhr requests(in cypress/support/hooks.js)
    // breaks the onError callback apollo uses to trigger the banner. So the functionality
    // Will fail when running in cypress. This should be refactored to remove that dependency
    cy.dataCy("banner").should("exist");
    cy.dataCy("banner").should("contain.text", `Some Error Message`);
  });

  it("Clicking on remove a patch from the commit queue should work", () => {
    cy.visit(COMMIT_QUEUE_ROUTE_1);
    cy.get("[data-cy=commit-queue-card]").should("exist");
    cy.get("[data-cy=commit-queue-patch-button]").should("exist");
    cy.get("[data-cy=commit-queue-patch-button]").click();
    cy.get("[data-cy=commit-queue-card]").should("not.exist");
  });

  it("should display the commit queue message if there is one", () => {
    cy.visit(COMMIT_QUEUE_ROUTE_4);
    cy.dataCy("commit-queue-message").should("exist");
    cy.dataCy("commit-queue-message").should(
      "contain.text",
      "This is the commit queue"
    );
  });
});
