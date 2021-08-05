// / <reference types="Cypress" />

describe("Page Size Selector", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  describe("My Patches Page", () => {
    before(() => {
      cy.visit(ROUTES[0].route);
    });

    it("Should default to a page size of 10", () => {
      assertANTDSelectorValue(`[data-cy="${ROUTES[0].dataCy}"]`, "10 / page");
    });

    it("Setting a page size should save the value and update page size", () => {
      cy.dataCy(ROUTES[0].dataCy).click();
      cy.contains("20 / page").click();
      assertANTDSelectorValue(`[data-cy="${ROUTES[0].dataCy}"]`, "20 / page");
    });
    it("Preserves the page size across refreshes", () => {
      cy.reload();
      assertANTDSelectorValue(`[data-cy="${ROUTES[0].dataCy}"]`, "20 / page");
    });
    it("Should default to page size provided in the url", () => {
      cy.visit(`${ROUTES[0].route}?limit=50`);
      assertANTDSelectorValue(`[data-cy="${ROUTES[0].dataCy}"]`, "50 / page");
    });
  });
  describe("Version Page", () => {
    before(() => {
      cy.visit(ROUTES[1].route);
    });

    it("Should default to a page size of 10", () => {
      assertANTDSelectorValue(`[data-cy="${ROUTES[1].dataCy}"]`, "10 / page");
    });

    it("Setting a page size should save the value and update page size", () => {
      cy.dataCy(ROUTES[1].dataCy).click();
      cy.contains("20 / page").click();
      assertANTDSelectorValue(`[data-cy="${ROUTES[1].dataCy}"]`, "20 / page");
    });
    it("Preserves the page size across refreshes", () => {
      cy.reload();
      assertANTDSelectorValue(`[data-cy="${ROUTES[1].dataCy}"]`, "20 / page");
    });
    it("Should default to page size provided in the url", () => {
      cy.visit(`${ROUTES[1].route}?limit=50`);
      assertANTDSelectorValue(`[data-cy="${ROUTES[1].dataCy}"]`, "50 / page");
    });
  });
  describe("Task Tests Page", () => {
    before(() => {
      cy.visit(ROUTES[2].route);
    });

    it("Should default to a page size of 10", () => {
      assertANTDSelectorValue(`[data-cy="${ROUTES[2].dataCy}"]`, "10 / page");
    });

    it("Setting a page size should save the value and update page size", () => {
      cy.dataCy(ROUTES[2].dataCy).click();
      cy.contains("20 / page").click();
      assertANTDSelectorValue(`[data-cy="${ROUTES[2].dataCy}"]`, "20 / page");
    });
    it("Preserves the page size across refreshes", () => {
      cy.reload();
      assertANTDSelectorValue(`[data-cy="${ROUTES[2].dataCy}"]`, "20 / page");
    });
    it("Should default to page size provided in the url", () => {
      cy.visit(`${ROUTES[2].route}?limit=50`);
      assertANTDSelectorValue(`[data-cy="${ROUTES[2].dataCy}"]`, "50 / page");
    });
  });
});

const assertANTDSelectorValue = (selector: string, value: string) => {
  cy.get(selector).should("exist");
  cy.get(selector).within(() => {
    cy.get(".ant-select-selection-item").should("have.text", value);
  });
};

const ROUTES = [
  {
    route: "/user/admin/patches",
    dataCy: "my-patches-page-size-selector",
  },
  {
    route: "/version/5e4ff3abe3c3317e352062e4/tasks",
    dataCy: "tasks-table-page-size-selector",
  },
  {
    route:
      "/task/evergreen_ubuntu1604_dist_patch_33016573166a36bd5f46b4111151899d5c4e95b1_5ecedafb562343215a7ff297_20_05_27_21_39_46/tests",
    dataCy: "tests-table-page-size-selector",
  },
];
