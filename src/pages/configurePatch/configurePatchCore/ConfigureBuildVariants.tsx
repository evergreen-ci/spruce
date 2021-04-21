import React, { useEffect, useMemo, useReducer } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled/macro";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { SiderCard } from "components/styles";
import { Divider } from "components/styles/Divider";
import { ProjectBuildVariant } from "gql/generated/types";
import { VariantTasksState } from "pages/configurePatch/ConfigurePatchCore";
import { array } from "utils";

const { toggleArray } = array;
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
  const [state, dispatch] = useReducer(reducer, { numButtonsPressed: 0 });
  const keyDownCb = useMemo(
    () => (e: KeyboardEvent) => {
      if (hotKeys.has(e.key)) {
        dispatch({ type: "increment" });
      }
    },
    [dispatch]
  );
  const keyUpCb = useMemo(
    () => (e: KeyboardEvent) => {
      if (hotKeys.has(e.key)) {
        dispatch({ type: "decrement" });
      }
    },
    [dispatch]
  );
  useEffect(() => {
    window.addEventListener("keydown", keyDownCb);
    window.addEventListener("keyup", keyUpCb);
    return () => {
      window.removeEventListener("keyDown", keyDownCb);
      window.removeEventListener("keyup", keyUpCb);
    };
  }, [keyUpCb, keyDownCb]);
  const getClickVariantHandler = (variantName: string) => (e): void => {
    if (e.ctrlKey || e.metaKey) {
      const updatedBuildVariants = toggleArray(variantName, [
        ...selectedBuildVariant,
      ]);
      setSelectedBuildVariant(
        updatedBuildVariants.length > 0 ? updatedBuildVariants : [variantName]
      );
    } else if (e.shiftKey) {
      const variantNames = variants.map(({ name }) => name);
      const clickIndex = variantNames.indexOf(variantName);
      const anchorIndex = variants.reduce(
        (accum, { name }, index) =>
          accum > -1 || !selectedBuildVariant.includes(name) ? accum : index,
        -1
      );
      if (clickIndex === anchorIndex) {
        return;
      }
      const startIndex = anchorIndex < clickIndex ? anchorIndex : clickIndex;
      const endIndex = anchorIndex < clickIndex ? clickIndex : anchorIndex;
      const nextSelectedBuildVariants = Array.from(
        new Set([
          ...variantNames.slice(startIndex, endIndex + 1),
          ...selectedBuildVariant,
        ])
      );
      setSelectedBuildVariant(nextSelectedBuildVariants);
    } else {
      setSelectedBuildVariant([variantName]);
    }
  };
  return (
    <UserSelectWrapper isHotKeyPressed={state.numButtonsPressed !== 0}>
      {/* @ts-expect-error */}
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
    </UserSelectWrapper>
  );
};

const hotKeys = new Set(["Meta", "Shift", "Control"]);
interface State {
  numButtonsPressed: number;
}
type Action = { type: "increment" } | { type: "decrement" };
const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "increment":
      return {
        numButtonsPressed: state.numButtonsPressed + 1,
      };
    case "decrement":
      return {
        numButtonsPressed: state.numButtonsPressed - 1,
      };
    default:
      throw new Error();
  }
};

interface VariantProps {
  isSelected: boolean;
}
interface UserSelectWrapperProps {
  isHotKeyPressed: boolean;
}

export const cardSidePadding = css`
  padding-left: 8px;
  padding-right: 8px;
`;
const Container = styled.div`
  ${cardSidePadding}
`;
const UserSelectWrapper = styled.span<UserSelectWrapperProps>`
  ${(props: UserSelectWrapperProps): string =>
    props.isHotKeyPressed && "user-select: none;"}
`;
const StyledSiderCard = styled(SiderCard)`
  padding-left: 0px;
  padding-right: 0px;
`;
const BuildVariant = styled.div<VariantProps>`
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
