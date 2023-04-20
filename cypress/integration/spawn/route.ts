describe("Navigating to Spawn Host and Spawn Volume pages", () => {
  it("Navigating to /spawn will redirect to /spawn/host", () => {
    cy.visit("/spawn");
    cy.location("pathname").should("eq", "/spawn/host");
  });

  it("Navigating to /spawn/not-a-route will redirect to /spawn/host", () => {
    cy.visit("/spawn/not-a-route");
    cy.location("pathname").should("eq", "/spawn/host");
  });

  it("Clicking on the Volume side nav item will redirect to /spawn/volume", () => {
    cy.visit("/spawn/host");
    cy.dataCy("volume-nav-tab").click();
    cy.location("pathname").should("eq", "/spawn/volume");
  });

  it("Clicking on the Host side nav item will redirect to /spawn/host", () => {
    cy.visit("/spawn/volume");
    cy.dataCy("host-nav-tab").click();
    cy.location("pathname").should("eq", "/spawn/host");
  });
});
