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
    expect(screen.getByLabelText("Distro")).toHaveValue("localhost");
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

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    await user.click(screen.getByLabelText("Distro"));
    expect(screen.getByRole("listbox")).toBeVisible();
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

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    await user.click(screen.getByLabelText("Distro"));
    expect(screen.getByRole("listbox")).toBeVisible();

    expect(screen.getAllByRole("option")).toHaveLength(3);
    await user.clear(screen.getByPlaceholderText("Select distro"));
    await user.type(screen.getByPlaceholderText("Select distro"), "abc");
    expect(screen.getAllByRole("option")).toHaveLength(1);
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
          adminOnly: false,
          isVirtualWorkStation: true,
          name: "localhost",
        },
        {
          __typename: "Distro",
          adminOnly: true,
          isVirtualWorkStation: false,
          name: "localhost2",
        },
        {
          __typename: "Distro",
          adminOnly: true,
          isVirtualWorkStation: true,
          name: "abc",
        },
      ],
    },
  },
};
