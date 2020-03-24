const patchId = "5e4ff3abe3c3317e352062e4";
const patchRoute = `/patch/${patchId}`;
const patchRouteChanges = `${patchRoute}/changes`;
const patchRouteTasks = `${patchRoute}/tasks`;

const locationPathEquals = path =>
  cy.location().should(loc => expect(loc.pathname).to.eq(path));

describe("Tabs", () => {
  beforeEach(() => {
    cy.login();
  });
  describe("patch page", () => {
    it("selects tasks tab by default", () => {
      cy.visit(patchRoute);
      cy.get("button[id=task-tab]")
        .should("have.attr", "aria-selected")
        .and("eq", "true");
    });

    it("includes selected tab name in url patchRoute", () => {
      cy.visit(patchRoute);
      locationPathEquals(patchRouteTasks);
    });

    it("updates the url patchRoute when another tab is selected", () => {
      cy.visit(patchRoute);
      cy.get("button[id=changes-tab]").click();
      locationPathEquals(patchRouteChanges);
    });

    it("replaces invalid tab names in url patchRoute with default", () => {
      cy.visit(`${patchRoute}/chicken`);
      locationPathEquals(patchRouteTasks);
    });

    it("switching tabs from task to changes to tasks doesn't crash the app", () => {
      cy.visit(patchRoute);
      cy.get("button[id=changes-tab]").click();
      cy.get("button[id=task-tab]").click();
      cy.get("#task-count").should("exist");
    });
  });
});
