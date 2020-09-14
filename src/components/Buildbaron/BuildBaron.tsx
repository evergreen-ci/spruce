import React from "react";
import { ApolloError } from "@apollo/client";
import { BuildBaronQuery } from "gql/generated/types";
import { BuildBaronTable } from "./BuildBaronTable";

interface Props {
  data: BuildBaronQuery;
  error: ApolloError;
}

const BuildBaron: React.FC<Props> = ({ data, error }) => (
  <>
    {error && (
      <div>There was an error loading the build baron: {error.message}</div>
    )}

    {data && <BuildBaronTable eventData={data.buildBaron} />}
  </>
);

export default BuildBaron;
