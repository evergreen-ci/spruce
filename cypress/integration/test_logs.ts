// /<reference types="Cypress" />

describe("Task table", () => {
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
  const testHrefs = [
    "https://www.evergreen.mongodb.com/lobster/evergreen/test/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/0/356534666634326434653838666165613761393066306165#shareLine=5555",
    "https://www.evergreen.mongodb.com/lobster/evergreen/test/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/0/356534666634326434653838666165613761393066306233#shareLine=22",
    "https://www.evergreen.mongodb.com/lobster/evergreen/test/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/0/356534666634326434653838666165613761393066306261#shareLine=36",
    "https://www.evergreen.mongodb.com/lobster/evergreen/test/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/0/356534666634326434653838666165613761393066306265#shareLine=41",
    "https://www.evergreen.mongodb.com/lobster/evergreen/test/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/0/356534666634326434653838666165613761393066306435#shareLine=116",
    "https://www.evergreen.mongodb.com/lobster/evergreen/test/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/0/356534666634326434653838666165613761393066306464#shareLine=132",
    "https://www.evergreen.mongodb.com/lobster/evergreen/test/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/0/356534666634326434653838666165613761393066306530#shareLine=152",
    "https://www.evergreen.mongodb.com/lobster/evergreen/test/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/0/356534666634326434653838666165613761393066306636#shareLine=236",
    "https://www.evergreen.mongodb.com/lobster/evergreen/test/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/0/356534666634326434653838666165613761393066306663#shareLine=251",
    "https://www.evergreen.mongodb.com/lobster/evergreen/test/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/0/356534666634326434653838666165613761393066306666#shareLine=261",
    "https://www.evergreen.mongodb.com/lobster/evergreen/test/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/0/356534666634326434653838666165613761393066313039#shareLine=285",
    "https://www.evergreen.mongodb.com/lobster/evergreen/test/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/0/356534666634326434653838666165613761393066313132#shareLine=302",
    "https://www.evergreen.mongodb.com/lobster/evergreen/test/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/0/356534666634326434653838666165613761393066313165#shareLine=324",
  ];
});
