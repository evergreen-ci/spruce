import { renderHook, act } from "@testing-library/react-hooks";

import { usePollTableQuery } from "hooks";
import { NetworkStatus } from "apollo-client";

test("Should have correctly formatted request payload after selecting options", async () => {
  const networkStatus = NetworkStatus.ready;
  const search = "a";
  const refetch = jest.fn((variables: QueryVariables) => {
    console.log("AHHHHHH");
    return;
  });
  const { result, waitForNextUpdate } = renderHook(() =>
    usePollTableQuery({
      getQueryVariables,
      networkStatus,
      refetch,
      search,
    })
  );
  await waitForNextUpdate();
  console.log(refetch.mock.calls);
});

type QueryVariables = {
  search: string;
};

const getQueryVariables = (search: string): QueryVariables => {
  return {
    search,
  };
};
