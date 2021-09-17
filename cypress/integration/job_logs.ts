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

  const baseHref = "https://evergreen.mongodb.com/lobster/evergreen";

  const testHrefs = [
    `${baseHref}/test/${taskId}/0/${testNames[0]}/llama#shareLine=5555`,
    `${baseHref}/test/${taskId}/0/${testNames[1]}/llama#shareLine=22`,
    `${baseHref}/test/${taskId}/0/${testNames[2]}/llama#shareLine=36`,
    `${baseHref}/test/${taskId}/0/${testNames[3]}/llama#shareLine=41`,
    `${baseHref}/test/${taskId}/0/${testNames[4]}/llama#shareLine=116`,
    `${baseHref}/test/${taskId}/0/${testNames[5]}/llama#shareLine=132`,
    `${baseHref}/test/${taskId}/0/${testNames[6]}/llama#shareLine=152`,
    `${baseHref}/test/${taskId}/0/${testNames[7]}/llama#shareLine=236`,
    `${baseHref}/test/${taskId}/0/${testNames[8]}/llama#shareLine=251`,
    `${baseHref}/test/${taskId}/0/${testNames[9]}/llama#shareLine=261`,
    `${baseHref}/test/${taskId}/0/${testNames[10]}/llama#shareLine=285`,
    `${baseHref}/test/${taskId}/0/${testNames[11]}/llama#shareLine=302`,
    `${baseHref}/test/${taskId}/0/${testNames[12]}/llama#shareLine=324`,
  ];
});
