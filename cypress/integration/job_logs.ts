describe("Job Logs", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("renders page title and test log links when groupId is in URL", () => {
    cy.visit(`job-logs/${taskId}/${execution}/${groupId}`);
    cy.dataCy("task-link").contains(taskId);
    cy.dataCy("execution").contains(execution);
    cy.dataCy("groupId").contains(groupId);
    cy.dataCy("complete-test-logs-link")
      .should("have.attr", "href")
      .and(
        "equal",
        `https://evergreen.mongodb.com/lobster/evergreen/complete-test/${taskId}/0/llama`
      );

    // This test should not be part of the 'Llama' group.
    cy.contains(testNotInLlama).should("not.exist");

    // Check that the HTML buttons of each row contain correct href.
    cy.get("div")
      .contains("HTML")
      .each(($el, index) => {
        expect($el.attr("href")).to.eq(testHrefsLlama[index]);
      });
  });

  it("renders page title and test log links when groupId is NOT in URL", () => {
    cy.visit(`job-logs/${taskId}/${execution}`);
    cy.dataCy("task-link").contains(taskId);
    cy.dataCy("execution").contains(execution);
    cy.contains("Job Number").should("not.exist"); // don't show a groupId
    cy.dataCy("complete-test-logs-link")
      .should("have.attr", "href")
      .and(
        "equal",
        `https://evergreen.mongodb.com/lobster/evergreen/complete-test/${taskId}/0`
      );

    // This test should now be visible, as we are looking at all tests.
    cy.contains(testNotInLlama).should("exist");

    // Check that the HTML buttons of each row contain correct href.
    cy.get("div")
      .contains("HTML")
      .each(($el, index) => {
        expect($el.attr("href")).to.eq(testHrefsAll[index]);
      });
  });

  describe("when interacting with the filters on the page", () => {
    it("updates URL appropriately when page is changed", () => {
      cy.visit(`job-logs/${taskId}/${execution}/${groupId}`);
      cy.dataCy("prev-page-button").should("be.disabled");
      cy.dataCy("next-page-button").should("not.be.disabled");

      cy.dataCy("next-page-button").click();
      cy.location("search").should("include", `page=1`);
      cy.dataCy("prev-page-button").should("not.be.disabled");
      cy.dataCy("next-page-button").should("be.disabled");
    });

    it("updates URL appropriately when page size is changed", () => {
      cy.visit(`job-logs/${taskId}/${execution}/${groupId}`);
      cy.contains("10 / page").click();
      cy.contains("20 / page").click();
      cy.location("search").should("include", `limit=20&page=0`);
    });

    it("updates URL appropriately when test name filter is applied", () => {
      const filterText = "Generate";
      // Apply text filter.
      cy.dataCy("test-filter-popover").click();
      cy.dataCy("input-filter").type(`${filterText}`).type("{enter}");
      cy.dataCy("job-logs-table-row").should("have.length", 3);
      cy.location("search").should(
        "include",
        `limit=20&page=0&test=${filterText}`
      );

      // Clear text filter.
      cy.dataCy("test-filter-popover").click();
      cy.dataCy("input-filter").clear().type("{enter}");
      cy.dataCy("job-logs-table-row").should("have.length", numTestsInLlama);
      cy.location("search").should("include", `limit=20&page=0`);
    });

    it("shows message when no test results are found", () => {
      const filterText = "this_does_not_exist";
      cy.visit(`job-logs/${taskId}/${execution}`);

      cy.dataCy("test-filter-popover").click();
      cy.dataCy("input-filter").type(`${filterText}`).type("{enter}");
      cy.dataCy("job-logs-table-row").should("have.length", 0);
      cy.contains("No test results found.").should("exist");
    });
  });

  const taskId =
    "evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";
  const execution = 0;
  const groupId = "llama";

  const baseHref = "http://localhost:9090/test_log/5e4ff42d30661528ad67fafb#L";

  const testHrefsLlama = [
    `${baseHref}5555`,
    `${baseHref}22`,
    `${baseHref}36`,
    `${baseHref}41`,
    `${baseHref}116`,
    `${baseHref}132`,
    `${baseHref}152`,
    `${baseHref}236`,
    `${baseHref}251`,
    `${baseHref}261`,
  ];

  const testHrefsAll = [
    `${baseHref}5555`,
    `${baseHref}14`,
    `${baseHref}22`,
    `${baseHref}32`,
    `${baseHref}36`,
    `${baseHref}41`,
    `${baseHref}54`,
    `${baseHref}82`,
    `${baseHref}107`,
    `${baseHref}116`,
  ];

  const testNotInLlama = "TestSetVersionActivation";
  const numTestsInLlama = 13;
});
