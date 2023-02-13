import { hasOperationName, GQL_URL } from "../utils/graphql-test-utils";

const buildId = "9b07c7f9677e49ddae4c53076ca4f4ca";

describe("Job logs page", () => {
  beforeEach(() => {
    cy.intercept("POST", GQL_URL, (req) => {
      if (hasOperationName(req, "LogkeeperBuildMetadata")) {
        req.reply((res) => {
          res.body = mockedResponse;
        });
      }
    });
    cy.visit(`job-logs/${buildId}`);
  });

  it("renders a table with test links", () => {
    cy.dataCy("job-logs-table-row").should("have.length", 9);

    // Sort is not enabled
    cy.get("th")
      .should("have.length", 1)
      .then((th) => {
        cy.wrap(th).should("have.attr", "aria-sort", "none");
      });

    cy.dataCy("complete-test-logs-link")
      .should("have.attr", "href")
      .then((href) => {
        cy.wrap(href).should(
          "contain",
          "/resmoke/9b07c7f9677e49ddae4c53076ca4f4ca/all"
        );
      });
  });
});

describe("Invalid job logs page", () => {
  beforeEach(() => {
    cy.visit(`job-logs/foo`);
  });

  it("shows an error toast", () => {
    cy.validateToast(
      "error",
      "There was an error retrieving logs for this build: Logkeeper returned HTTP status 404"
    );
  });
});

const mockedResponse = {
  data: {
    logkeeperBuildMetadata: {
      builder: "MCI_enterprise-windows-all-feature-flags-required_job3",
      buildNum: 180872797,
      taskId:
        "mongodb_mongo_master_enterprise_windows_all_feature_flags_required_audit_4594ea6598ce28d01c5c5d76164b1cfeeba1494f_23_01_20_15_05_21",
      taskExecution: 0,
      tests: [
        {
          id: "173c1005b5bee7a2427454888ab9f4c5",
          name: "job3_fixture_setup_0",
        },
        {
          id: "173c1005bb61200a0d5661c9f4574d02",
          name: "tenant-id.js",
        },
        {
          id: "173c1009310c70b6f966b7abc87cbb29",
          name: "log_file_integrity.js",
        },
        {
          id: "173c101edd520126bf0901bc3f4fc5ce",
          name: "audit_read_from_sharded_secondaries.js",
        },
        {
          id: "173c10238bfa0e6ebf0901bc3f4fce8b",
          name: "log_has_framing_protocol.js",
        },
        {
          id: "173c102de730d33fda7f09a333f80699",
          name: "log_separate_header.js",
        },
        {
          id: "173c10336ddd35a0427454888aba47ba",
          name: "set_audit_config.js",
        },
        {
          id: "173c1047661fff3abf0901bc3f500d51",
          name: "log_rotate_startup.js",
        },
        {
          id: "173c105cb54996014d5f30af1ffa07b2",
          name: "job3_fixture_teardown",
        },
      ],
    },
  },
  errors: null,
};
