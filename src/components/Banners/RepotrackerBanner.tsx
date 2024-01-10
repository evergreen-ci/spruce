import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Banner from "@leafygreen-ui/banner";
import TextInput from "@leafygreen-ui/text-input";
import { InlineCode } from "@leafygreen-ui/typography";
import { ConfirmationModal } from "components/ConfirmationModal";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  UserProjectSettingsPermissionsQuery,
  UserProjectSettingsPermissionsQueryVariables,
  RepotrackerErrorQuery,
  RepotrackerErrorQueryVariables,
  SetLastRevisionMutation,
  SetLastRevisionMutationVariables,
} from "gql/generated/types";
import { SET_LAST_REVISION } from "gql/mutations";
import {
  USER_PROJECT_SETTINGS_PERMISSIONS,
  REPOTRACKER_ERROR,
} from "gql/queries";
import { PortalBanner } from "./PortalBanner";

interface RepotrackerBannerProps {
  projectIdentifier: string;
}
export const RepotrackerBanner: React.FC<RepotrackerBannerProps> = ({
  projectIdentifier,
}) => {
  const dispatchToast = useToastContext();
  const [openModal, setOpenModal] = useState(false);
  const [baseRevision, setBaseRevision] = useState("");

  const { data: repotrackerData } = useQuery<
    RepotrackerErrorQuery,
    RepotrackerErrorQueryVariables
  >(REPOTRACKER_ERROR, {
    variables: { projectIdentifier },
  });
  const hasRepotrackerError =
    repotrackerData?.project?.repotrackerError?.exists ?? false;

  const { data: permissionsData } = useQuery<
    UserProjectSettingsPermissionsQuery,
    UserProjectSettingsPermissionsQueryVariables
  >(USER_PROJECT_SETTINGS_PERMISSIONS, {
    variables: { projectIdentifier },
    // If there's no repotracker error, there is no need to determine whether the current user is an admin.
    skip: !hasRepotrackerError,
  });
  const isProjectAdmin =
    permissionsData?.user?.permissions?.projectPermissions?.edit ?? false;

  const [setLastRevision] = useMutation<
    SetLastRevisionMutation,
    SetLastRevisionMutationVariables
  >(SET_LAST_REVISION, {
    onCompleted: () => {
      dispatchToast.success(
        "Successfully updated merge base revision. The repotracker job has been scheduled to run.",
      );
    },
    onError: (err) => {
      dispatchToast.error(
        `Error when attempting to update merge base revision: ${err.message}`,
      );
    },
  });

  const resetModal = () => {
    setOpenModal(false);
    setBaseRevision("");
  };

  if (!hasRepotrackerError) {
    return null;
  }
  return (
    <>
      <PortalBanner
        banner={
          <Banner data-cy="repotracker-error-banner" variant="danger">
            {isProjectAdmin ? (
              <span>
                The project was unable to build. Please specify a new base
                revision by clicking{" "}
                <ModalTriggerText
                  data-cy="repotracker-error-trigger"
                  onClick={() => setOpenModal(true)}
                >
                  here
                </ModalTriggerText>
                .
              </span>
            ) : (
              "The project was unable to build. Please reach out to a project admin to fix."
            )}
          </Banner>
        }
      />
      <ConfirmationModal
        buttonText="Confirm"
        data-cy="repotracker-error-modal"
        onCancel={resetModal}
        onConfirm={() => {
          setLastRevision({
            variables: { projectIdentifier, revision: baseRevision },
            refetchQueries: ["RepotrackerError"],
          });
          resetModal();
        }}
        open={openModal}
        setOpen={setOpenModal}
        submitDisabled={baseRevision.length < 40}
        title="Enter New Base Revision"
      >
        <ModalDescription>
          The current base revision{" "}
          <InlineCode>
            {repotrackerData?.project?.repotrackerError?.invalidRevision}
          </InlineCode>{" "}
          cannot be found on branch &apos;{repotrackerData?.project?.branch}
          &apos;. In order to resume tracking the repository, please enter a new
          base revision.
        </ModalDescription>
        <TextInput
          description="Specify a full 40 character hash."
          label="Base Revision"
          onChange={(e) => setBaseRevision(e.target.value)}
          value={baseRevision}
        />
      </ConfirmationModal>
    </>
  );
};

const ModalDescription = styled.div`
  margin-bottom: ${size.xs};
`;

const ModalTriggerText = styled.span`
  font-weight: bold;
  text-decoration-line: underline;
  text-underline-offset: 2px;
  text-decoration-thickness: 2px;
  :hover {
    cursor: pointer;
  }
`;
