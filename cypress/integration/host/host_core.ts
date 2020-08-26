describe("Host load page with nonexistent host", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.listenGQL();
    cy.preserveCookies();
  });

  it("Should show an error message when navigating to a nonexistent host id", () => {
    cy.visit("host/not-real");
    cy.dataCy("banner").should("exist");
  });
});
