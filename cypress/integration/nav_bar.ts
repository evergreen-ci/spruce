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
  before(() => {
    cy.login();
  });
  beforeEach(() => {
    cy.server();
    cy.preserveCookies();
  });

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
  it.skip("Nav Dropdown should link to patches page of most recent project if cookie exists", () => {
    cy.setCookie("mci-project-cookie", "spruce");
    cy.visit(SPRUCE_URLS.userPatches);
    cy.dataCy("auxiliary-dropdown-link").click();
    cy.dataCy("auxiliary-dropdown-project-patches").click();
    cy.location("pathname").should("eq", "/project/spruce/patches");
  });
  it.skip("Nav Dropdown should link to patches page of default project in SpruceConfig if cookie does not exist", () => {
    cy.clearCookie("mci-project-cookie");
    cy.visit(SPRUCE_URLS.userPatches);
    cy.dataCy("auxiliary-dropdown-link").click();
    cy.dataCy("auxiliary-dropdown-project-patches").click();
    cy.location("pathname").should("eq", "/project/evergreen/patches");
  });
});
