import { useMemo } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Tab } from "@leafygreen-ui/tabs";
import TextInput from "@leafygreen-ui/text-input";
import { useNavigate } from "react-router-dom";
import { CodeChanges } from "components/CodeChanges/CodeChanges";
import {
  MetadataCard,
  MetadataItem,
  MetadataTitle,
} from "components/MetadataCard";
import { PageContent, PageLayout, PageSider } from "components/styles";
import { StyledTabs } from "components/styles/StyledTabs";
import { getVersionRoute } from "constants/routes";
import { fontSize, size } from "constants/tokens";

import { useToastContext } from "context/toast";
import {
  SchedulePatchMutation,
  PatchConfigure,
  SchedulePatchMutationVariables,
  VariantTasks,
  ChildPatchAlias,
  ConfigurePatchQuery,
  ProjectBuildVariant,
} from "gql/generated/types";
import { SCHEDULE_PATCH } from "gql/mutations";
import {
  AliasState,
  ChildPatchAliased,
  PatchTriggerAlias,
  VariantTasksState,
  useConfigurePatch,
} from "hooks/useConfigurePatch";
import { ParametersContent } from "pages/configurePatch/ParametersContent";
import { ConfigureBuildVariants } from "./configurePatchCore/ConfigureBuildVariants";
import { ConfigureTasks } from "./configurePatchCore/ConfigureTasks";

interface Props {
  patch: ConfigurePatchQuery["patch"];
}
export const ConfigurePatchCore: React.VFC<Props> = ({ patch }) => {
  const navigate = useNavigate();
  const dispatchToast = useToastContext();

  const {
    project,
    id,
    author,
    time,
    activated,
    childPatches,
    patchTriggerAliases,
    childPatchAliases,
  } = patch;
  const { variants } = project;

  const childPatchesWithAliases: ChildPatchAliased[] =
    childPatches?.map((cp) => {
      const { alias = id } =
        childPatchAliases.find(({ patchId }) => cp.id === patchId) || {};
      return { ...cp, alias };
    }) ?? [];

  const selectableAliases = useMemo(
    () => filterAliases(patchTriggerAliases, childPatchAliases || []),
    [patchTriggerAliases, childPatchAliases]
  );

  const initialPatch = useMemo(
    () => ({ ...patch, patchTriggerAliases: selectableAliases }),
    [patch, selectableAliases]
  );

  const {
    description,
    disableBuildVariantSelect,
    patchParams,
    selectedAliases,
    selectedBuildVariants,
    selectedBuildVariantTasks,
    selectedTab,
    setDescription,
    setPatchParams,
    setSelectedAliases,
    setSelectedBuildVariants,
    setSelectedBuildVariantTasks,
    setSelectedTab,
  } = useConfigurePatch(initialPatch, variants);

  const [schedulePatch, { loading: loadingScheduledPatch }] = useMutation<
    SchedulePatchMutation,
    SchedulePatchMutationVariables
  >(SCHEDULE_PATCH, {
    onCompleted(data) {
      const { schedulePatch: scheduledPatch } = data;
      dispatchToast.success("Successfully scheduled the patch");
      navigate(getVersionRoute(scheduledPatch.versionFull.id));
    },
    onError(err) {
      dispatchToast.error(
        `There was an error scheduling this patch : ${err.message}`
      );
    },
    refetchQueries: ["VersionTasks", "VersionTaskDurations"],
  });

  const onClickSchedule = async (): Promise<void> => {
    const configurePatchParam: PatchConfigure = {
      description,
      variantsTasks: toGQLVariantTasksType(selectedBuildVariantTasks),
      parameters: patchParams,
      patchTriggerAliases: toGQLAliasType(selectedAliases),
    };
    schedulePatch({
      variables: { patchId: id, configure: configurePatchParam },
    });
  };

  if (variants.length === 0) {
    return (
      // TODO: Full page error
      <PageLayout>
        <div data-cy="full-page-error">
          Something went wrong. This patch&apos;s project either has no variants
          or no tasks associated with it.{" "}
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      <FlexRow>
        <StyledInput
          label="Patch Name"
          data-cy="patch-name-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {activated && (
          <StyledButton
            data-cy="cancel-button"
            onClick={() =>
              window.history.state.idx > 0
                ? navigate(-1)
                : navigate(getVersionRoute(id))
            }
          >
            Cancel
          </StyledButton>
        )}
      </FlexRow>
      <PageLayout>
        <PageSider>
          <MetadataCard error={null}>
            <MetadataTitle>Patch Metadata</MetadataTitle>
            <MetadataItem>Submitted by: {author}</MetadataItem>
            <MetadataItem>Submitted at: {time.submittedAt}</MetadataItem>
          </MetadataCard>
          <ConfigureBuildVariants
            variants={getVariantEntries(variants, selectedBuildVariantTasks)}
            aliases={[
              ...getPatchTriggerAliasEntries(
                selectableAliases,
                selectedAliases
              ),
              ...getChildPatchEntries(childPatchesWithAliases),
            ]}
            selectedBuildVariants={selectedBuildVariants}
            setSelectedBuildVariants={setSelectedBuildVariants}
            disabled={disableBuildVariantSelect}
          />
        </PageSider>
        <PageLayout>
          <PageContent>
            <StyledTabs
              selected={selectedTab}
              setSelected={setSelectedTab}
              aria-label="Configure Patch Tabs"
            >
              <Tab data-cy="tasks-tab" name="Configure">
                <ConfigureTasks
                  selectedBuildVariants={selectedBuildVariants}
                  selectedBuildVariantTasks={selectedBuildVariantTasks}
                  setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
                  activated={activated}
                  loading={loadingScheduledPatch}
                  onClickSchedule={onClickSchedule}
                  selectedAliases={selectedAliases}
                  setSelectedAliases={setSelectedAliases}
                  childPatches={childPatchesWithAliases}
                  selectableAliases={selectableAliases}
                />
              </Tab>
              <Tab data-cy="changes-tab" name="Changes">
                <CodeChanges />
              </Tab>
              <Tab data-cy="parameters-tab" name="Parameters">
                <ParametersContent
                  patchActivated={activated}
                  patchParameters={patchParams}
                  setPatchParams={setPatchParams}
                />
              </Tab>
            </StyledTabs>
          </PageContent>
        </PageLayout>
      </PageLayout>
    </>
  );
};

const getVariantEntries = (
  variants: ProjectBuildVariant[],
  selectedBuildVariantTasks: VariantTasksState
) =>
  variants.map(({ displayName, name }) => ({
    displayName,
    name,
    taskCount: selectedBuildVariantTasks[name]
      ? Object.values(selectedBuildVariantTasks[name]).filter((v) => v).length
      : 0,
  }));

const getPatchTriggerAliasEntries = (
  selectableAliases: PatchTriggerAlias[],
  selectedAliases: AliasState
) => {
  if (!selectableAliases) {
    return [];
  }
  return selectableAliases.map(
    ({ alias, childProjectIdentifier, variantsTasks }) => ({
      displayName: `${alias} (${childProjectIdentifier})`,
      name: alias,
      taskCount: selectedAliases[alias]
        ? variantsTasks.reduce((count, { tasks }) => count + tasks.length, 0)
        : 0,
    })
  );
};

const getChildPatchEntries = (childPatches: ChildPatchAliased[]) => {
  if (!childPatches) {
    return [];
  }
  return childPatches.map(({ alias, projectIdentifier, variantsTasks }) => ({
    displayName: `${alias} (${projectIdentifier})`,
    name: alias,
    taskCount: variantsTasks.reduce((c, v) => c + v.tasks.length, 0),
  }));
};

const toGQLVariantTasksType = (
  selectedVariantTasks: VariantTasksState
): VariantTasks[] =>
  Object.entries(selectedVariantTasks)
    .map(([variantName, tasksObj]) => {
      const tasksArr = Object.entries(tasksObj)
        .filter((entry) => entry[1])
        .map((entry) => entry[0]);
      return {
        variant: variantName,
        tasks: tasksArr,
        displayTasks: [],
      };
    })
    .filter(({ tasks }) => tasks.length);

const toGQLAliasType = (selectedAliases: AliasState) =>
  Object.entries(selectedAliases)
    .filter(([, isSelected]) => isSelected)
    .map(([alias]) => alias);

// Remove all patch trigger aliases that have already been invoked as child patches via CLI
const filterAliases = (
  patchTriggerAliases: PatchTriggerAlias[],
  childPatchAliases: ChildPatchAlias[]
): PatchTriggerAlias[] => {
  const invokedAliases = new Set(childPatchAliases.map(({ alias }) => alias));
  return patchTriggerAliases.filter(({ alias }) => !invokedAliases.has(alias));
};

const StyledInput = styled(TextInput)`
  font-weight: bold;
  font-size: ${fontSize.m};
  margin-bottom: ${size.s};
  width: 100%;
`;

const StyledButton = styled(Button)`
  margin-top: ${size.m};
`;

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${size.s};
`;
