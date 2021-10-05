describe("Waterfall Task Status Icons", () => {
  before(() => {
    cy.login();
    const route =
      "/commits/evergreen?chartType=percentage&statuses=all,failed-umbrella,failed,task-timed-out,test-timed-out,known-issue,success,running-umbrella,started,dispatched,scheduled-umbrella,will-run,pending,unstarted,system-failure-umbrella,system-failed,system-timed-out,system-unresponsive,setup-failed,inactive";
    cy.visit(route);
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  describe("Grouped Icons", () => {
    it("Grouped status icons should link to the version page with appropriate table filters", () => {
      const hrefs = [
        "/version/5e4ff3abe3c3317e352062e4/tasks?statuses=success&variant=%5Elint%24",
        "/version/5e4ff3abe3c3317e352062e4/tasks?statuses=running-umbrella,started,dispatched&variant=%5Elint%24",
        "/version/5e4ff3abe3c3317e352062e4/tasks?statuses=success&variant=%5Eubuntu1604%24",
        "/version/5e4ff3abe3c3317e352062e4/tasks?statuses=running-umbrella,started,dispatched&variant=%5Evariant%24",
        "/version/evergreen_33016573166a36bd5f46b4111151899d5c4e95b1/tasks?statuses=success&variant=%5Eubuntu1604%24",
      ];
      cy.dataCy("grouped-task-status-badge").each(($el, index) => {
        cy.wrap($el)
          .find("a")
          .should("have.attr", "href")
          .and("equals", hrefs[index]);
      });
    });

    it("Grouped status icon should display test status counts on hover", () => {
      cy.dataCy("grouped-task-status-badge").first().trigger("mouseover");
      cy.dataCy("grouped-task-status-badge-tooltip")
        .first()
        .contains("1 Success");
    });
  });

  describe("Single task status icon", () => {
    it("Single task status icons should link to the corresponding task page", () => {
      const hrefs = [
        "/task/evergreen_ubuntu1604_test_annotations_b_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
        "/task/evergreen_ubuntu1604_test_cloud_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
        "/task/evergreen_ubuntu1604_test_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
      ];
      cy.dataCy("task-status-icon").each(($el, index) => {
        cy.wrap($el).should("have.attr", "href").and("equals", hrefs[index]);
      });
    });

    it("Single task status icons should display test name and duration on hover", () => {
      cy.visit("/commits/mongodb-mongo-master");
      cy.dataCy("task-status-icon").first().trigger("mouseover");
      cy.dataCy("failed-task-status-icon-tooltip-title").contains(
        "validate_commit_message - 1m 28s"
      );
    });
  });
});
