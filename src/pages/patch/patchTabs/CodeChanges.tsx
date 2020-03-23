import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";
import { Skeleton } from "antd";
import {
  GET_CODE_CHANGES,
  GetCodeChangesQuery
} from "gql/queries/get-code-changes";

export const CodeChanges = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<GetCodeChangesQuery>(
    GET_CODE_CHANGES,
    {
      variables: { id: id }
    }
  );
  if (loading) {
    return <Skeleton active={true} title={true} paragraph={{ rows: 8 }} />;
  }
  if (error) {
    return <div id="patch-error">{error.message}</div>;
  }
  console.log(data);
  return <div>Code changes 4 lyfe</div>;
};
