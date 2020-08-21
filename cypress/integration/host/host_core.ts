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
    cy.dataCy("banner").contains(
      "There was an error loading the host: GraphQL error: unable to find host not-real"
    );
  });
});
