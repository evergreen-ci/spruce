const route = "/preferences/publickeys";

describe("Public Key Management Page", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("displays the user's public keys", () => {
    cy.visit(route);
    cy.dataCy("table-key-name").each(($el, index) =>
      cy.wrap($el).contains(publicKeys[index])
    );
  });
});

const publicKeys = [
  "a loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong name",
  "bKey",
];
