// / <reference types="Cypress" />
// / <reference path="../support/index.d.ts" />

const versions = {
  0: "5ecedafb562343215a7ff297", // normal patch
  1: "i-dont-exist", // non existent patch
  2: "52a630633ff1227909000021", // patch 2
  3: "5e6bb9e23066155a993e0f1a", // unconfigured patch
  4: "5e94c2dfe3c3312519b59480", // unactivated patch on commit queue
  5: "evergreen_33016573166a36bd5f46b4111151899d5c4e95b1", // basecommit for versions[0]
  6: "5e4ff3abe3c3317e352062e4",
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
      cy.validateToast("error", "Unable to find patch or version i-dont-exist");
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
    it("'Base commit' link in metadata links to version page", () => {
      cy.dataCy("patch-base-commit")
        .should("have.attr", "href")
        .and("include", `/version/${versions[5]}`);
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
      cy.dataCy("grouped-task-status-badge")
        .first()
        .trigger("mouseover")
        .within(($el) => {
          expect($el.text()).to.contain("1Undispatched");
        });
    });

    it("Navigates to task tab and applies filters when clicking on grouped task status badge", () => {
      // click on a different tab first, so that we aren't on the task tab initially
      cy.dataCy("changes-tab").first().click();
      cy.dataCy("task-tab")
        .should("have.attr", "aria-selected")
        .and("equal", "false");

      // clicking on task status badge should move to the task tab
      cy.dataCy("grouped-task-status-badge").first().click();
      cy.dataCy("task-tab")
        .should("have.attr", "aria-selected")
        .and("equal", "true");
      cy.location("search").should(
        "include",
        "statuses=undispatched-umbrella,unscheduled,aborted,blocked"
      );
    });
  });

  describe("Patch tabs", () => {
    it("Defaults to the task tab and applies default sorts when visiting a version page", () => {
      cy.visit(versionRoute(versions[0]));
      cy.location("search").should(
        "contain",
        "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC"
      );
    });

    it("Applies default sorts on task tab when switching from another tab", () => {
      cy.visit(`${versionRoute(versions[0])}/changes`);
      cy.dataCy("task-tab").first().click();
      cy.location("search").should(
        "contain",
        "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC"
      );
    });

    it("Removes sort filters when moving to a tab that isn't a task tab", () => {
      cy.visit(`${versionRoute(versions[0])}`);
      cy.location("search").should(
        "contain",
        "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC"
      );

      cy.dataCy("changes-tab").first().click();
      cy.location().should((loc) => {
        expect(loc.pathname).to.equal(
          `/version/5ecedafb562343215a7ff297/changes`
        );
      });
      cy.location("search").should(
        "not.contain",
        "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC"
      );
    });
  });

  describe("Page title", () => {
    before(() => {
      cy.preserveCookies();
      cy.visit(versionRoute(versions[6]));
    });
    it("Should include a link to Jira", () => {
      cy.dataCy("page-title")
        .contains("a", "EVG-7425")
        .should("have.attr", "href", "https:///browse/EVG-7425");
    });

    it("Should include a link to GitHub", () => {
      cy.dataCy("page-title")
        .contains("a", "https://github.com/evergreen-ci/evergreen/pull/3186")
        .should(
          "have.attr",
          "href",
          "https://github.com/evergreen-ci/evergreen/pull/3186"
        );
    });
  });
});
