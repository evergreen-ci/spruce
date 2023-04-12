import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import { GetTaskQuery, GetTaskQueryVariables } from "gql/generated/types";
import { cache } from "gql/GQLWrapper";
import { taskQuery } from "gql/mocks/taskData";
import { GET_TASK } from "gql/queries";
import { render, waitFor, screen } from "test_utils";
import useKonamiCode from ".";

const KonamiCodeWrapper = ({ gqlCache }) => (
  <MockedProvider cache={gqlCache}>
    <HookComponent />
  </MockedProvider>
);

const HookComponent = () => {
  useKonamiCode();
  return <input type="text" />;
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
      expect(audioPlayMock).toHaveBeenCalledTimes(1);
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
  it("should not trigger the Konami code if the sequence is incorrect", async () => {
    const audioPlayMock = jest.fn();
    jest.spyOn(global, "Audio").mockImplementation(
      () =>
        ({
          play: audioPlayMock,
        } as any)
    );
    window.HTMLMediaElement.prototype.play = audioPlayMock;

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
        "ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightbb"
      );
    });

    await waitFor(() => {
      expect(audioPlayMock).toHaveBeenCalledTimes(0);
    });
    expect(dispatchToast.success).not.toHaveBeenCalled();
    expect(
      cache.extract()[
        cache.identify({
          __typename: "Task",
          id: taskQuery.task.id,
          execution: taskQuery.task.execution,
        })
      ].status
    ).toBe("pending");
  });
  it("should not trigger the Konami code if it is inputted into a text field", async () => {
    const audioPlayMock = jest.fn();
    jest.spyOn(global, "Audio").mockImplementation(
      () =>
        ({
          play: audioPlayMock,
        } as any)
    );
    window.HTMLMediaElement.prototype.play = audioPlayMock;

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
        screen.getByRole("textbox"),
        "ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba"
      );
    });

    await waitFor(() => {
      expect(audioPlayMock).toHaveBeenCalledTimes(0);
    });
    expect(dispatchToast.success).not.toHaveBeenCalled();
    expect(
      cache.extract()[
        cache.identify({
          __typename: "Task",
          id: taskQuery.task.id,
          execution: taskQuery.task.execution,
        })
      ].status
    ).toBe("pending");
  });
});
