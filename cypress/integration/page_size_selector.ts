// / <reference types="Cypress" />

describe("Page Size Selector", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("The selected page size will be saved to local storage upon selection", () => {
    cy.wrap(ROUTES).each(({ route, dataCy }) => {
      cy.visit(route);
      cy.wrap(PAGE_SIZES).each((pageSize) => {
        cy.dataCy(dataCy).click();
        cy.dataCy(`${dataCy}-${pageSize}`)
          .click({ force: true })
          .then(() =>
            expect(localStorage.getItem(LOCAL_STORAGE_KEY)).to.eq(`${pageSize}`)
          );
      });
    });
  });

  it("The page size selector will default to the limit query param in the URL when it exists. This value has the highest priority and overrides the value in local storage.", () => {
    cy.wrap(PAGE_SIZES).each((pageSize) => {
      cy.wrap(ROUTES).each(({ route, dataCy }) => {
        // shows that URL limit value is higher priority than value in local storage
        localStorage.setItem(LOCAL_STORAGE_KEY, "100");
        cy.visit(`${route}?limit=${pageSize}`);
        cy.dataCy(dataCy).contains(`${pageSize} / page`).should("exist");
      });
    });
  });

  it("Page size selector defaults to the value local in storage when a limit is not provided in the URL. ", () => {
    cy.wrap(PAGE_SIZES).each((pageSize) => {
      cy.wrap(ROUTES).each(({ route, dataCy }) => {
        localStorage.setItem(LOCAL_STORAGE_KEY, `${pageSize}`);
        cy.visit(route);
        cy.dataCy(dataCy).contains(`${pageSize} / page`).should("exist");
      });
    });
  });

  it("Page size selector defaults to 10 when no page size value exists in local storage or in the URL.", () => {
    cy.wrap(ROUTES).each(({ route, dataCy }) => {
      localStorage.clear();
      cy.visit(route);
      cy.dataCy(dataCy).contains(`10 / page`).should("exist");
    });
  });

  const PAGE_SIZES = [20, 50, 100];
  const LOCAL_STORAGE_KEY = "recentPageSize";
  const ROUTES = [
    {
      route: "/user/admin/patches",
      dataCy: "my-patches-page-size-selector",
    },
    {
      route: "/version/5ecedafb562343215a7ff297/tasks",
      dataCy: "tasks-table-page-size-selector",
    },
    {
      route:
        "/task/evergreen_ubuntu1604_dist_patch_33016573166a36bd5f46b4111151899d5c4e95b1_5ecedafb562343215a7ff297_20_05_27_21_39_46/tests",
      dataCy: "tests-table-page-size-selector",
    },
  ];
});
