describe("Restarting and scheduling mainline commits", () => {
  before(() => {
    cy.login();
  });
  beforeEach(() => {
    cy.preserveCookies();
  });
  it("should be able to schedule inactive mainline commit tasks", () => {
    cy.visit("/version/spruce_e695f654c8b4b959d3e12e71696c3e318bcd4c33");
    cy.dataCy("schedule-patch").should("exist");
    cy.dataCy("schedule-patch").should("not.be.disabled");
    cy.dataCy("schedule-patch").click();
    cy.dataCy("schedule-tasks-modal").should("be.visible");
    cy.dataCy("schedule-tasks-modal").within(() => {
      cy.dataCy("accordion-toggle").click();
      cy.getInputByLabel("check_codegen").should("exist");
      cy.getInputByLabel("check_codegen").click({ force: true });
      cy.get("button").contains("Schedule").should("not.be.disabled");
      cy.get("button").contains("Schedule").click({ force: true });
    });
    cy.validateToast("success", "Successfully scheduled tasks!");
  });
});
