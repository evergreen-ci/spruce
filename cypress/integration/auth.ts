describe("Auth", () => {
  it("Unauthenticated user is redirected to login page after visiting a private route", () => {
    cy.logout();
    cy.visit("/version/123123");
    cy.location("pathname").should("equal", "/login");
  });

  it("Redirects user to My Patches page after logging in", () => {
    cy.logout();
    cy.visit("/");
    cy.enterLoginCredentials();
    cy.location("pathname").should("equal", "/user/admin/patches");
  });

  it("Can log out via the dropdown", () => {
    cy.visit("/");
    cy.location("pathname").should("equal", "/user/admin/patches");
    cy.dataCy("user-dropdown-link").click();
    cy.dataCy("log-out").click();
    cy.location("pathname").should("equal", "/login");
  });

  it("Automatically authenticates user if they are logged in", () => {
    cy.visit("/version/123123");
    cy.location("pathname").should("equal", "/version/123123");
  });

  it("Redirects user to their patches page if they are already logged in and visit login page", () => {
    cy.visit("/login");
    cy.location("pathname").should("equal", "/user/admin/patches");
  });
});
