import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";
import { Skeleton } from "antd";
import { H2 } from "components/Typography";
import {
  GET_CODE_CHANGES,
  GetCodeChangesQuery
} from "gql/queries/get-code-changes";
import Button from "@leafygreen-ui/button";
import styled from "@emotion/styled";

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
  const content = data.patch.moduleCodeChanges.map(modCodeChange => {
    return (
      <div>
        <H2>Changes on {modCodeChange.branchName}: </H2>
        <StyledButton
          size="small"
          title="Create an item"
          href={modCodeChange.htmlLink}
        >
          HTML
        </StyledButton>
        <StyledButton
          size="small"
          title="Create an item"
          href={modCodeChange.rawLink}
        >
          RAW
        </StyledButton>
      </div>
    );
  });
  return <div>{content}</div>;
};

const StyledButton = styled(Button)`
  margin-left: 16px;
`;
