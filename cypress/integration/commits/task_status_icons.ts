describe("Waterfall Task Status Icons", () => {
  before(() => {
    cy.login();
    cy.visit(route);
  });

  it("Grouped status icons should link to the version page with appropiate table filters", () => {
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

  const route =
    "/commits/evergreen?chartType=soeiantsrein&statuses=all,failed-umbrella,failed,task-timed-out,test-timed-out,known-issue,success,running-umbrella,started,dispatched,scheduled-umbrella,will-run,pending,unstarted,system-failure-umbrella,system-failed,system-timed-out,system-unresponsive,setup-failed,inactive";
});
