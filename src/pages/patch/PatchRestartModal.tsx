import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Checkbox from "@leafygreen-ui/checkbox";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { useLocation, useParams } from "react-router-dom";
import { usePatchAnalytics } from "analytics";
import { Accordion } from "components/Accordion";
import { Modal } from "components/Modal";
import { TaskStatusFilters } from "components/TaskStatusFilters";
import { H2 } from "components/Typography";
import { useToastContext } from "context/toast";
import {
  Patch,
  PatchBuildVariantsQuery,
  PatchBuildVariantsQueryVariables,
  RestartPatchMutation,
  RestartPatchMutationVariables,
} from "gql/generated/types";
import { RESTART_PATCH } from "gql/mutations";
import { GET_PATCH_BUILD_VARIANTS } from "gql/queries";
import { usePatchStatusSelect, usePrevious } from "hooks";
import { selectedStrings } from "hooks/usePatchStatusSelect";
import { PatchBuildVariantAccordion } from "pages/patch/patchRestartModal/index";
import { PatchTasksQueryParams } from "types/task";
import { queryString } from "utils";

const { getArray, parseQueryString } = queryString;
const { gray } = uiColors;

interface PatchRestartContentProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  patchId?: string;
  refetchQueries: string[];
  childPatches: Partial<Patch>[];
  setShouldAbortInProgressTasks: React.Dispatch<React.SetStateAction<boolean>>;
  shouldAbortInProgressTasks: boolean;
  shouldRestart: number;
  setMutationLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  buttonDisabled: boolean;
}

export const PatchRestartContent: React.FC<PatchRestartContentProps> = ({
  visible,
  onOk,
  onCancel,
  patchId: patchIdFromProps,
  refetchQueries,
  childPatches,
  setShouldAbortInProgressTasks,
  shouldAbortInProgressTasks,
  shouldRestart,
  setMutationLoading,
  setButtonDisabled,
  buttonDisabled,
}) => {
  const { id } = useParams<{ id: string }>();
  const patchId = patchIdFromProps ?? id;
  return (
    <>
      <PatchRestartTasks
        patchId={patchId}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        refetchQueries={refetchQueries}
        setShouldAbortInProgressTasks={setShouldAbortInProgressTasks}
        shouldAbortInProgressTasks={shouldAbortInProgressTasks}
        restart={shouldRestart}
        setMutationLoading={setMutationLoading}
        setButtonDisabled={setButtonDisabled}
        buttonDisabled={buttonDisabled}
      />
      <>
        {childPatches && (
          <>
            <HR />
            <Accordion
              title={<StyledTitle> Select Downstream Tasks</StyledTitle>}
              contents={childPatches.map(({ id: childPatchId, projectID }) => (
                <Accordion
                  key={childPatchId}
                  title={projectID}
                  contents={
                    <PatchRestartTasks
                      patchId={childPatchId}
                      visible={visible}
                      onOk={onOk}
                      onCancel={onCancel}
                      refetchQueries={refetchQueries}
                      setShouldAbortInProgressTasks={
                        setShouldAbortInProgressTasks
                      }
                      shouldAbortInProgressTasks={shouldAbortInProgressTasks}
                      restart={shouldRestart}
                      setMutationLoading={setMutationLoading}
                      setButtonDisabled={setButtonDisabled}
                      buttonDisabled={buttonDisabled}
                    />
                  }
                />
              ))}
            />
          </>
        )}
        <PatchRestartFooter
          setShouldAbortInProgressTasks={setShouldAbortInProgressTasks}
          shouldAbortInProgressTasks={shouldAbortInProgressTasks}
        />
      </>
    </>
  );
};

interface PatchRestartTasksProps {
  restart: number;
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  patchId?: string;
  refetchQueries: string[];
  setShouldAbortInProgressTasks: React.Dispatch<React.SetStateAction<boolean>>;
  shouldAbortInProgressTasks: boolean;
  setMutationLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  buttonDisabled: boolean;
}
export const PatchRestartTasks: React.FC<PatchRestartTasksProps> = ({
  restart,
  onOk,
  patchId,
  shouldAbortInProgressTasks,
  refetchQueries,
  setMutationLoading,
  setButtonDisabled,
  buttonDisabled,
}) => {
  const dispatchToast = useToastContext();
  const prevRestart = usePrevious(restart);

  const [restartPatch, { loading: mutationLoading }] = useMutation<
    RestartPatchMutation,
    RestartPatchMutationVariables
  >(RESTART_PATCH, {
    onCompleted: () => {
      onOk();
      dispatchToast.success(`Successfully restarted patch!`);
    },
    onError: (err) => {
      onOk();
      dispatchToast.error(`Error while restarting patch: '${err.message}'`);
    },
    refetchQueries,
  });

  const { data } = useQuery<
    PatchBuildVariantsQuery,
    PatchBuildVariantsQueryVariables
  >(GET_PATCH_BUILD_VARIANTS, {
    variables: { patchId },
  });
  const { patchBuildVariants } = data || {};
  const [
    selectedTasks,
    patchStatusFilterTerm,
    baseStatusFilterTerm,
    { toggleSelectedTask, setPatchStatusFilterTerm, setBaseStatusFilterTerm },
  ] = usePatchStatusSelect(patchBuildVariants);

  useEffect(() => {
    setButtonDisabled(
      buttonDisabled && selectedArray(selectedTasks).length === 0
    );

    setMutationLoading(mutationLoading);
  }, [
    buttonDisabled,
    selectedTasks,
    mutationLoading,
    setButtonDisabled,
    setMutationLoading,
  ]);

  const { search } = useLocation();
  const prevSearch = usePrevious(search);
  useEffect(() => {
    if (search !== prevSearch) {
      const urlParams = parseQueryString(search);
      setPatchStatusFilterTerm(
        getArray(urlParams[PatchTasksQueryParams.Statuses]) ?? []
      );
      setBaseStatusFilterTerm(
        getArray(urlParams[PatchTasksQueryParams.BaseStatuses]) ?? []
      );
    }
  }, [search, prevSearch, setBaseStatusFilterTerm, setPatchStatusFilterTerm]);

  const patchAnalytics = usePatchAnalytics();
  const handlePatchRestart = async () => {
    patchAnalytics.sendEvent({
      name: "Restart",
      abort: shouldAbortInProgressTasks,
    });
    if (selectedArray(selectedTasks).length !== 0) {
      await restartPatch({
        variables: {
          patchId,
          taskIds: selectedArray(selectedTasks),
          abort: shouldAbortInProgressTasks,
        },
      });
    }
  };

  if (restart !== prevRestart) {
    handlePatchRestart();
  }

  return (
    <>
      {patchBuildVariants && (
        <>
          <Row>
            <TaskStatusFilters
              onChangeBaseStatusFilter={setBaseStatusFilterTerm}
              onChangeStatusFilter={setPatchStatusFilterTerm}
              patchId={patchId}
              selectedBaseStatuses={baseStatusFilterTerm}
              selectedStatuses={patchStatusFilterTerm}
              filterWidth="50%"
            />
          </Row>
          {patchBuildVariants.map((patchBuildVariant) => (
            <PatchBuildVariantAccordion
              key={`accoridan_${patchBuildVariant.variant}`}
              tasks={patchBuildVariant.tasks}
              displayName={patchBuildVariant.displayName}
              selectedTasks={selectedTasks}
              toggleSelectedTask={toggleSelectedTask}
            />
          ))}
        </>
      )}
    </>
  );
};

interface PatchRestartFooterProps {
  setShouldAbortInProgressTasks: React.Dispatch<React.SetStateAction<boolean>>;
  shouldAbortInProgressTasks: boolean;
}
export const PatchRestartFooter: React.FC<PatchRestartFooterProps> = ({
  setShouldAbortInProgressTasks,
  shouldAbortInProgressTasks,
}) => (
  <>
    <HR />
    <ConfirmationMessage weight="medium" data-cy="confirmation-message">
      Are you sure you want to restart the selected tasks?
    </ConfirmationMessage>
    <Checkbox
      onChange={() =>
        setShouldAbortInProgressTasks(!shouldAbortInProgressTasks)
      }
      label="Abort in progress tasks"
      checked={shouldAbortInProgressTasks}
      bold={false}
    />
  </>
);

interface PatchModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  patchId?: string;
  refetchQueries: string[];
  childPatches: Partial<Patch>[];
}
export const PatchRestartModal: React.FC<PatchModalProps> = ({
  visible,
  onOk,
  onCancel,
  patchId,
  refetchQueries,
  childPatches,
}) => {
  const [shouldAbortInProgressTasks, setShouldAbortInProgressTasks] = useState(
    false
  );

  const [mutationLoading, setMutationLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [shouldRestart, setShouldRestart] = useState(0);

  const handlePatchRestart = async (e): Promise<void> => {
    e.preventDefault();
    setShouldRestart(shouldRestart + 1);
  };

  return (
    <Modal
      title="Modify Version"
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      footer={[
        <Button
          key="cancel"
          onClick={onCancel}
          data-cy="cancel-restart-modal-button"
        >
          Cancel
        </Button>,
        <Button
          key="restart"
          data-cy="restart-patch-button"
          disabled={buttonDisabled || mutationLoading}
          onClick={handlePatchRestart}
          variant="danger"
        >
          Restart
        </Button>,
      ]}
      data-cy="patch-restart-modal"
    >
      <PatchRestartContent
        patchId={patchId}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        refetchQueries={refetchQueries}
        childPatches={childPatches}
        setShouldAbortInProgressTasks={setShouldAbortInProgressTasks}
        shouldAbortInProgressTasks={shouldAbortInProgressTasks}
        shouldRestart={shouldRestart}
        setMutationLoading={setMutationLoading}
        setButtonDisabled={setButtonDisabled}
        buttonDisabled={buttonDisabled}
      />
    </Modal>
  );
};

const selectedArray = (selected: selectedStrings) => {
  const out: string[] = [];
  Object.keys(selected).forEach((task) => {
    if (selected[task]) {
      out.push(task);
    }
  });

  return out;
};

const HR = styled("hr")`
  background-color: ${gray.light2};
  border: 0;
  height: 1px;
`;

const ConfirmationMessage = styled(Body)`
  padding-top: 15px;
  padding-bottom: 15px;
`;

const Row = styled.div`
  display: flex;
  >: first-child {
    margin-right: 16px;
  }
`;

export const StyledTitle = styled(H2)`
  padding-top: 8px;
`;
