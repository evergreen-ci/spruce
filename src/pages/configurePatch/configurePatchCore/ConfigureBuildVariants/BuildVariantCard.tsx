import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { palette } from "@leafygreen-ui/palette";
import { Body, Description } from "@leafygreen-ui/typography";
import { SiderCard } from "components/styles";
import { Divider } from "components/styles/divider";
import { size } from "constants/tokens";
import type { MenuItemProps } from "./types";

const { green } = palette;

interface BuildVariantCardProps {
  "data-cy": string;
  onClick: (variantName: string) => (e) => void;
  menuItems: MenuItemProps[];
  selectedMenuItems: string[];
  title: string;
}

const BuildVariantCard: React.FC<BuildVariantCardProps> = ({
  "data-cy": dataCy,
  menuItems,
  onClick,
  selectedMenuItems,
  title,
}) => (
  <StyledSiderCard>
    <Container>
      <Body weight="medium">{title}</Body>
      <Description>
        Use Shift + Click to edit multiple variants simultaneously.
      </Description>
      <Divider />
    </Container>
    <ScrollableBuildVariantContainer>
      {menuItems.map(({ displayName, name, taskCount }) => {
        const isSelected = selectedMenuItems.includes(name);
        return (
          <BuildVariant
            data-cy={dataCy}
            data-selected={isSelected}
            key={name}
            isSelected={isSelected}
            onClick={onClick(name)}
          >
            <VariantName>
              <Body weight={isSelected || taskCount > 0 ? "medium" : "regular"}>
                {displayName}
              </Body>
            </VariantName>
            {taskCount > 0 && (
              <StyledBadge
                data-cy="task-count-badge"
                variant={isSelected ? Variant.DarkGray : Variant.LightGray}
              >
                {taskCount}
              </StyledBadge>
            )}
          </BuildVariant>
        );
      })}
    </ScrollableBuildVariantContainer>
  </StyledSiderCard>
);

interface VariantProps {
  isSelected: boolean;
}

const cardSidePadding = css`
  padding-left: ${size.xs};
  padding-right: ${size.xs};
`;
const Container = styled.div`
  ${cardSidePadding}
`;
const StyledSiderCard = styled(SiderCard)`
  padding-left: 0px;
  padding-right: 0px;
`;
const BuildVariant = styled.div<VariantProps>`
  display: flex;
  align-items: center;
  min-height: ${size.l};
  cursor: pointer;
  padding: ${size.xs} 0;
  ${cardSidePadding}
  background-color: ${(props: VariantProps): string =>
    props.isSelected ? green.light3 : "none"};
  border-left: 3px solid white;
  border-left-color: ${(props: VariantProps): string =>
    props.isSelected ? green.base : "none"};
`;
const VariantName = styled.div`
  word-break: break-all;
  white-space: normal;
`;

const StyledBadge = styled(Badge)`
  margin-left: ${size.xs};
`;

const ScrollableBuildVariantContainer = styled.div`
  overflow: scroll;
  max-height: 60vh;

  // Styles to always show scrollbar
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: ${size.xs};
  }

  ::-webkit-scrollbar-thumb {
    border-radius: ${size.xxs};
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
`;

export default BuildVariantCard;
