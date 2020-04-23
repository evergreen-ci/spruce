import React from "react";
import { Build } from "gql/queries/my-patches";
import styled from "@emotion/styled";
import { PatchStatusBadge } from "components/PatchStatusBadge";
import { Patch } from "gql/queries/my-patches";
import { BuildStatusIcon } from "pages/my-patches/patch-card/BuildStatusIcon";

export const PatchCard: React.FC<Patch> = ({
  description,
  status,
  createTime,
  projectID,
  builds,
}) => {
  return (
    <Container>
      <div>
        <div>{description}</div>
        <div>
          {createTime} on {projectID}
        </div>
      </div>
      <div>
        <PatchStatusBadge status={status} />
      </div>
      <IconContainer>
        {builds.map((b, i) => (
          <div>
            <BuildStatusIcon key={i} status={b.status} />
          </div>
        ))}
      </IconContainer>
    </Container>
  );
};

const IconContainer = styled.div`
  display: flex;
  > div {
    margin-right: 5px;
  }
`;
const Container = styled.div`
  display: flex;
`;
