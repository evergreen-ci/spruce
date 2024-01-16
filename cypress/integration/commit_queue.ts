const commitQueue = {
  id1: "mongodb-mongo-master",
  id2: "mongodb-mongo-test",
  id3: "non-existent-item",
  id4: "evergreen",
};
const COMMIT_QUEUE_ROUTE_1 = `/commit-queue/${commitQueue.id1}`;
const COMMIT_QUEUE_ROUTE_2 = `/commit-queue/${commitQueue.id2}`;
const INVALID_COMMIT_QUEUE_ROUTE = `/commit-queue/${commitQueue.id3}`;
const COMMIT_QUEUE_ROUTE_4 = `/commit-queue/${commitQueue.id4}`;

describe("commit queue page", () => {
  describe(COMMIT_QUEUE_ROUTE_1, () => {
    beforeEach(() => {
      cy.visit(COMMIT_QUEUE_ROUTE_1);
    });

    it("Should render the commit queue page with one card", () => {
      cy.dataCy("commit-queue-card").should("have.length", 1);
    });

    it("Clicking on 'Total code changes' should show the code changes table", () => {
      cy.dataCy("code-changes-table").should("not.be.visible");
      cy.dataCy("accordion-toggle").click();
      cy.dataCy("code-changes-table").should("be.visible");
    });

    it("Should be able to remove a patch from the commit queue", () => {
      cy.dataCy("commit-queue-card").should("exist");
      cy.dataCy("commit-queue-patch-button").should("exist");
      cy.dataCy("commit-queue-patch-button").click();
      cy.dataCy("commit-queue-confirmation-modal").should("be.visible");
      cy.dataCy("commit-queue-confirmation-modal").within(() => {
        cy.contains("button", "Remove").click();
      });
      cy.dataCy("commit-queue-confirmation-modal").should("not.exist");
      cy.dataCy("commit-queue-card").should("not.exist");
    });
  });

  describe(COMMIT_QUEUE_ROUTE_2, () => {
    it("visiting a page with multiple sets of code changes should have multiple tables", () => {
      cy.visit(COMMIT_QUEUE_ROUTE_2);
      cy.dataCy("accordion-toggle").should("have.length", 4);
    });
  });

  describe(COMMIT_QUEUE_ROUTE_4, () => {
    beforeEach(() => {
      cy.visit(COMMIT_QUEUE_ROUTE_4);
    });

    it("should display the commit queue message if there is one", () => {
      cy.dataCy("commit-queue-message").should("exist");
      cy.dataCy("commit-queue-message").should(
        "contain.text",
        "This is the commit queue",
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
            ][index],
          ),
      );
    });
  });

  describe(INVALID_COMMIT_QUEUE_ROUTE, () => {
    it("visiting a nonexistent commit queue page should display an error", () => {
      cy.visit(INVALID_COMMIT_QUEUE_ROUTE);
      cy.validateToast("error", "There was an error loading the commit queue");
    });
  });
});
