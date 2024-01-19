describe("Tabs", () => {
  describe("Patches page", () => {
    it("Defaults to the task tab and applies default sorts", () => {
      cy.visit(patchRoute);
      cy.get(`button[data-cy='${patches.tasks.btn}']`)
        .should("have.attr", "aria-selected")
        .and("eq", "true");
      locationPathEquals(patches.tasks.route);
      cy.location("search").should(
        "contain",
        "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC",
      );
    });

    it("Applies default sorts on task duration tab", () => {
      cy.visit(`${patchRoute}/task-duration`);
      cy.get(`button[data-cy='${patches.duration.btn}']`)
        .should("have.attr", "aria-selected")
        .and("eq", "true");
      locationPathEquals(patches.duration.route);
      cy.location("search").should("contain", "duration=DESC");
    });

    it("Applies default sorts on task tab when switching from another tab without any filters", () => {
      cy.visit(`${patchRoute}/changes`);
      cy.get(`button[data-cy='${patches.changes.btn}']`)
        .should("have.attr", "aria-selected")
        .and("eq", "true");
      locationPathEquals(patches.changes.route);
      cy.location("search").should(
        "not.contain",
        "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC",
      );

      cy.dataCy("task-tab").first().click();
      locationPathEquals(patches.tasks.route);
      cy.location("search").should(
        "contain",
        "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC",
      );
    });

    it("Retains filters even when moving to a tab that isn't a task tab", () => {
      cy.visit(patchRoute);
      cy.location("search").should(
        "contain",
        "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC",
      );

      cy.get(`button[data-cy='${patches.changes.btn}']`).click();
      locationPathEquals(patches.changes.route);
      cy.location("search").should(
        "contain",
        "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC",
      );
    });

    it("replaces invalid tab names in url path with default", () => {
      cy.visit(`${patchRoute}/chicken`);
      locationPathEquals(patches.tasks.route);
    });

    it("should be able to toggle between tabs", () => {
      cy.visit(patchRoute);
      cy.get(`button[data-cy='${patches.changes.btn}']`).click();
      cy.dataCy("code-changes").should("exist");
      cy.get(`button[data-cy='${patches.tasks.btn}']`).click();
      cy.dataCy("total-count").should("exist");
    });
  });

  describe("Task page", () => {
    it("selects tests tab by default if there are tests and no tab is provided in url", () => {
      cy.visit(taskRoute(tasks.withTests));
      cy.dataCy(task.tests.btn)
        .should("have.attr", "aria-selected")
        .and("eq", "true");
    });

    it("selects logs tab by default if there are no tests and no tab is provided in url", () => {
      cy.visit(taskRoute(tasks.noTests));
      cy.get(`button[data-cy='${task.logs.btn}']`)
        .should("have.attr", "aria-selected")
        .and("eq", "true");
    });

    it("toggling between tabs updates the url with the selected tab name", () => {
      cy.visit(taskRoute(tasks.withTests));
      locationPathEquals(task.tests.route);
      cy.get(`button[data-cy='${task.logs.btn}']`).click();
      locationPathEquals(task.logs.route);
      cy.get(`button[data-cy='${task.files.btn}']`).click();
      locationPathEquals(task.files.route);
    });

    it("replaces invalid tab names in url path with a default route", () => {
      cy.visit(`${taskRoute(tasks.withTests)}/chicken`);
      locationPathEquals(task.tests.route);
    });

    it("Should only display a badge with the number of failed tests if they exist", () => {
      cy.visit(taskRoute(tasks.withTests));
      cy.dataCy("tests-tab-badge").contains("1");
      cy.visit(taskRoute(tasks.noFailedTests));
      cy.dataCy("tests-tab-badge").should("not.exist");
    });

    it("Should display a badge with the number of files in the Files tab", () => {
      cy.visit(task.files.route);
      cy.dataCy("files-tab-badge").contains("0");
    });

    it("Should default to the execution task tab if the task is a display task", () => {
      cy.visit(taskRoute(tasks.displayTask));
      cy.get(`button[data-cy='${task.display.btn}']`)
        .should("have.attr", "aria-selected")
        .and("eq", "true");
    });
  });

  const patchId = "5ecedafb562343215a7ff297";
  const patchRoute = `/version/${patchId}`;
  const patches = {
    changes: { route: `${patchRoute}/changes`, btn: "changes-tab" },
    tasks: { route: `${patchRoute}/tasks`, btn: "task-tab" },
    duration: { route: `${patchRoute}/task-duration`, btn: "duration-tab" },
  };

  const tasks = {
    withTests:
      "evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
    noFailedTests:
      "evergreen_ubuntu1604_test_auth_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
    noTests:
      "evergreen_ubuntu1604_test_annotations_b_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
    displayTask: "evergreen_ubuntu1604_89",
  };

  const taskRoute = (id: string) => `/task/${id}`;

  const task = {
    logs: {
      route: `${taskRoute(tasks.withTests)}/logs`,
      btn: "task-logs-tab",
    },
    tests: {
      route: `${taskRoute(tasks.withTests)}/tests`,
      btn: "task-tests-tab",
    },
    files: {
      route: `${taskRoute(tasks.withTests)}/files`,
      btn: "task-files-tab",
    },
    display: {
      route: `${taskRoute(tasks.displayTask)}/execution-task`,
      btn: "task-execution-tab",
    },
  };

  const locationPathEquals = (path) =>
    cy.location().should((loc) => expect(loc.pathname).to.eq(path));
});
