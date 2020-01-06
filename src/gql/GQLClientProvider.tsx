import * as React from "react";
import GQLWrapper from "./GQLWrapper";
import { getGQLUrl, isDevelopment, isTest, getSchemaString } from "../utils";

export const GQLClientProvider: React.FC = ({ children }) => (
  <GQLWrapper
    gqlURL={getGQLUrl()}
    isDevelopment={isDevelopment()}
    isTest={isTest()}
    schemaString={getSchemaString()}
    credentials="include"
  >
    {children}
  </GQLWrapper>
);

export default GQLClientProvider;
