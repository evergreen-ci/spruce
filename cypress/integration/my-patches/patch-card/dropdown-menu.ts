describe("Dropdown Menu of Patch Actions", () => {
  before(() => {
    cy.login();
  });
  beforeEach(() => {
    cy.preserveCookies();
    cy.visit("/");
  });

  it("'Reconfigure' link takes user to patch configure page", () => {
    cy.dataCy("patch-card")
      .first()
      .within(() => {
        cy.dataCy("patch-card-dropdown").click();
        cy.dataCy("reconfigure-link").click({ force: true });
        cy.location("pathname").should("include", `/configure`);
      });
  });

  it("'Schedule' link opens popconfirm and schedules patch", () => {
    cy.dataCy("patch-card")
      .first()
      .next()
      .within(() => {
        cy.dataCy("patch-card-dropdown").click();
        cy.dataCy("schedule-patch").click({ force: true });
      });
    cy.get(".ant-btn.ant-btn-primary.ant-btn-sm")
      .contains("Yes")
      .click({ force: true });
    cy.dataCy("banner").should("exist");
    cy.dataCy("card-dropdown").should("not.exist");
  });

  it("'Unschedule' link opens popconfirm and schedules patch", () => {
    cy.dataCy("patch-card")
      .first()
      .next()
      .within(() => {
        cy.dataCy("patch-card-dropdown").click();
        cy.dataCy("unschedule-patch").click({ force: true });
      });
    cy.dataCy("abort-checkbox").check({ force: true });
    cy.get(".ant-btn.ant-btn-primary.ant-btn-sm")
      .contains("Yes")
      .click({ force: true });
    cy.dataCy("banner").should("exist");
    cy.dataCy("card-dropdown").should("not.exist");
  });

  it("'Restart' link shows restart patch modal", () => {
    cy.dataCy("patch-card")
      .first()
      .next()
      .within(() => {
        cy.dataCy("patch-card-dropdown").click();
        cy.dataCy("restart-patch").click({ force: true });
      });
    cy.dataCy("accordian-toggle")
      .first()
      .click();
    cy.dataCy("patch-status-selector-container")
      .children()
      .first()
      .click({ force: true });
    cy.dataCy("restart-patch-button").click();
    cy.dataCy("banner").should("exist");
    cy.dataCy("card-dropdown").should("not.exist");
  });
});
