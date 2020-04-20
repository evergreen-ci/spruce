import React from "react";
import styled from "@emotion/styled/macro";
import { css } from "@emotion/core";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { ProjectVariants } from "gql/queries/patch";
import { VariantTasksState } from "pages/configurePatch/ConfigurePatchCore";
import { MetadataCard } from "components/MetadataCard";

interface Props {
  variants: ProjectVariants;
  selectedVariantTasks: VariantTasksState;
  selectedBuildVariant: string;
  setSelectedBuildVariant: React.Dispatch<React.SetStateAction<string>>;
}

export const ConfigureBuildVariants: React.FC<Props> = ({
  variants,
  selectedVariantTasks,
  selectedBuildVariant,
  setSelectedBuildVariant,
}) => {
  const getClickVariantHandler = (variantName: string) => () =>
    setSelectedBuildVariant(variantName);
  return (
    <MetadataCard title="Select Build Variants and Tasks" error={null}>
      {variants.map(({ displayName, name }) => {
        const taskCount = selectedVariantTasks[name]
          ? Object.keys(selectedVariantTasks[name]).length
          : null;
        const isSelected = selectedBuildVariant === name;
        return (
          <BuildVariant
            key={name}
            isSelected={isSelected}
            onClick={getClickVariantHandler(name)}
          >
            <VariantName>
              <Body weight={isSelected ? "medium" : "regular"}>
                {displayName}
              </Body>
            </VariantName>
            {taskCount > 0 && (
              <StyledBadge
                variant={isSelected ? Variant.DarkGray : Variant.LightGray}
              >
                {taskCount}
              </StyledBadge>
            )}
          </BuildVariant>
        );
      })}
    </MetadataCard>
  );
};

type VariantProps = { isSelected: boolean };

export const cardSidePadding = css`
  padding-left: 8px;
  padding-right: 8px;
`;
const BuildVariant = styled.div`
  display: flex;
  align-items: center;
  min-height: 32px;
  cursor: pointer;
  padding: 8px 0;
  ${cardSidePadding}
  background-color: ${(props: VariantProps) =>
    props.isSelected ? uiColors.green.light3 : "none"};
  border-left: 3px solid white;
  border-left-color: ${(props: VariantProps) =>
    props.isSelected ? uiColors.green.base : "none"};
`;
const VariantName = styled.div`
  word-break: break-all;
  white-space: normal;
`;
const StyledBadge = styled(Badge)`
  margin-left: 8px;
`;
