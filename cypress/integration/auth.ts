describe("Auth", () => {
  it("Unauthenticated user is redirected to login page after visiting a private route", () => {
    cy.clearCookie("mci-token");
    cy.visit("/version/123123");
    cy.url().should("include", "/login");
  });

  // The dev login page is broken due to EVG-19027.
  it.skip("Redirects user to My Patches page after logging in.", () => {
    cy.clearCookie("mci-token");
    cy.visit("/");
    cy.enterLoginCredentials();
    cy.url().should("include", "/user/admin/patches");
  });

  it("Automatically authenticates user if they are logged in", () => {
    cy.visit("/version/123123");
    cy.url().should("include", "/version/123123");
  });

  it("Redirects user to their patches page if they are already logged in and visit login page", () => {
    cy.visit("/login");
    cy.url().should("include", "/user/admin/patches");
  });
});
