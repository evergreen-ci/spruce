import { MockedProvider } from "@apollo/client/testing";
import MatchMediaMock from "jest-matchmedia-mock";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  MoveAnnotationIssueMutation,
  MoveAnnotationIssueMutationVariables,
  RemoveAnnotationIssueMutation,
  RemoveAnnotationIssueMutationVariables,
} from "gql/generated/types";
import { getUserMock } from "gql/mocks/getUser";
import { MOVE_ANNOTATION, REMOVE_ANNOTATION } from "gql/mutations";
import { renderWithRouterMatch as render, screen } from "test_utils";
import { ApolloMock } from "types/gql";
import AnnotationTicketsList from ".";

const taskId =
  "spruce_ubuntu1604_e2e_test_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_20_08_26_19_20_41";
const execution = 1;
let matchMedia;

describe("annotationTicketsList", () => {
  beforeAll(() => {
    matchMedia = new MatchMediaMock();
  });

  afterEach(() => {
    matchMedia.clear();
    jest.restoreAllMocks();
  });

  it("should display the link and jiraIssue key while waiting for data to fetch", async () => {
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={ticketsTableMocks}>
        <AnnotationTicketsList
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
      </MockedProvider>,
    );
    render(<Component />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
    });

    await screen.findByDataCy("loading-annotation-ticket");
    expect(screen.getByText("EVG-1234567")).toBeInTheDocument();
  });
});

const apiIssue = {
  url: "https://fake-url/EVG-1234567",
  issueKey: "EVG-1234567",
};
const moveAnnotationMock: ApolloMock<
  MoveAnnotationIssueMutation,
  MoveAnnotationIssueMutationVariables
> = {
  request: {
    query: MOVE_ANNOTATION,
    variables: { taskId, execution, apiIssue, isIssue: true },
  },
  result: { data: { moveAnnotationIssue: true } },
};
const removeAnnotationMock: ApolloMock<
  RemoveAnnotationIssueMutation,
  RemoveAnnotationIssueMutationVariables
> = {
  request: {
    query: REMOVE_ANNOTATION,
    variables: { taskId, execution, apiIssue, isIssue: true },
  },
  result: { data: { removeAnnotationIssue: true } },
};

const ticketsTableMocks = [
  moveAnnotationMock,
  removeAnnotationMock,
  getUserMock,
];
