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

describe("Host page title is displayed ", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.listenGQL();
    cy.preserveCookies();
  });

  it("title shows the host name", () => {
    cy.visit(`host/macos-1014-68.macstadium.build.10gen`);
    cy.get("[data-cy=page-title").should(
      "include.text",
      "Host: macos-1014-68.macstadium.build.10gen"
    );
  });
});
