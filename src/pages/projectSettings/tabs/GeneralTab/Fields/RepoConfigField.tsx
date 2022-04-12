import { useState } from "react";
import styled from "@emotion/styled";
import { Field } from "@rjsf/core";
import { Button } from "components/Button";
import { SpruceForm } from "components/SpruceForm";
import { size } from "constants/tokens";
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
            {isAttachedProject && (
              <Button
                onClick={() => setMoveModalOpen(true)}
                size="small"
                data-cy="move-repo-button"
              >
                Move to New Repo
              </Button>
            )}
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
          </ButtonRow>
          <AttachDetachModal
            handleClose={() => setAttachModalOpen(false)}
            open={attachModalOpen}
            projectId={projectId}
            repoName={repoName || formData.repo}
            repoOwner={repoOwner || formData.owner}
            shouldAttach={!isAttachedProject}
          />
          <MoveRepoModal
            handleClose={() => setMoveModalOpen(false)}
            open={moveModalOpen}
            projectId={projectId}
            repoName={repoName}
            repoOwner={repoOwner}
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

const Container = styled.div`
  ${(props: { hasButtons: boolean }): string =>
    props.hasButtons && `margin-bottom: ${size.m};`}
`;
