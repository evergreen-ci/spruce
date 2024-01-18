import { defaultHostsFirstPage } from "./hosts_page_default";

describe("Hosts Page", () => {
  it("URL query parameters determine pagination values", () => {
    cy.visit("/hosts?limit=10&page=1");

    cy.dataCy("leafygreen-table-row").each(($el, index) =>
      cy.wrap($el).contains(hostsSecondPageWithLimitOfTen[index]),
    );

    cy.visit("/hosts?limit=20&page=0");

    cy.dataCy("leafygreen-table-row").each(($el, index) =>
      cy
        .wrap($el)
        .contains(
          [...defaultHostsFirstPage, ...hostsSecondPageWithLimitOfTen][index],
        ),
    );
  });
});

const hostsSecondPageWithLimitOfTen = [
  "ubuntu1804-ppc-3.pic.build.10gen.c",
  "ubuntu1804-ppc-3.pic.build.10gen.cc",
  "16326bd716fd4ad5845710c479c79e86c66b61bcef8ebbe7fc38dfc36fab512e",
  "1694cfe1eac28b3316339f6276021afcb2a07bcd21a266405835fd039557ea2d",
  "4b332e12790a585a0c7cbaf1650674f408117cf6134679c9e5f2e96cadd07923",
  "6e331e02aaaebba422d1f1d2dbd3e64f01776b84c68c672ea680e4b81b0719bb",
  "7f909d47566126bd39a05c1a5bd5d111c2e68de3830a8be414c18c231a47f4fc",
  "a99b50cd37b012c53db7207e4ba8b52989aefab551176c07962cea979abcc479",
  "b700d10f21a5386c827251a029dd931b5ea910377e0bb93f3393b17fb9bdbd08",
  "build10.ny.cbi.10gen",
];
