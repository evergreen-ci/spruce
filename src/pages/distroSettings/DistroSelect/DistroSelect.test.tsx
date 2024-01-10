import { MockedProvider } from "@apollo/client/testing";
import { DistrosQuery, DistrosQueryVariables } from "gql/generated/types";
import { DISTROS } from "gql/queries";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import { ApolloMock } from "types/gql";
import { DistroSelect } from ".";

const wrapper = ({ children }) => (
  <MockedProvider mocks={[distrosMock]}>{children}</MockedProvider>
);

describe("distro select", () => {
  it("shows distro name as dropdown content", async () => {
    render(<DistroSelect selectedDistro="localhost" />, {
      wrapper,
    });
    await waitFor(() => {
      expect(screen.getByDataCy("distro-select")).toBeInTheDocument();
    });
    expect(screen.getByDataCy("distro-select")).toHaveTextContent("localhost");
  });

  it("selecting a different distro will navigate to the correct URL", async () => {
    const user = userEvent.setup();
    const { router } = render(<DistroSelect selectedDistro="localhost" />, {
      wrapper,
      route: "/distro/localhost/settings/general",
      path: "/distro/:distroId/settings/:tab",
    });
    await waitFor(() => {
      expect(screen.getByDataCy("distro-select")).toBeInTheDocument();
    });

    await user.click(screen.getByDataCy("distro-select"));
    expect(screen.getByDataCy("distro-select-options")).toBeInTheDocument();
    await user.click(screen.getByText("abc"));
    expect(screen.queryByDataCy("distro-select-options")).toBeNull();
    expect(router.state.location.pathname).toBe("/distro/abc/settings/general");
  });

  it("typing in the text input will narrow down search results", async () => {
    const user = userEvent.setup();
    render(<DistroSelect selectedDistro="localhost" />, {
      wrapper,
    });
    await waitFor(() => {
      expect(screen.getByDataCy("distro-select")).toBeInTheDocument();
    });

    await user.click(screen.getByDataCy("distro-select"));
    expect(
      screen.getByDataCy("distro-select-search-input"),
    ).toBeInTheDocument();
    expect(screen.getByDataCy("distro-select-options")).toBeInTheDocument();

    let options = await screen.findAllByDataCy("searchable-dropdown-option");
    expect(options).toHaveLength(3);
    await user.type(screen.queryByDataCy("distro-select-search-input"), "abc");
    options = await screen.findAllByDataCy("searchable-dropdown-option");
    expect(options).toHaveLength(1);
  });
});

const distrosMock: ApolloMock<DistrosQuery, DistrosQueryVariables> = {
  request: {
    query: DISTROS,
    variables: { onlySpawnable: false },
  },
  result: {
    data: {
      distros: [
        {
          __typename: "Distro",
          isVirtualWorkStation: true,
          name: "localhost",
        },
        {
          __typename: "Distro",
          isVirtualWorkStation: false,
          name: "localhost2",
        },
        {
          __typename: "Distro",
          isVirtualWorkStation: true,
          name: "abc",
        },
      ],
    },
  },
};
