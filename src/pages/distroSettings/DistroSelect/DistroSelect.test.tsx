import { MockedProvider } from "@apollo/client/testing";
import { DistrosQuery, DistrosQueryVariables } from "gql/generated/types";
import { GET_DISTROS } from "gql/queries";
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
    const { router } = render(<DistroSelect selectedDistro="localhost" />, {
      wrapper,
      route: "/distro/localhost/settings/general",
      path: "/distro/:distroId/settings/:tab",
    });
    await waitFor(() => {
      expect(screen.getByDataCy("distro-select")).toBeInTheDocument();
    });

    userEvent.click(screen.getByDataCy("distro-select"));
    expect(screen.getByDataCy("distro-select-options")).toBeInTheDocument();
    userEvent.click(screen.getByText("abc"));
    expect(screen.queryByDataCy("distro-select-options")).toBeNull();
    expect(router.state.location.pathname).toBe("/distro/abc/settings");
  });

  it("typing in the text input will narrow down search results", async () => {
    render(<DistroSelect selectedDistro="localhost" />, {
      wrapper,
    });
    await waitFor(() => {
      expect(screen.getByDataCy("distro-select")).toBeInTheDocument();
    });

    userEvent.click(screen.getByDataCy("distro-select"));
    expect(
      screen.getByDataCy("distro-select-search-input")
    ).toBeInTheDocument();
    expect(screen.getByDataCy("distro-select-options")).toBeInTheDocument();

    let options = await screen.findAllByDataCy("searchable-dropdown-option");
    expect(options).toHaveLength(3);
    userEvent.type(screen.queryByDataCy("distro-select-search-input"), "abc");
    options = await screen.findAllByDataCy("searchable-dropdown-option");
    expect(options).toHaveLength(1);
  });
});

const distrosMock: ApolloMock<DistrosQuery, DistrosQueryVariables> = {
  request: {
    query: GET_DISTROS,
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
