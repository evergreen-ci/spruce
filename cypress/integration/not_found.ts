describe("404 Page", () => {
  it("Displays 404 page for routes that do not exist when user is logged in.", () => {
    cy.visit("/i-still-dont-exist");
    cy.dataCy("404").should("exist");
    cy.visit("/patch/5e4ff3abe3c3317e352062e4");
    cy.dataCy("404").should("not.exist");
  });
});
