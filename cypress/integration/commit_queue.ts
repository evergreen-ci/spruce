// / <reference types="Cypress" />

const commitQueue = {
  id1: "mongodb-mongo-master",
  id2: "mongodb-mongo-test",
  id3: "non-existant-item",
};
const COMMIT_QUEUE_ROUTE_1 = `/commit-queue/${commitQueue.id1}`;
const COMMIT_QUEUE_ROUTE_2 = `/commit-queue/${commitQueue.id2}`;
const INVALID_COMMIT_QUEUE_ROUTE = `/commit-queue/${commitQueue.id3}`;

describe("commit queue page", () => {
  before(() => {
    cy.login();
  });
  beforeEach(() => {
    cy.server();
    cy.listenGQL();
    cy.preserveCookies();
  });

  it("Should render the commit queue page with one card", () => {
    cy.visit(COMMIT_QUEUE_ROUTE_1);
    cy.waitForGQL("CommitQueue");
    cy.get("@gqlQuery").then(() => {
      cy.get("[data-cy=commit-queue-card]").should("have.length", 1);
    });
  });

  it("Clicking on Total Code changes should toggle a drop down table", () => {
    cy.visit(COMMIT_QUEUE_ROUTE_1);
    cy.get("[data-cy=code-changes-table]").should("not.exist");
    cy.get("[data-cy=accordian-toggle]").click();
    cy.get("[data-cy=code-changes-table]").should("exist");
  });

  it("visiting a page with multiple sets of code changes should have multiple tables", () => {
    cy.visit(COMMIT_QUEUE_ROUTE_2);
    cy.waitForGQL("CommitQueue");
    cy.get("@gqlQuery").then(($xhr) => {
      const codeChanges =
        $xhr.response.body.data.commitQueue.queue[0].patch.moduleCodeChanges;
      cy.get("[data-cy=accordian-toggle]").should(
        "have.length",
        codeChanges.length
      );
    });
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
    cy.waitForGQL("CommitQueue");
    cy.get("[data-cy=commit-queue-card]").should("not.exist");
  });
});
