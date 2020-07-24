import { defaultHostsFirstPage } from "./hosts-page-default";

const hostsQuery = "Hosts";

const tableRow = "tr.ant-table-row";

describe("Hosts Page", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.listenGQL();
  });

  it("URL query parameters determine pagination values", () => {
    cy.visit("/hosts?limit=10&page=1");
    cy.waitForGQL(hostsQuery);

    cy.get(tableRow).each(($el, index) =>
      cy.wrap($el).contains(hostsSecondPageWithLimitOfTen[index])
    );

    cy.visit("/hosts?limit=20&page=0");
    cy.waitForGQL(hostsQuery);

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
