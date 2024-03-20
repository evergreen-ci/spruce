import { MockedProvider } from "@apollo/client/testing";
import { GraphQLError } from "graphql";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import { ProjectQuery, ProjectQueryVariables } from "gql/generated/types";
import { PROJECT } from "gql/queries";
import { renderHook, waitFor } from "test_utils";
import { ApolloMock } from "types/gql";
import { useProjectRedirect } from ".";

const useJointHook = ({
  sendAnalyticsEvent,
}: {
  sendAnalyticsEvent: (projectId: string, projectIdentifier: string) => void;
}) => {
  const { isRedirecting } = useProjectRedirect({ sendAnalyticsEvent });
  const { pathname, search } = useLocation();
  return { isRedirecting, pathname, search };
};

const ProviderWrapper: React.FC<{
  children: React.ReactNode;
  location: string;
}> = ({ children, location }) => (
  <MockedProvider mocks={[repoMock, projectMock]}>
    <MemoryRouter initialEntries={[location]}>
      <Routes>
        <Route element={children} path="/commits/:projectIdentifier" />
      </Routes>
    </MemoryRouter>
  </MockedProvider>
);

describe("useProjectRedirect", () => {
  it("should not redirect if URL has project identifier", async () => {
    const sendAnalyticsEvent = jest.fn();
    const { result } = renderHook(() => useJointHook({ sendAnalyticsEvent }), {
      wrapper: ({ children }) =>
        ProviderWrapper({ children, location: "/commits/my-project" }),
    });
    expect(result.current).toMatchObject({
      isRedirecting: false,
      pathname: "/commits/my-project",
      search: "",
    });
    expect(sendAnalyticsEvent).toHaveBeenCalledTimes(0);
  });

  it("should redirect if URL has project ID", async () => {
    const sendAnalyticsEvent = jest.fn();
    const { result } = renderHook(() => useJointHook({ sendAnalyticsEvent }), {
      wrapper: ({ children }) =>
        ProviderWrapper({ children, location: `/commits/${projectId}` }),
    });
    expect(result.current).toMatchObject({
      isRedirecting: true,
      pathname: "/commits/5f74d99ab2373627c047c5e5",
      search: "",
    });
    await waitFor(() => {
      expect(result.current).toMatchObject({
        isRedirecting: false,
        pathname: "/commits/my-project",
        search: "",
      });
    });
    expect(sendAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(sendAnalyticsEvent).toHaveBeenCalledWith(
      "5f74d99ab2373627c047c5e5",
      "my-project",
    );
  });

  it("should preserve query params when redirecting", async () => {
    const sendAnalyticsEvent = jest.fn();
    const { result } = renderHook(() => useJointHook({ sendAnalyticsEvent }), {
      wrapper: ({ children }) =>
        ProviderWrapper({
          children,
          location: `/commits/${projectId}?taskName=thirdparty`,
        }),
    });
    expect(result.current).toMatchObject({
      isRedirecting: true,
      pathname: "/commits/5f74d99ab2373627c047c5e5",
      search: "?taskName=thirdparty",
    });
    await waitFor(() => {
      expect(result.current).toMatchObject({
        isRedirecting: false,
        pathname: "/commits/my-project",
        search: "?taskName=thirdparty",
      });
    });
    expect(sendAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(sendAnalyticsEvent).toHaveBeenCalledWith(
      "5f74d99ab2373627c047c5e5",
      "my-project",
    );
  });

  it("should attempt redirect if URL has repo ID but stop attempting after query", async () => {
    const sendAnalyticsEvent = jest.fn();
    const { result } = renderHook(() => useJointHook({ sendAnalyticsEvent }), {
      wrapper: ({ children }) =>
        ProviderWrapper({ children, location: `/commits/${repoId}` }),
    });
    expect(result.current).toMatchObject({
      isRedirecting: true,
      pathname: "/commits/5e6bb9e23066155a993e0f1a",
      search: "",
    });
    await waitFor(() => {
      expect(result.current).toMatchObject({
        isRedirecting: false,
        pathname: "/commits/5e6bb9e23066155a993e0f1a",
        search: "",
      });
    });
    expect(sendAnalyticsEvent).toHaveBeenCalledTimes(0);
  });
});

const projectId = "5f74d99ab2373627c047c5e5";
const projectMock: ApolloMock<ProjectQuery, ProjectQueryVariables> = {
  request: {
    query: PROJECT,
    variables: {
      idOrIdentifier: projectId,
    },
  },
  result: {
    data: {
      project: {
        __typename: "Project",
        id: projectId,
        identifier: "my-project",
      },
    },
  },
};

const repoId = "5e6bb9e23066155a993e0f1a";
const repoMock: ApolloMock<ProjectQuery, ProjectQueryVariables> = {
  request: {
    query: PROJECT,
    variables: {
      idOrIdentifier: repoId,
    },
  },
  result: {
    errors: [
      new GraphQLError(
        `Error finding project by id ${repoId}: 404 (Not Found): project '${repoId}' not found`,
      ),
    ],
  },
};
