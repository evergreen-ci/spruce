function enterLoginCredentials() {
  cy.get("input[name=username]").type("admin");
  cy.get("input[name=password]").type("password");
  cy.get("button[id=login-submit]").click();
}

Cypress.Commands.add("login", () => {
  cy.visit("/login");
  enterLoginCredentials();
});

Cypress.Commands.add("enterLoginCredentials", () => {
  enterLoginCredentials();
});

Cypress.Commands.add("preserveCookies", () => {
  Cypress.Cookies.preserveOnce(
    "mci-token",
    "mci-session",
    "mci-project-cookie"
  );
});

Cypress.Commands.add("listenGQL", () => {
  cy.server();
  cy.route("POST", "/graphql/query").as("gqlQuery");
});
