import React from "react";
import styled from "@emotion/styled/macro";
import { css } from "@emotion/core";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { ProjectBuildVariant } from "gql/generated/types";
import { VariantTasksState } from "pages/configurePatch/ConfigurePatchCore";
import { SiderCard } from "components/styles";
import { Divider } from "components/styles/Divider";
import { toggleArray } from "utils/array";

interface Props {
  variants: ProjectBuildVariant[];
  selectedVariantTasks: VariantTasksState;
  selectedBuildVariant: string[];
  setSelectedBuildVariant: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ConfigureBuildVariants: React.FC<Props> = ({
  variants,
  selectedVariantTasks,
  selectedBuildVariant,
  setSelectedBuildVariant,
}) => {
  const getClickVariantHandler = (variantName: string) => (e): void => {
    if (e.ctrlKey || e.metaKey || e.shiftKey) {
      const updatedBuildVariants = toggleArray(variantName, [
        ...selectedBuildVariant,
      ]);
      setSelectedBuildVariant(
        updatedBuildVariants.length > 0 ? updatedBuildVariants : [variantName]
      );
    } else {
      setSelectedBuildVariant([variantName]);
    }
  };
  return (
    <StyledSiderCard>
      <Container>
        <Body weight="medium">Select Build Variants and Tasks</Body>
        <Divider />
      </Container>
      {variants.map(({ displayName, name }) => {
        const taskCount = selectedVariantTasks[name]
          ? Object.values(selectedVariantTasks[name]).filter((v) => v).length
          : null;
        const isSelected = selectedBuildVariant.includes(name);
        return (
          <BuildVariant
            data-cy="configurePatch-buildVariantListItem"
            data-cy-name={name}
            data-cy-selected={isSelected}
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
                data-cy={`configurePatch-taskCountBadge-${name}`}
                variant={isSelected ? Variant.DarkGray : Variant.LightGray}
              >
                {taskCount}
              </StyledBadge>
            )}
          </BuildVariant>
        );
      })}
    </StyledSiderCard>
  );
};

interface VariantProps {
  isSelected: boolean;
}

export const cardSidePadding = css`
  padding-left: 8px;
  padding-right: 8px;
`;
const Container = styled.div`
  ${cardSidePadding}
`;
const StyledSiderCard = styled(SiderCard)`
  padding-left: 0px;
  padding-right: 0px;
`;
const BuildVariant = styled.div`
  display: flex;
  align-items: center;
  min-height: 32px;
  cursor: pointer;
  padding: 8px 0;
  ${cardSidePadding}
  background-color: ${(props: VariantProps): string =>
    props.isSelected ? uiColors.green.light3 : "none"};
  border-left: 3px solid white;
  border-left-color: ${(props: VariantProps): string =>
    props.isSelected ? uiColors.green.base : "none"};
`;
const VariantName = styled.div`
  word-break: break-all;
  white-space: normal;
`;
const StyledBadge = styled(Badge)`
  margin-left: 8px;
`;
