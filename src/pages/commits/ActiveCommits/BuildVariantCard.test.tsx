import { MockedProvider } from "@apollo/client/testing";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import { BuildVariantCard } from "./BuildVariantCard";
import { injectGlobalStyle, removeGlobalStyle } from "./utils";

jest.mock("./utils");

describe("buildVariantCard", () => {
  it("should call the appropriate functions on hover and unhover", async () => {
    const mockIntersectionObserver = jest.fn((callback) => {
      callback([
        {
          isIntersecting: true,
        },
      ]);
      return {
        observe: jest.fn(),
        disconnect: jest.fn(),
      };
    });

    // @ts-expect-error
    window.IntersectionObserver = mockIntersectionObserver;
    (injectGlobalStyle as jest.Mock).mockImplementationOnce(
      (taskIdentifier: string) => {
        Promise.resolve(taskIdentifier);
      }
    );
    (removeGlobalStyle as jest.Mock).mockImplementationOnce(() => {});

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <BuildVariantCard
          variant="ubuntu-2204"
          height={100}
          buildVariantDisplayName="Ubuntu 22.04"
          projectIdentifier="testing"
          versionId="abc"
          order={1}
          tasks={tasks}
        />
      </MockedProvider>
    );

    userEvent.hover(screen.queryByDataCy("build-variant-icon-container"));
    await waitFor(() => {
      expect(injectGlobalStyle).toHaveBeenCalledTimes(1);
    });

    userEvent.unhover(screen.queryByDataCy("build-variant-icon-container"));
    await waitFor(() => {
      expect(removeGlobalStyle).toHaveBeenCalledTimes(1);
    });
  });
});

const tasks = [
  {
    id: "1",
    status: "failed",
    displayName: "One",
  },
  {
    id: "2",
    status: "succeeded",
    displayName: "Two",
  },
  {
    id: "3",
    status: "succeeded",
    displayName: "Three",
  },
];
