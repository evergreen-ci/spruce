describe("Project Patches Page", () => {
  const adminPatchesRoute = "/user/admin/patches";
  const evergreenPatchesRoute = "/project/evergreen/patches";

  it("Should link to project patches page from the user patches page", () => {
    cy.visit(adminPatchesRoute);
    cy.dataCy("project-patches-link").first().click();
    cy.location("pathname").should("eq", evergreenPatchesRoute);
    cy.dataCy("patch-card").should("exist");
  });

  it("Should link to author patches page from the project patches page", () => {
    cy.visit(evergreenPatchesRoute);
    cy.dataCy("user-patches-link").first().click();
    cy.location("pathname").should("eq", adminPatchesRoute);
    cy.dataCy("patch-card").should("exist");
  });

  it("Project dropdown navigates to another project patches page upon selection", () => {
    cy.visit(evergreenPatchesRoute);
    cy.dataCy("project-select").click();
    cy.dataCy("project-display-name").contains("Spruce").click();
    cy.location("pathname").should("eq", "/project/spruce/patches");
  });
});
