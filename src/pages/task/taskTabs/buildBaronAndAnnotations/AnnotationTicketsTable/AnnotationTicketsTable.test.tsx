import { MockedProvider } from "@apollo/client/testing";
import MatchMediaMock from "jest-matchmedia-mock";
import { RenderFakeToastContext } from "context/__mocks__/toast";
import { MOVE_ANNOTATION, REMOVE_ANNOTATION } from "gql/mutations";
import { GET_USER } from "gql/queries";
import { renderWithRouterMatch as render, waitFor } from "test_utils";
import AnnotationTicketsTable from "./AnnotationTicketsTable";

const taskId =
  "spruce_ubuntu1604_e2e_test_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_20_08_26_19_20_41";
const execution = 1;
let matchMedia;

describe("annotationTicketsTable", () => {
  beforeAll(() => {
    matchMedia = new MatchMediaMock();
  });

  afterEach(() => {
    matchMedia.clear();
    jest.restoreAllMocks();
  });

  it("should display the link and jiraIssue key while waiting for data to fetch.", async () => {
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={ticketsTableMocks} addTypename={false}>
        <AnnotationTicketsTable
          jiraIssues={[
            {
              issueKey: "EVG-1234567",
              url: "https://fake-url/EVG-1234567",
            },
          ]}
          isIssue
          taskId={taskId}
          execution={execution}
          userCanModify={false}
          selectedRowKey=""
          setSelectedRowKey={() => {}}
          loading
        />
      </MockedProvider>
    );
    const { getByText, queryByDataCy } = render(<Component />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
    });

    waitFor(() =>
      expect(queryByDataCy("loading-annotation-ticket")).toBeInTheDocument()
    );
    expect(getByText("EVG-1234567")).toBeInTheDocument();
  });
});

const apiIssue = {
  url: "https://fake-url/EVG-1234567",
  issueKey: "EVG-1234567",
};

const ticketsTableMocks = [
  {
    request: {
      query: MOVE_ANNOTATION,
      variables: { taskId, execution, apiIssue, isIssue: true },
    },
    result: { data: { moveAnnotationIssue: true } },
  },
  {
    request: {
      query: REMOVE_ANNOTATION,
      variables: { taskId, execution, apiIssue, isIssue: true },
    },
    result: { data: { removeAnnotationIssue: true } },
  },
  {
    request: {
      query: GET_USER,
    },
    result: {
      data: {
        userId: "minna.kt",
        displayName: "Minna K-T",
      },
    },
  },
];
