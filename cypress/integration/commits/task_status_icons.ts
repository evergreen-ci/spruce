describe("Waterfall Task Status Icons", () => {
  before(() => {
    cy.login();
    const route =
      "/commits/evergreen?chartType=percentage&statuses=all,failed-umbrella,failed,task-timed-out,test-timed-out,known-issue,success,running-umbrella,started,dispatched,scheduled-umbrella,will-run,pending,unstarted,system-failure-umbrella,system-failed,system-timed-out,system-unresponsive,setup-failed,inactive";
    cy.visit(route);
  });

  beforeEach(() => {
    // prevent icons from clipping
    cy.viewport(1920, 1200);
    cy.preserveCookies();
  });

  describe("Grouped Icons", () => {
    it("Grouped status icons should be rendered on waterfall page", () => {
      cy.dataCy("grouped-task-status-badge").should("be.visible");
    });
  });

  describe("Single task status icon", () => {
    it("Single task status icons should be rendered on the waterfall page", () => {
      cy.dataCy("task-status-icon").should("be.visible");
    });
  });
});
