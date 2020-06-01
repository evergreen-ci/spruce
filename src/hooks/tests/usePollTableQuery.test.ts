import { renderHook } from "@testing-library/react-hooks";
import { usePollTableQuery } from "hooks";
import { NetworkStatus } from "apollo-client";
import { MemoryRouter as Router } from "react-router-dom";

const refetch = jest.fn((variables: QueryVariables) =>
  Promise.resolve({
    data: { variables },
    loading: false,
    networkStatus: NetworkStatus.ready,
    stale: false,
  })
);

jest.mock("react-router-dom", () => ({
  useParams: jest.fn().mockReturnValue({ id: "123" }),
  useLocation: jest.fn().mockReturnValue({ pathname: "/path" }),
}));

test("when search value changes, showSkeleton is true and refetch is called with correct values", async () => {
  const networkStatus = NetworkStatus.ready;
  let search = "a";
  const { result, rerender } = renderHook(
    () =>
      usePollTableQuery({
        getQueryVariables,
        networkStatus,
        refetch,
        search,
      }),
    {
      wrapper: Router,
    }
  );
  expect(result.current.showSkeleton).toBe(false);
  search = "b";
  rerender();
  expect(result.current.showSkeleton).toBe(true);
  expect(refetch).toHaveBeenCalledWith(getQueryVariables(search));
});

test("when search value changes, showSkeleton is true and then goes to false when NetworkStatus goes from loading to ready", async () => {
  let networkStatus = NetworkStatus.ready;
  let search = "a";
  const { result, rerender } = renderHook(
    () =>
      usePollTableQuery({
        getQueryVariables,
        networkStatus,
        refetch,
        search,
      }),
    {
      wrapper: Router,
    }
  );

  expect(result.current.showSkeleton).toBe(false);
  search = "b";
  rerender();
  expect(result.current.showSkeleton).toBe(true);
  networkStatus = NetworkStatus.refetch;
  rerender();
  expect(result.current.showSkeleton).toBe(true);
  networkStatus = NetworkStatus.ready;
  rerender();
  expect(result.current.showSkeleton).toBe(false);
});

type QueryVariables = {
  search: string;
};

const getQueryVariables = (search: string): QueryVariables => ({
  search,
});
