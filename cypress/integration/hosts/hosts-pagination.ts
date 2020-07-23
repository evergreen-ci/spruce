import { defaultHostsFirstPage } from "./hosts-page-default";

const prevPageButton = ".ant-pagination-prev";
const nextPageButton = ".ant-pagination-next";
const tableRow = "tr.ant-table-row";

describe("Hosts Page", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.listenGQL();
  });

  it("Clicking on next and previous pagination buttons shows respective data for that page", () => {
    cy.visit("/hosts");

    cy.get(nextPageButton).click();
    cy.get(tableRow).each(($el, index) =>
      cy.wrap($el).contains(hostsSecondPageWithLimitOfTen[index])
    );

    cy.get(nextPageButton).click();
    cy.get(tableRow).each(($el, index) =>
      cy.wrap($el).contains(hostsThirdPageWithLimitOfTen[index])
    );

    cy.get(prevPageButton).click();
    cy.get(tableRow).each(($el, index) =>
      cy.wrap($el).contains(hostsSecondPageWithLimitOfTen[index])
    );
  });

  it("URL query parameters determine pagination values", () => {
    cy.visit("/hosts?limit=10&page=1");

    cy.get(tableRow).each(($el, index) =>
      cy.wrap($el).contains(hostsSecondPageWithLimitOfTen[index])
    );

    cy.visit("/hosts?limit=20&page=0");

    cy.get(tableRow).each(($el, index) =>
      cy
        .wrap($el)
        .contains(
          [...defaultHostsFirstPage, ...hostsSecondPageWithLimitOfTen][index]
        )
    );
  });
});

const hostsSecondPageWithLimitOfTen = [
  "ubuntu1804-ppc-3.pic.build.10gen.c",
  "ubuntu1804-ppc-3.pic.build.10gen.cc",
  "build10.ny.cbi.10gen",
  "build10.ny.cbi.10gen.c",
  "build10.ny.cbi.10gen.cc",
  "i-0d0ae8b83366d22",
  "i-0d0ae8b83366d22b",
  "i-0d0ae8b83366d22be",
  "i-0f81a2d39744003",
  "i-0f81a2d39744003d",
];

const hostsThirdPageWithLimitOfTen = [
  "i-0f81a2d39744003dd",
  "rhel71-ppc-1.pic.build.10gen",
  "rhel71-ppc-1.pic.build.10gen.c",
  "rhel71-ppc-1.pic.build.10gen.cc",
  "ubuntu1604-ppc-1.pic.build.10gen",
  "ubuntu1604-ppc-1.pic.build.10gen.c",
  "ubuntu1604-ppc-1.pic.build.10gen.cc",
];
