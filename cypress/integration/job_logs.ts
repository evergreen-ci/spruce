describe("Job Logs", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("Renders page title and testlog links.", () => {
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
    cy.dataCy("testlog-link").each(($el, index) => {
      expect($el.text()).to.eq(testNames[index]);
      expect($el.attr("href")).to.eq(testHrefs[index]);
    });
  });

  const taskId =
    "evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";
  const execution = 0;
  const groupId = "llama";
  const testNames = [
    "TestHostTaskAuditing",
    "TestGenerateSuite",
    "TestGenerateSuite/TestSaveNewTasksWithDependencies",
    "TestGenerateSuite/TestValidateNoRedefine",
    "TestSortTasks",
    "TestDepsMatrixIntegration",
    "TestFinalizePatch",
    "TestProjectEventSuite/TestModifyProjectNonEvent",
    "TestMergeAxisValue",
    "TestCreateIntermediateProjectRequirements",
    "TestTaskGroupWithDisplayTask",
    "TestTryUpsert/configNumberMatches",
    "TestGetActivationTimeWithCron/Interval",
  ];

  const baseHref = "http://localhost:9090/test_log/5e4ff42d30661528ad67fafb#L";

  const testHrefs = [
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
    `${baseHref}285`,
    `${baseHref}302`,
    `${baseHref}324`,
  ];
});
