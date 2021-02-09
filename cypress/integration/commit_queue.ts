// / <reference types="Cypress" />

const commitQueue = {
  id1: "mongodb-mongo-master",
  id2: "mongodb-mongo-test",
  id3: "non-existent-item",
  id4: "evergreen",
  id5: "logkeeper",
};
const COMMIT_QUEUE_ROUTE_1 = `/commit-queue/${commitQueue.id1}`;
const COMMIT_QUEUE_ROUTE_2 = `/commit-queue/${commitQueue.id2}`;
const INVALID_COMMIT_QUEUE_ROUTE = `/commit-queue/${commitQueue.id3}`;
const COMMIT_QUEUE_ROUTE_4 = `/commit-queue/${commitQueue.id4}`;
const COMMIT_QUEUE_ROUTE_PR = `/commit-queue/${commitQueue.id5}`;

describe("commit queue page", () => {
  before(() => {
    cy.login();
  });
  beforeEach(() => {
    cy.preserveCookies();
  });

  it("Should render the commit queue page with one card", () => {
    cy.visit(COMMIT_QUEUE_ROUTE_1);
    cy.dataCy("commit-queue-card").should("have.length", 1);
  });

  it("Clicking on Total Code changes should toggle a drop down table", () => {
    cy.visit(COMMIT_QUEUE_ROUTE_1);
    cy.dataCy("code-changes-table").should("not.exist");
    cy.dataCy("accordian-toggle").click();
    cy.dataCy("code-changes-table").should("exist");
  });

  it("visiting a page with multiple sets of code changes should have multiple tables", () => {
    cy.visit(COMMIT_QUEUE_ROUTE_2);
    cy.dataCy("accordian-toggle").should("have.length", 4);
  });

  xit("visiting a non existent commit queue page should display an error", () => {
    cy.visit(INVALID_COMMIT_QUEUE_ROUTE);
    // TODO: converting these requests to an xhr requests(in cypress/support/hooks.js)
    // breaks the onError callback apollo uses to trigger the toast. So the functionality
    // Will fail when running in cypress. This should be refactored to remove that dependency
    cy.dataCy("toast").should("exist");
    cy.dataCy("toast").should("contain.text", `Some Error Message`);
  });

  it("Clicking on remove a patch from the commit queue should work", () => {
    cy.visit(COMMIT_QUEUE_ROUTE_1);
    cy.dataCy("commit-queue-card").should("exist");
    cy.dataCy("commit-queue-patch-button").should("exist");
    cy.dataCy("commit-queue-patch-button").click();
    cy.dataCy("commit-queue-card").should("not.exist");
  });

  it("Clicking on remove a patch for the PR commit queue should work", () => {
    cy.visit(COMMIT_QUEUE_ROUTE_PR);
    cy.dataCy("commit-queue-card").should("have.length", 1);
    cy.dataCy("commit-queue-patch-button").should("exist");
    cy.dataCy("commit-queue-patch-button").click();
    cy.dataCy("commit-queue-card").should("not.exist");
  });

  it("should display the commit queue message if there is one", () => {
    cy.visit(COMMIT_QUEUE_ROUTE_4);
    cy.dataCy("commit-queue-message").should("exist");
    cy.dataCy("commit-queue-message").should(
      "contain.text",
      "This is the commit queue"
    );
  });

  it("should display the commit description above each table", () => {
    cy.dataCy("commit-name").each(($el, index) =>
      cy
        .wrap($el)
        .contains(
          [
            "ramen is amazing",
            "some other commit",
            "crazy cool commit!!!",
            "mega commit",
          ][index]
        )
    );
  });
});
