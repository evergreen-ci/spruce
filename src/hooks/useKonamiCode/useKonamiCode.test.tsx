import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import { GetTaskQuery, GetTaskQueryVariables } from "gql/generated/types";
import { cache } from "gql/GQLWrapper";
import { taskQuery } from "gql/mocks/taskData";
import { GET_TASK } from "gql/queries";
import { render, waitFor } from "test_utils";
import useKonamiCode from ".";

const KonamiCodeWrapper = ({ gqlCache }) => (
  <MockedProvider cache={gqlCache}>
    <HookComponent />
  </MockedProvider>
);

const HookComponent = () => {
  useKonamiCode();
  return <div />;
};

describe("useKonamiCode", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });
  it("pressing the correct sequence of keys triggers the Konami code easter", async () => {
    const audioPlayMock = jest.fn();
    jest.spyOn(global, "Audio").mockImplementation(
      () =>
        ({
          play: audioPlayMock,
        } as any)
    );
    window.HTMLMediaElement.prototype.play = audioPlayMock;

    // Duplicate the cache so that the cache is not mutated
    // const gqlCache = new InMemoryCache().restore(cache.extract());
    // Add some data to the cache
    cache.writeQuery<GetTaskQuery, GetTaskQueryVariables>({
      query: GET_TASK,
      data: {
        ...taskQuery,
      },
    });

    const { Component, dispatchToast } = RenderFakeToastContext(
      <KonamiCodeWrapper gqlCache={cache} />
    );

    render(<Component />);
    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
      userEvent.type(
        document.body,
        "ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba"
      );
    });

    await waitFor(() => {
      expect(audioPlayMock).toHaveBeenCalledWith();
    });
    expect(dispatchToast.success).toHaveBeenCalledWith(
      "To reset just refresh the page",
      true,
      { title: "Konami Code Activated!" }
    );
    expect(
      cache.extract()[
        cache.identify({
          __typename: "Task",
          id: taskQuery.task.id,
          execution: taskQuery.task.execution,
        })
      ].status
    ).toBe("success");
  });
});
