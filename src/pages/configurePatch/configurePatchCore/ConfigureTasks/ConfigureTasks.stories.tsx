import styled from "@emotion/styled";
import {
  Combobox,
  ComboboxOption,
  ComboboxGroup,
} from "@leafygreen-ui/combobox";
import { StoryObj } from "@storybook/react";
import {
  AliasState,
  ChildPatchAliased,
  useConfigurePatch,
} from "hooks/useConfigurePatch";
import ConfigureTasks from ".";
import { patchQuery } from "./testData";

export default {
  component: ConfigureTasks,
  title: "pages/configurePatch/configurePatchCore/ConfigureTasks",
  parameters: {
    reactRouter: {
      initialEntries: [`/patch/${patchQuery.patch.id}/configure`],
      path: "/patch/:patchId/configure/tasks",
      route: `/patch/${patchQuery.patch.id}/configure/tasks`,
    },
  },
};

export const ConfigureTasksDefault: StoryObj<typeof ConfigureTasks> = {
  render: (args) => <ConfigureTasksStory {...args} />,
  args: {
    activated: false,
    loading: false,
    onClickSchedule: () => {},
  },
};

const ConfigureTasksStory: React.VFC<
  React.ComponentProps<typeof ConfigureTasks>
> = ({ ...args }) => {
  const {
    selectedAliases,
    selectedBuildVariants,
    selectedBuildVariantTasks,
    setSelectedAliases,
    setSelectedBuildVariantTasks,
    setSelectedBuildVariants,
  } = useConfigurePatch(patchQuery.patch, patchQuery.patch.project.variants);

  const childPatchesWithAliases: ChildPatchAliased[] =
    patchQuery.patch.childPatches?.map((cp) => {
      const { alias = patchQuery.patch.id } =
        patchQuery.patch.childPatchAliases.find(
          ({ patchId }) => cp.id === patchId
        ) || {};
      return { ...cp, alias };
    }) ?? [];

  const selectedAliasesAsStringArray = Object.keys(selectedAliases);
  const setSelectedAliasesFromStrings = (aliases: string[]) => {
    const newAliases: AliasState = {};
    aliases.forEach((alias) => {
      newAliases[alias] = true;
    });
    setSelectedAliases(newAliases);
    setSelectedBuildVariants([...selectedBuildVariants, ...aliases]);
  };
  return (
    <>
      <ConfigureTasks
        selectedBuildVariants={selectedBuildVariants}
        selectedBuildVariantTasks={selectedBuildVariantTasks}
        setSelectedBuildVariantTasks={setSelectedBuildVariantTasks}
        selectedAliases={selectedAliases}
        setSelectedAliases={setSelectedAliases}
        selectableAliases={patchQuery.patch.patchTriggerAliases}
        childPatches={childPatchesWithAliases}
        {...args}
      />
      <ControlContainer>
        <ComboboxContainer>
          <Combobox
            data-cy="bv-selector"
            label="Build Variant Selector"
            placeholder="Select build variants"
            value={selectedBuildVariants}
            multiselect
            onChange={setSelectedBuildVariants}
            overflow="scroll-x"
          >
            {patchQuery.patch.project.variants?.map((bv) => (
              <ComboboxOption
                key={bv.name}
                value={bv.name}
                displayName={bv.displayName}
              />
            ))}
          </Combobox>
        </ComboboxContainer>
        <ComboboxContainer>
          <Combobox
            data-cy="alias-selector"
            label="Alias Selector"
            placeholder="Select Aliases"
            value={selectedAliasesAsStringArray}
            multiselect
            onChange={setSelectedAliasesFromStrings}
            overflow="scroll-x"
          >
            {patchQuery.patch.patchTriggerAliases.map((pta) => (
              <ComboboxGroup key={pta.alias} label={pta.alias}>
                {pta.variantsTasks.map((ptt) => (
                  <ComboboxOption key={ptt.name} value={ptt.name} />
                ))}
              </ComboboxGroup>
            ))}
          </Combobox>
        </ComboboxContainer>
      </ControlContainer>
    </>
  );
};

const ComboboxContainer = styled.div`
  width: 300px;
  margin-top: 50px;
`;

const ControlContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
