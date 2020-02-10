Cypress.Commands.add(
  "login",
  (
    { username, password } = {
      username: "admin",
      password: "password"
    }
  ) => {
    cy.visit("/login");
    cy.get("input[name=username]").type(username);
    cy.get("input[name=password]").type(password);
    cy.get("button[id=login-submit]").click();
  }
);
