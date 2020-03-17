/// <reference types="Cypress" />

const patch = {
  id: "5e4ff3abe3c3317e352062e4",
  desc:
    "'evergreen-ci/evergreen' pull request #3186 by bsamek: EVG-7425 Don't send ShouldExit to unprovisioned hosts (https://github.com/evergreen-ci/evergreen/pull/3186)"
};
const path = `/patch/${patch.id}`;
const pathTasks = `${path}/tasks`;
const pathChanges = `${path}/changes`;

const badPatch = {
  id: "i-dont-exist"
};

const locationPathEquals = path =>
  cy.location().should(loc => expect(loc.pathname).to.eq(path));

const locationHasUpdatedParams = (sortBy, sortDir) => {
  cy.location().should(loc => {
    expect(loc.pathname).to.equal(pathTasks);
    expect(loc.search).to.include(`sortBy=${sortBy}`);
    if (!sortDir) {
      expect(loc.search).to.not.include("sortDir");
    } else {
      expect(loc.search).to.include(`sortDir=${sortDir}`);
    }
  });
};

describe("Patch route", function() {
  beforeEach(() => {
    cy.login();
  });

  it("Loads patch data and renders it on the page", function() {
    cy.visit(`/patch/${patch.id}`);
    cy.get("h1[id=patch-name]").should("include.text", patch.desc);
  });

  it("'Base commit' link in metadata links to version page of legacy UI", function() {
    cy.visit(`/patch/${patch.id}`);
    cy.get("a[id=patch-base-commit]")
      .should("have.attr", "href")
      .and("eq", "http://localhost:9090/version/5e4ff3abe3c3317e352062e4");
  });

  it("Shows an error page if there was a problem loading data", () => {
    cy.visit(`/patch/${badPatch.id}`);
    cy.get("div[id=patch-error]").should("exist");
  });

  describe("Build Variants", () => {
    it("Lists all of the patch's build variants", () => {});
    it("Lists all tasks for each build variant", () => {});
    it("Displays tasks color according to its status", () => {});
    it("Navigates to task page from clicking task square", () => {});
  });

  describe("Tabs", () => {
    it("selects tasks tasb by default", () => {
      cy.visit(path);
      cy.get("button[id=task-tab]")
        .should("have.attr", "aria-selected")
        .and("eq", "true");
    });

    it("includes selected tab name in url path", () => {
      cy.visit(path);
      locationPathEquals(pathTasks);
    });

    it("updates the url path when another tab is selected", () => {
      cy.visit(path);
      cy.get("button[id=changes-tab]").click();
      locationPathEquals(pathChanges);
    });

    it("replaces invalid tab names in url path with default", () => {
      cy.visit(`${path}/chicken`);
      locationPathEquals(pathTasks);
    });

    describe("Tasks Table", () => {
      it("updates the url when column headers are clicked", () => {
        cy.visit(path);

        cy.get("th.cy-task-table-col-name").click();
        locationHasUpdatedParams("NAME", 1);

        cy.get("th.cy-task-table-col-name").click();
        locationHasUpdatedParams("NAME", -1);

        cy.get("th.cy-task-table-col-name").click();
        locationHasUpdatedParams("NAME");

        cy.get("th.cy-task-table-col-variant").click();
        locationHasUpdatedParams("VARIANT", 1);

        cy.get("th.cy-task-table-col-variant").click();
        locationHasUpdatedParams("VARIANT", -1);

        cy.get("th.cy-task-table-col-variant").click();
        locationHasUpdatedParams("VARIANT");
      });

      it("clicking task name goes to task page for that task", () => {
        cy.visit(path);
        cy.get("td.cy-task-table-col-name:first").within(() => {
          cy.get("a")
            .should("have.attr", "href")
            .and("include", "/task");
        });
      });
    });
  });
});
