const PATCH_ID = "5e4ff3abe3c3317e352062e4";
const USER_ID = "admin";
const SPRUCE_URLS = {
  version: `/version/${PATCH_ID}/tasks`,
  userPatches: `/user/${USER_ID}/patches`,
  cli: `/preferences/cli`,
};
const LEGACY_URLS = {
  version: `/version/${PATCH_ID}`,
  userPatches: `/patches/user/${USER_ID}`,
  distros: `/distros`,
};
describe("Nav Bar", () => {
  const projectCookie = "mci-project-cookie";

  it("Should have a nav bar linking to the proper page on the legacy UI", () => {
    cy.visit(SPRUCE_URLS.version);
    cy.dataCy("legacy-ui-link").should("exist");
    cy.dataCy("legacy-ui-link")
      .should("have.attr", "href")
      .and("include", LEGACY_URLS.version);
  });
  it("Navigating to a different page should change the nav link to the legacy UI", () => {
    cy.visit(SPRUCE_URLS.version);
    cy.dataCy("legacy-ui-link").should("exist");
    cy.dataCy("legacy-ui-link")
      .should("have.attr", "href")
      .and("include", LEGACY_URLS.version);
    cy.visit(SPRUCE_URLS.userPatches);
    cy.dataCy("legacy-ui-link").should("exist");
    cy.dataCy("legacy-ui-link")
      .should("have.attr", "href")
      .and("include", LEGACY_URLS.userPatches);
  });
  it("Visiting a page with no legacy equivalent should not display a nav link", () => {
    cy.visit(SPRUCE_URLS.cli);
    cy.dataCy("legacy-ui-link").should("not.exist");
  });
  it("Nav Dropdown should provide links to legacy pages", () => {
    cy.dataCy("legacy_route").should("not.exist");
    cy.dataCy("auxiliary-dropdown-link").click();
    cy.dataCy("legacy_route").should("exist");
    cy.dataCy("legacy_route")
      .should("have.attr", "href")
      .and("include", LEGACY_URLS.distros);
  });
  it("Nav Dropdown should link to patches page of most recent project if cookie exists", () => {
    cy.setCookie(projectCookie, "spruce");
    cy.visit(SPRUCE_URLS.userPatches);
    cy.dataCy("auxiliary-dropdown-link").click();
    cy.dataCy("auxiliary-dropdown-project-patches").click();
    cy.location("pathname").should("eq", "/project/spruce/patches");
  });
  it("Nav Dropdown should link to patches page of default project in SpruceConfig if cookie does not exist", () => {
    cy.clearCookie(projectCookie);
    cy.visit(SPRUCE_URLS.userPatches);
    cy.dataCy("auxiliary-dropdown-link").click();
    cy.dataCy("auxiliary-dropdown-project-patches").should(
      "have.attr",
      "href",
      "/project/evergreen/patches"
    );
    cy.dataCy("auxiliary-dropdown-project-patches").click();
    cy.location("pathname").should("eq", "/project/evergreen/patches");
  });
  it("Should update the links in the nav bar when visiting a specific project patches page", () => {
    cy.clearCookie(projectCookie);
    cy.visit("/project/evergreen/patches");
    cy.dataCy("patch-card").should("exist");

    cy.dataCy("project-health-link").should(
      "have.attr",
      "href",
      "/commits/evergreen"
    );
    cy.dataCy("auxiliary-dropdown-link").click();
    cy.dataCy("auxiliary-dropdown-project-settings").should(
      "have.attr",
      "href",
      "/project/evergreen/settings"
    );
    cy.getCookie(projectCookie).should("have.property", "value", "evergreen");
  });
  it("Should update the links in the nav bar when visiting a specific project health page", () => {
    cy.clearCookie(projectCookie);
    cy.visit("/commits/spruce");
    cy.dataCy("commit-chart-container").should("be.visible");

    cy.dataCy("auxiliary-dropdown-link").click();
    cy.dataCy("auxiliary-dropdown-project-patches").should(
      "have.attr",
      "href",
      "/project/spruce/patches"
    );
    cy.dataCy("auxiliary-dropdown-project-settings").should(
      "have.attr",
      "href",
      "/project/spruce/settings"
    );
    cy.getCookie(projectCookie).should("have.property", "value", "spruce");
  });
});
