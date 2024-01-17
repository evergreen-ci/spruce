import {
  clickingCheckboxUpdatesUrlAndRendersFetchedResults,
  clickOnPageBtnAndAssertURLandTableResults,
  clickOnPageSizeBtnAndAssertURLandTableSize,
} from "../../utils";

describe("Tests Table", () => {
  const visitAndWait = (url: string) => {
    cy.visit(url);
    cy.dataCy("tests-table")
      .should("be.visible")
      .should("not.have.attr", "data-loading", "true");
  };
  beforeEach(() => {
    visitAndWait(TESTS_ROUTE);
  });
  it("Test count should update to reflect filtered values", () => {
    cy.contains(TABLE_SORT_SELECTOR, "Name").click();

    cy.dataCy("filtered-count").contains(20);
    cy.dataCy("total-count").contains(20);

    cy.toggleTableFilter(2);

    cy.get(".cy-checkbox").contains("Fail").click({ force: true });
    cy.dataCy("filtered-count").contains(1);
    cy.dataCy("total-count").contains(20);

    cy.toggleTableFilter(1);
    cy.dataCy("testname-input-wrapper")
      .find("input")
      .as("testnameInputWrapper")
      .focus();
    cy.get("@testnameInputWrapper").type("hello{enter}");

    cy.dataCy("filtered-count").contains(0);
    cy.dataCy("total-count").contains(20);
  });

  it("Adjusts query params when table headers are clicked", () => {
    cy.contains(TABLE_SORT_SELECTOR, "Name").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(TESTS_ROUTE);
      expect(loc.search).to.include("sortBy=TEST_NAME");
      expect(loc.search).to.include(ASCEND_PARAM);
    });

    cy.contains(TABLE_SORT_SELECTOR, "Status").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(TESTS_ROUTE);
      expect(loc.search).to.include("sortBy=STATUS");
      expect(loc.search).to.include(ASCEND_PARAM);
    });

    cy.contains(TABLE_SORT_SELECTOR, "Status").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(TESTS_ROUTE);
      expect(loc.search).to.include("sortBy=STATUS");
      expect(loc.search).to.include(DESCEND_PARAM);
    });

    cy.contains(TABLE_SORT_SELECTOR, "Time").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(TESTS_ROUTE);
      expect(loc.search).to.include("sortBy=DURATION");
      expect(loc.search).to.include(ASCEND_PARAM);
    });

    cy.contains(TABLE_SORT_SELECTOR, "Time").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal(TESTS_ROUTE);
      expect(loc.search).to.include("sortBy=DURATION");
      expect(loc.search).to.include(DESCEND_PARAM);
    });
  });

  describe("Test Status Selector", () => {
    beforeEach(() => {
      visitAndWait(TESTS_ROUTE);
    });

    it("Clicking on 'All' checkbox adds all statuses to URL", () => {
      clickingCheckboxUpdatesUrlAndRendersFetchedResults({
        checkboxDisplayName: "All",
        pathname: TESTS_ROUTE,
        paramName: "statuses",
        search: "all,pass,fail,skip,silentfail",
        openFilter: () => cy.toggleTableFilter(2),
      });
    });

    const statuses = [
      { display: "Pass", key: "pass" },
      { display: "Silent Fail", key: "silentfail" },
      { display: "Fail", key: "fail" },
      { display: "Skip", key: "skip" },
    ];

    it("Checking multiple statuses adds them all to the URL", () => {
      cy.toggleTableFilter(2);
      statuses.forEach(({ display }) => {
        cy.get(".cy-checkbox").contains(display).click({ force: true });
      });
      cy.location().should((loc) => {
        expect(loc.search).to.include("statuses=pass,silentfail,fail,skip,all");
      });
    });
  });

  describe("Test Name Filter", () => {
    const testNameInputValue = "group";

    it("Typing in test name filter updates testname query param", () => {
      visitAndWait(TESTS_ROUTE);
      cy.toggleTableFilter(1);
      cy.dataCy("testname-input-wrapper")
        .find("input")
        .as("testnameInputWrapper")
        .focus();
      cy.get("@testnameInputWrapper").type(testNameInputValue);
      cy.get("@testnameInputWrapper").type("{enter}");
      cy.location().should((loc) => {
        expect(loc.search).to.include(`testname=${testNameInputValue}`);
      });
    });
  });

  describe("Changing page number", () => {
    it("Displays the next page of results and updates URL when right arrow is clicked and next page exists", () => {
      visitAndWait(`${TESTS_ROUTE}?limit=10`);
      cy.dataCy("pagination").first().should("contain.text", "1 / 2");
      clickOnPageBtnAndAssertURLandTableResults(
        dataCyNextPage,
        secondPageDisplayNames,
        1,
      );
    });

    it("Does not update results or URL when right arrow is clicked and next page does not exist", () => {
      visitAndWait(`${TESTS_ROUTE}?limit=10&page=1`);
      cy.dataCy("pagination").first().should("contain.text", "2 / 2");
      clickOnPageBtnAndAssertURLandTableResults(
        dataCyNextPage,
        secondPageDisplayNames,
        1,
      );
    });

    it("Displays the previous page of results and updates URL when the left arrow is clicked and previous page exists", () => {
      visitAndWait(`${TESTS_ROUTE}?limit=10&page=1`);
      cy.dataCy("pagination").first().should("contain.text", "2 / 2");
      clickOnPageBtnAndAssertURLandTableResults(
        dataCyPrevPage,
        firstPageDisplayNames,
        0,
      );
    });

    it("Does not update results or URL when left arrow is clicked and previous page does not exist", () => {
      visitAndWait(`${TESTS_ROUTE}?limit=10&page=0`);
      cy.dataCy("pagination").first().should("contain.text", "1 / 2");
      clickOnPageBtnAndAssertURLandTableResults(
        dataCyPrevPage,
        firstPageDisplayNames,
        0,
      );
    });
  });

  describe("Changing page limit", () => {
    it("Changing page size updates URL and renders less than or equal to that many rows", () => {
      [20, 50, 100].forEach((pageSize) => {
        it(`when the page size is set to ${pageSize}`, () => {
          visitAndWait(TESTS_ROUTE);
          clickOnPageSizeBtnAndAssertURLandTableSize(pageSize, dataCyTableRows);
        });
      });
    });
  });
});

const TABLE_SORT_SELECTOR = ".ant-table-column-sorters";
const DESCEND_PARAM = "sortDir=DESC";
const ASCEND_PARAM = "sortDir=ASC";
const TESTS_ROUTE =
  "/task/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/tests";
const dataCyTableRows = "[data-cy=tests-table] tr td:first-child";
const longTestName =
  "suuuuuupppppaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooonnnnnnnnnnnnnnnnnggggggggggggggggggggggggg name";

const firstPageDisplayNames = [
  "TestFinalizePatch",
  "TestStuckHostAuditing",
  "TestHostTaskAuditing",
  "TestProjectEventSuite/TestModifyProjectNonEvent",
  "TestGenerateSuite",
  "TestGenerateSuite/TestSaveNewTasksWithDependencies",
  "TestGenerateSuite/TestValidateNoRedefine",
  "TestSortTasks",
  "TestDepsMatrixIntegration",
  "TestTaskGroupWithDisplayTask",
];
const secondPageDisplayNames = [
  "TestTryUpsert/configNumberMatches",
  "TestGetActivationTimeWithCron/Interval",
  longTestName,
  "TestUpdateVersionAndParserProject",
  "TestSetVersionActivation",
  "TestCreateTaskGroup",
  "TestRetryCommitQueueItems",
  "TestProjectAliasSuite/TestInsertTagsAndNoVariant",
  "TestMergeAxisValue",
  "TestCreateIntermediateProjectRequirements",
];

const dataCyNextPage = "next-page-button";
const dataCyPrevPage = "prev-page-button";
