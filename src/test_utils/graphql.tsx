import React from "react";
import { MockedProvider, MockedProviderProps } from "@apollo/client/testing";
import { cache } from "gql/client/cache";

const CustomMockedProvider: React.FC<MockedProviderProps> = ({
  children,
  ...props
}) => (
  <MockedProvider cache={cache} {...props}>
    {children}
  </MockedProvider>
);

export { CustomMockedProvider as MockedProvider };
