import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter } from "react-router-dom";
import { GET_LAST_PASSING_VERSION } from "gql/queries";
import { render, waitFor } from "test_utils/test-utils";
import { LastPassingVersion } from "./LastPassingVersion";

test("Button is enabled and has a valid href when a mainline commit version with the supplied projectId, variant and passing task exists", async () => {
  const { queryByDataCy } = render(
    <MemoryRouter>
      <MockedProvider mocks={mocks} addTypename={false}>
        <LastPassingVersion
          projectId="spruce"
          variant="ubuntu1604"
          taskName="test"
        />
      </MockedProvider>
    </MemoryRouter>
  );
  await waitFor(() => {
    expect(queryByDataCy(dataCy)).toHaveAttribute(
      "href",
      "/version/spruce_b06b02cd9e9bb6604dda7b5c20851cc9fa233e57/tasks"
    );
    expect(queryByDataCy(dataCy)).toHaveAttribute("aria-disabled", "false");
  });
});

test("Button is disabled  when a mainline commit version with the supplied projectId, variant and passing task does not exist", async () => {
  const { queryByDataCy } = render(
    <MemoryRouter>
      <MockedProvider mocks={mocks} addTypename={false}>
        <LastPassingVersion
          projectId="spruce"
          variant="ubuntu1604"
          taskName="e2e_test"
        />
      </MockedProvider>
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(queryByDataCy(dataCy)).toHaveAttribute("aria-disabled", "true");
  });
});

const dataCy = "last-passing-version-btn";
const mocks = [
  {
    request: {
      query: GET_LAST_PASSING_VERSION,
      variables: {
        projectId: "spruce",
        variant: "^ubuntu1604$",
        taskName: "^test$",
      },
    },
    result: {
      data: {
        mainlineCommits: {
          versions: [
            {
              version: {
                id: "spruce_b06b02cd9e9bb6604dda7b5c20851cc9fa233e57",
              },
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: GET_LAST_PASSING_VERSION,
      variables: {
        projectId: "spruce",
        variant: "^ubuntu1604$",
        taskName: "^e2e_test$",
      },
    },
    result: {
      data: {
        mainlineCommits: {
          versions: [],
        },
      },
    },
  },
];
