// / <reference types="Cypress" />
// / <reference path="../support/index.d.ts" />

const versions = {
  0: "5ecedafb562343215a7ff297", // normal patch
  1: "i-dont-exist", // non existant patch
  2: "52a630633ff1227909000021", // patch 2
  3: "5e6bb9e23066155a993e0f1a", // unconfigured patch
  4: "5e94c2dfe3c3312519b59480", // unactivated patch on commit queue
  5: "evergreen_33016573166a36bd5f46b4111151899d5c4e95b1", // basecommit for versions[0]
};

const versionRoute = (id) => `/version/${id}`;

describe("Version route", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });
  describe("Redirects", () => {
    it("Redirects to configure patch page if patch is not activated", () => {
      cy.visit(versionRoute(versions[3]));
      cy.location().should((loc) => {
        expect(loc.pathname).to.equal(`/patch/${versions[3]}/configure/tasks`);
      });
    });
    it("Redirects to the commit queue page if a patch is on the commit queue and has not been activated", () => {
      cy.visit(versionRoute(versions[4]));
      cy.location().should((loc) => {
        expect(loc.pathname).to.equal(`/commit-queue/mongodb-mongo-master`);
      });
    });
    it("Throws a 404 if the version and patch doesn't exist", () => {
      cy.visit(versionRoute(versions[1]));
      cy.dataCy("toast").contains("404 (Not Found)").should("exist");
    });
  });

  describe("Metadata", () => {
    before(() => {
      cy.visit(versionRoute(versions[0]));
    });
    it("Shows patch parameters if they exist", () => {
      cy.dataCy("parameters-modal").should("not.exist");
      cy.dataCy("parameters-link").click();
      cy.dataCy("parameters-modal").should("be.visible");
      cy.get('button[aria-label="Close modal"]').click();
      cy.dataCy("parameters-modal").should("not.exist");
    });
    it("'Base commit' link in metadata links to version page of legacy UI", () => {
      cy.dataCy("patch-base-commit")
        .should("have.attr", "href")
        .and("include", `http://localhost:9090/version/${versions[5]}`);
    });
    it("Doesn't show patch parameters if they don't exist", () => {
      cy.visit(versionRoute(versions[2]));
      cy.dataCy("parameters-link").should("not.be.visible");
      cy.dataCy("parameters-modal").should("not.be.visible");
    });
  });

  describe("Build Variants", () => {
    before(() => {
      cy.preserveCookies();
      cy.visit(versionRoute(versions[0]));
    });

    it("Lists the patch's build variants", () => {
      cy.dataCy("patch-build-variant").within(
        ($variants) => Array.from($variants).length > 0
      );
    });

    it("Shows tooltip with task's name on hover", () => {
      cy.dataCy("task-square").first().trigger("mouseover");
      cy.dataCy("task-square-tooltip").within(($el) => {
        expect($el.text()).to.contain("task with status");
      });
    });

    it("Navigates to task tab and applies filters when clicking on task square", () => {
      cy.dataCy("task-square").first().click();
      cy.location("search").should("include", "statuses=success");
    });
  });
});
