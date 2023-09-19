import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Tooltip from "@leafygreen-ui/tooltip";
import { Field } from "@rjsf/core";
import { SpruceForm } from "components/SpruceForm";
import { size, zIndex } from "constants/tokens";
import { GithubOrgsQuery } from "gql/generated/types";
import { GITHUB_ORGS } from "gql/queries";
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

  const { data } = useQuery<GithubOrgsQuery>(GITHUB_ORGS);
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
              <>
                <Button
                  onClick={() => setMoveModalOpen(true)}
                  size="small"
                  data-cy="move-repo-button"
                >
                  Move to New Repo
                </Button>
                <MoveRepoModal
                  githubOrgs={githubOrgs}
                  handleClose={() => setMoveModalOpen(false)}
                  open={moveModalOpen}
                  projectId={projectId}
                  repoName={repoName}
                  repoOwner={repoOwner}
                />
              </>
            )}
            <Tooltip
              align="top"
              data-cy="attach-repo-disabled-tooltip"
              enabled={ownerOrRepoHasChanges}
              justify="middle"
              popoverZIndex={zIndex.popover}
              triggerEvent="hover"
              trigger={
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
              }
            >
              Project must be saved with new owner/repo before it can be
              attached.
            </Tooltip>
          </ButtonRow>
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
  display: flex;

  > :not(:last-child) {
    margin-right: ${size.xs};
  }
`;

const Container = styled.div<{ hasButtons: boolean }>`
  ${({ hasButtons }): string => hasButtons && `margin-bottom: ${size.m};`}
`;
