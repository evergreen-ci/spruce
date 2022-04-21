import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import { Field } from "@rjsf/core";
import { Button } from "components/Button";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { SpruceForm } from "components/SpruceForm";
import { size, zIndex } from "constants/tokens";
import { GetGithubOrgsQuery } from "gql/generated/types";
import { GET_GITHUB_ORGS } from "gql/queries";
import { ProjectType } from "../../utils";
import { AttachDetachModal } from "./AttachDetachModal";
import { MoveRepoModal } from "./MoveRepoModal";

export const RepoConfigField: Field = ({
  formData,
  onChange,
  schema,
  uiSchema,
}) => {
  const {
    options: {
      initialOwner,
      initialRepo,
      projectId,
      projectType,
      repoName,
      repoOwner,
    },
  } = uiSchema;
  const isRepo = projectType === ProjectType.Repo;
  const isAttachedProject = projectType === ProjectType.AttachedProject;
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [attachModalOpen, setAttachModalOpen] = useState(false);

  const ownerOrRepoHasChanges =
    formData.owner !== initialOwner || formData.repo !== initialRepo;

  const { data } = useQuery<GetGithubOrgsQuery>(GET_GITHUB_ORGS);
  const { spruceConfig: { githubOrgs = [] } = {} } = data ?? {};

  return (
    <Container hasButtons={!isRepo}>
      <SpruceForm
        formData={formData}
        onChange={({ formData: formUpdate }) => onChange(formUpdate)}
        schema={schema}
        tagName="fieldset"
        uiSchema={uiSchema}
      />
      {!isRepo && (
        <>
          <ButtonRow>
            {isAttachedProject && !!githubOrgs.length && (
              <Button
                onClick={() => setMoveModalOpen(true)}
                size="small"
                data-cy="move-repo-button"
              >
                Move to New Repo
              </Button>
            )}
            <ConditionalWrapper
              condition={ownerOrRepoHasChanges}
              wrapper={(children) => (
                <Tooltip
                  align="top"
                  data-cy="attach-repo-disabled-tooltip"
                  justify="middle"
                  popoverZIndex={zIndex.popover}
                  triggerEvent="hover"
                  trigger={children}
                >
                  Project must be saved with new owner/repo before it can be
                  attached.
                </Tooltip>
              )}
            >
              <ButtonWrapper>
                <Button
                  size="small"
                  onClick={() => setAttachModalOpen(true)}
                  data-cy="attach-repo-button"
                  disabled={ownerOrRepoHasChanges}
                >
                  {isAttachedProject
                    ? "Detach from Current Repo"
                    : "Attach to Current Repo"}
                </Button>
              </ButtonWrapper>
            </ConditionalWrapper>
          </ButtonRow>
          <MoveRepoModal
            githubOrgs={githubOrgs}
            handleClose={() => setMoveModalOpen(false)}
            open={moveModalOpen}
            projectId={projectId}
            repoName={repoName}
            repoOwner={repoOwner}
          />
          <AttachDetachModal
            handleClose={() => setAttachModalOpen(false)}
            open={attachModalOpen}
            projectId={projectId}
            repoName={repoName || formData.repo}
            repoOwner={repoOwner || formData.owner}
            shouldAttach={!isAttachedProject}
          />
        </>
      )}
    </Container>
  );
};

const ButtonRow = styled.div`
  display: inline;

  > :not(:last-child) {
    margin-right: ${size.xs};
  }
`;

const ButtonWrapper = styled.div`
  width: fit-content;
`;

const Container = styled.div<{ hasButtons: boolean }>`
  ${({ hasButtons }): string => hasButtons && `margin-bottom: ${size.m};`}
`;
