import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { Tab } from "@leafygreen-ui/tabs";
import { Body } from "@leafygreen-ui/typography";
import { Input } from "antd";
import { useHistory } from "react-router-dom";
import { MetadataCard } from "components/MetadataCard";
import { CodeChanges } from "components/PatchTabs/CodeChanges";
import { ParametersContent } from "components/PatchTabs/ParametersContent";
import { PageContent, PageLayout, PageSider } from "components/styles";
import { StyledTabs } from "components/styles/StyledTabs";
import { P2 } from "components/Typography";
import { getVersionRoute } from "constants/routes";
import { useToastContext } from "context/toast";
import {
  SchedulePatchMutation,
  PatchConfigure,
  SchedulePatchMutationVariables,
  VariantTasks,
  ConfigurePatchQuery,
  Patch,
  PatchTriggerAlias,
  ProjectBuildVariant,
} from "gql/generated/types";
import { SCHEDULE_PATCH } from "gql/mutations";
import {
  DownstreamPatchState,
  VariantTasksState,
  useConfigurePatch,
} from "hooks/useConfigurePatch";
import { ConfigureBuildVariants } from "./configurePatchCore/ConfigureBuildVariants";
import { ConfigureTasks } from "./configurePatchCore/ConfigureTasks";

interface Props {
  patch: ConfigurePatchQuery["patch"];
}
export const ConfigurePatchCore: React.FC<Props> = ({ patch }) => {
  const history = useHistory();
  const dispatchToast = useToastContext();

  const {
    project,
    id,
    author,
    time,
    activated,
    childPatches,
    patchTriggerAliases,
  } = patch;
  const { variants } = project;

  const {
    description,
    disableBuildVariantSelect,
    patchParams,
    selectedBuildVariants,
    selectedBuildVariantTasks,
    selectedDownstreamPatches,
    selectedTab,
    setDescription,
    setPatchParams,
    setSelectedBuildVariants,
    setSelectedBuildVariantTasks,
    setSelectedDownstreamPatches,
    setSelectedTab,
  } = useConfigurePatch(patch, variants);

  const [schedulePatch, { loading: loadingScheduledPatch }] = useMutation<
    SchedulePatchMutation,
    SchedulePatchMutationVariables
  >(SCHEDULE_PATCH, {
    onCompleted(data) {
      const { schedulePatch: scheduledPatch } = data;
      dispatchToast.success("Successfully scheduled the patch");
      history.push(getVersionRoute(scheduledPatch.id));
    },
    onError(err) {
      dispatchToast.error(
        `There was an error scheduling this patch : ${err.message}`
      );
    },
  });

  const onClickSchedule = async (): Promise<void> => {
    const configurePatchParam: PatchConfigure = {
      description,
      variantsTasks: getGqlVariantTasksParamFromState(
        selectedBuildVariantTasks
      ),
      parameters: patchParams,
      patchTriggerAliases: getGqlDownstreamPatchesFromState(
        selectedDownstreamPatches
      ),
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
      <StyledBody weight="medium">Patch Name</StyledBody>
      <StyledInput
        data-cy="patch-name-input"
        value={description}
        size="large"
        onChange={setDescription}
      />
      <PageLayout>
        <PageSider>
          <MetadataCard error={null} title="Patch Metadata">
            <P2>Submitted by: {author}</P2>
            <P2>Submitted at: {time.submittedAt}</P2>
          </MetadataCard>
          <ConfigureBuildVariants
            variants={getVariantEntries(variants, selectedBuildVariantTasks)}
            aliases={[
              ...getPatchTriggerAliasEntries(
                patchTriggerAliases,
                selectedDownstreamPatches
              ),
              ...getChildPatchEntries(childPatches),
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
                  selectedDownstreamPatches={selectedDownstreamPatches}
                  setSelectedDownstreamPatches={setSelectedDownstreamPatches}
                  childPatches={childPatches}
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
  patchTriggerAliases: PatchTriggerAlias[],
  selectedDownstreamPatches: DownstreamPatchState
) => {
  if (!patchTriggerAliases) {
    return [];
  }
  return patchTriggerAliases.map(({ alias, childProject }) => ({
    displayName: `${alias} (${childProject})`,
    name: alias,
    taskCount: selectedDownstreamPatches[alias] ? 1 : 0,
  }));
};

const getChildPatchEntries = (childPatches: Partial<Patch>[]) => {
  if (!childPatches) {
    return [];
  }
  return childPatches.map(({ projectIdentifier, variantsTasks }) => ({
    displayName: projectIdentifier,
    name: projectIdentifier,
    taskCount: variantsTasks.reduce((c, v) => c + v.tasks.length, 0),
  }));
};

const getGqlVariantTasksParamFromState = (
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

const getGqlDownstreamPatchesFromState = (
  selectedDownstreamPatches: DownstreamPatchState
) =>
  Object.entries(selectedDownstreamPatches)
    .filter(([, isSelected]) => isSelected)
    .map(([alias]) => alias);

const StyledInput = styled(Input)`
  margin-bottom: 16px;
  font-weight: 600;
`;
const StyledBody = styled(Body)`
  margin-bottom: 4px;
`;
