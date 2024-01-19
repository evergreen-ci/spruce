const buildId = "7e208050e166b1a9025c817b67eee48d";
const invalidBuildId = "9b07c7f9677e49ddae4c53076ca4f4ca";

describe("Job logs page", () => {
  beforeEach(() => {
    cy.visit(`job-logs/${buildId}`);
  });

  it("renders a table with test links", () => {
    cy.dataCy("job-logs-table-row").should("have.length", 105);

    // Sort is not enabled
    cy.get("th")
      .should("have.length", 1)
      .then((th) => {
        cy.wrap(th).should("not.have.attr", "aria-sort");
      });

    cy.dataCy("complete-test-logs-link")
      .should("have.attr", "href")
      .then((href) => {
        cy.wrap(href).should(
          "contain",
          "/resmoke/7e208050e166b1a9025c817b67eee48d/all",
        );
      });
  });
});

describe("Invalid job logs page", () => {
  beforeEach(() => {
    cy.visit(`job-logs/${invalidBuildId}`);
  });

  it("shows an error toast", () => {
    cy.validateToast(
      "error",
      "There was an error retrieving logs for this build: Logkeeper returned HTTP status 404",
    );
  });
});
