describe("task logs", () => {
  const LOGS_ROUTE =
    "/task/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/logs";

  const taskLogsButton = 'button[id="cy-task-option"]';
  const agentLogsButton = 'button[id="cy-agent-option"]';
  const systemLogsButton = 'button[id="cy-system-option"]';
  const eventLogsButton = 'button[id="cy-event-option"]';
  const allLogsButton = 'button[id="cy-all-option"]';

  beforeEach(() => {
    cy.visit(LOGS_ROUTE);
  });

  it("Should default to the  task logs page when logtype is not indicated in URL query param", () => {
    cy.get(taskLogsButton)
      .should("have.attr", "aria-selected")
      .and("eq", "true");
  });

  it("Should display 'No logs' and disable Parsley, HTML and Raw buttons when no logs are found.", () => {
    cy.dataCy("cy-no-logs").contains("No logs");
    cy.dataCy("parsley-log-btn")
      .should("have.attr", "aria-disabled")
      .and("eq", "true");
    cy.dataCy("html-log-btn")
      .should("have.attr", "aria-disabled")
      .and("eq", "true");
    cy.dataCy("raw-log-btn")
      .should("have.attr", "aria-disabled")
      .and("eq", "true");
  });

  it("Should link to Parsley, HTML and Raw version of logs", () => {
    cy.get(systemLogsButton).click({ force: true });
    cy.get(systemLogsButton)
      .should("have.attr", "aria-selected")
      .and("eq", "true");

    cy.dataCy("html-log-btn")
      .should("have.attr", "href")
      .and(
        "includes",
        "task_log_raw/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/0?type=S",
      );
    cy.dataCy("raw-log-btn")
      .should("have.attr", "href")
      .and(
        "includes",
        "/task_log_raw/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/0?type=S&text=true",
      );
  });

  it("Event logs should have an HTML button but not a Raw button nor Parsley button", () => {
    cy.get(eventLogsButton).click({ force: true });
    cy.get(eventLogsButton)
      .should("have.attr", "aria-selected")
      .and("eq", "true");
    cy.dataCy("html-log-btn").should("exist");
    cy.dataCy("raw-log-btn").should("not.exist");
    cy.dataCy("parsley-log-btn").should("not.exist");
  });

  it("Should update logtype query param to agent after checking agent radio button", () => {
    cy.get(agentLogsButton).click({ force: true });
    cy.get(agentLogsButton)
      .should("have.attr", "aria-selected")
      .and("eq", "true");
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(LOGS_ROUTE);
      expect(loc.search).to.include("logtype=agent");
    });
  });

  it("Should update logtype query param to event after checking event radio button", () => {
    cy.get(eventLogsButton).click({ force: true });
    cy.get(eventLogsButton)
      .should("have.attr", "aria-selected")
      .and("eq", "true");
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(LOGS_ROUTE);
      expect(loc.search).to.include("logtype=event");
    });
  });

  it("Should update logtype query param to system after checking system radio button", () => {
    cy.get(systemLogsButton).click({ force: true });
    cy.get(systemLogsButton)
      .should("have.attr", "aria-selected")
      .and("eq", "true");
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(LOGS_ROUTE);
      expect(loc.search).to.include("logtype=system");
    });
  });

  it("Should update logtype query param to all after checking all radio button", () => {
    cy.get(allLogsButton).click({ force: true });
    cy.get(allLogsButton)
      .should("have.attr", "aria-selected")
      .and("eq", "true");
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(LOGS_ROUTE);
      expect(loc.search).to.include("logtype=all");
    });
  });

  it("Should initially load with task log radio checked when logtype query param is task", () => {
    cy.visit(`${LOGS_ROUTE}?logtype=task`);
    cy.get(taskLogsButton)
      .should("have.attr", "aria-selected")
      .and("eq", "true");
  });
  it("Should initially load with task log radio checked as default when logtype query param is not a valid log type", () => {
    cy.visit(`${LOGS_ROUTE}?logtype=soeiantsrein`);
    cy.get(taskLogsButton)
      .should("have.attr", "aria-selected")
      .and("eq", "true");
  });
  it("Should initially load with agent log radio checked when logtype query param is agent", () => {
    cy.visit(`${LOGS_ROUTE}?logtype=agent`);
    cy.get(agentLogsButton)
      .should("have.attr", "aria-selected")
      .and("eq", "true");
  });
  it("Should initially load with system log radio checked when logtype query param is system", () => {
    cy.visit(`${LOGS_ROUTE}?logtype=system`);
    cy.get(systemLogsButton)
      .should("have.attr", "aria-selected")
      .and("eq", "true");
  });
  it("Should initially load with event log radio checked when logtype query param is event", () => {
    cy.visit(`${LOGS_ROUTE}?logtype=event`);
    cy.get(eventLogsButton)
      .should("have.attr", "aria-selected")
      .and("eq", "true");
  });
  it("Should initially load with all log radio checked when logtype query param is all", () => {
    cy.visit(`${LOGS_ROUTE}?logtype=all`);
    cy.get(allLogsButton)
      .should("have.attr", "aria-selected")
      .and("eq", "true");
  });
});
