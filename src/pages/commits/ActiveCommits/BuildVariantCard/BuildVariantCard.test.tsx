import { MockedProvider } from "@apollo/client/testing";
import {
  injectGlobalDimStyle,
  removeGlobalDimStyle,
} from "pages/commits/ActiveCommits/utils";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import { BuildVariantCard } from ".";

jest.mock("../utils");

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

    Object.defineProperty(window, "IntersectionObserver", {
      writable: true,
      value: mockIntersectionObserver,
    });
    (injectGlobalDimStyle as jest.Mock).mockImplementationOnce(() => {
      Promise.resolve();
    });

    (removeGlobalDimStyle as jest.Mock).mockImplementationOnce(() => {});

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
      expect(injectGlobalDimStyle).toHaveBeenCalledTimes(1);
    });

    userEvent.unhover(screen.queryByDataCy("build-variant-icon-container"));
    await waitFor(() => {
      expect(removeGlobalDimStyle).toHaveBeenCalledTimes(1);
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
    status: "success",
    displayName: "Two",
  },
  {
    id: "3",
    status: "success",
    displayName: "Three",
  },
];
