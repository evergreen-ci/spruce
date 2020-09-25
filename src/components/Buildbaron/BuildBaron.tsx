import React from "react";
import { ApolloError } from "@apollo/client";
import { BuildBaronQuery } from "gql/generated/types";
import { BuildBaronContent } from "./BuildBaronContent";

interface Props {
  data: BuildBaronQuery;
  error: ApolloError;
  taskId: string;
}

const BuildBaron: React.FC<Props> = ({ data, error, taskId }) => (
  <>
    {error && (
      <div>There was an error loading the build baron: {error.message}</div>
    )}

    {data && <BuildBaronContent eventData={data.buildBaron} taskId={taskId} />}
  </>
);

export default BuildBaron;
