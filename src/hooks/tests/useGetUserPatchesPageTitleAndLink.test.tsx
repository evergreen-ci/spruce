import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { useGetUserPatchesPageTitleAndLink } from "hooks";
import { MockedProvider } from "@apollo/react-testing";
import { GET_OTHER_USER } from "gql/queries";
import wait from "waait";

const mocks = [
  {
    request: {
      query: GET_OTHER_USER,
      variables: {
        userId: "admin",
      },
    },
    result: {
      data: {
        otherUser: {
          userId: "admin",
          displayName: "Evergreen Admin",
          __typename: "User",
        },
        currentUser: { userId: "admin", __typename: "User" },
      },
    },
  },
  {
    request: {
      query: GET_OTHER_USER,
      variables: {
        userId: "justin.mathew",
      },
    },
    result: {
      data: {
        otherUser: {
          userId: "justin.mathew",
          displayName: "Justin Mathew",
          __typename: "User",
        },
        currentUser: { userId: "admin", __typename: "User" },
      },
    },
  },
  {
    request: {
      query: GET_OTHER_USER,
      variables: {
        userId: "justin.mathews",
      },
    },
    result: {
      data: {
        otherUser: {
          userId: "justin.mathews",
          displayName: "Justin Mathews",
          __typename: "User",
        },
        currentUser: { userId: "admin", __typename: "User" },
      },
    },
  },
];

const Provider = ({ children }) => (
  <MockedProvider mocks={mocks}>{children}</MockedProvider>
);

test("Return correct title and link when the userId passed into the hook parameter is that of the logged in user", async () => {
  const { result } = renderHook(
    () => useGetUserPatchesPageTitleAndLink("admin"),
    { wrapper: Provider }
  );

  await act(async () => {
    await wait(0);
  });

  expect(result.current.title).toEqual("My Patches");
  expect(result.current.link).toEqual("/user/admin/patches");
});

test("Return correct title and link when the userId passed into the hook parameter is not that of the logged in user", async () => {
  const { result } = renderHook(
    () => useGetUserPatchesPageTitleAndLink("justin.mathew"),
    { wrapper: Provider }
  );

  await act(async () => {
    await wait(0);
  });

  expect(result.current.title).toEqual("Justin Mathew's Patches");
  expect(result.current.link).toEqual("/user/justin.mathew/patches");
});

test("Return correct title and link when the userId passed into the hook parameter is not that of the logged in user and the display name of the other user ends with the letter 's'", async () => {
  const { result } = renderHook(
    () => useGetUserPatchesPageTitleAndLink("justin.mathews"),
    { wrapper: Provider }
  );

  await act(async () => {
    await wait(0);
  });

  expect(result.current.title).toEqual("Justin Mathews' Patches");
  expect(result.current.link).toEqual("/user/justin.mathews/patches");
});
