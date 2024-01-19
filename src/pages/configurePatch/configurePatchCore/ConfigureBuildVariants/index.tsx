import { useEffect, useMemo, useReducer } from "react";
import styled from "@emotion/styled";
import { inactiveElementStyle } from "components/styles";
import { array } from "utils";
import BuildVariantCard from "./BuildVariantCard";
import { buttonPressedReducer } from "./state";
import { MenuItemProps } from "./types";

const { toggleArray } = array;

interface Props {
  variants: MenuItemProps[];
  aliases?: MenuItemProps[];
  selectedBuildVariants: string[];
  setSelectedBuildVariants: (bv: string[]) => void;
  disabled: boolean;
}

export const ConfigureBuildVariants: React.FC<Props> = ({
  aliases,
  disabled,
  selectedBuildVariants,
  setSelectedBuildVariants,
  variants,
}) => {
  const [state, dispatch] = useReducer(buttonPressedReducer, {
    numButtonsPressed: 0,
  });
  const keyDownCb = useMemo(
    () => (e: KeyboardEvent) => {
      if (hotKeys.has(e.key)) {
        dispatch({ type: "increment" });
      }
    },
    [dispatch],
  );
  const keyUpCb = useMemo(
    () => (e: KeyboardEvent) => {
      if (hotKeys.has(e.key)) {
        dispatch({ type: "decrement" });
      }
    },
    [dispatch],
  );
  useEffect(() => {
    window.addEventListener("keydown", keyDownCb);
    window.addEventListener("keyup", keyUpCb);
    return () => {
      window.removeEventListener("keyDown", keyDownCb);
      window.removeEventListener("keyup", keyUpCb);
    };
  }, [keyUpCb, keyDownCb]);
  const getClickVariantHandler =
    (variantName: string) =>
    (e: React.MouseEvent): void => {
      if (e.ctrlKey || e.metaKey) {
        const updatedBuildVariants = toggleArray(variantName, [
          ...selectedBuildVariants,
        ]);
        setSelectedBuildVariants(
          updatedBuildVariants.length > 0
            ? updatedBuildVariants
            : [variantName],
        );
      } else if (e.shiftKey) {
        const variantNames = variants.map(({ name }) => name);
        const clickIndex = variantNames.indexOf(variantName);
        const anchorIndex = variants.reduce(
          (accum, { name }, index) =>
            accum > -1 || !selectedBuildVariants.includes(name) ? accum : index,
          -1,
        );
        if (clickIndex === anchorIndex) {
          return;
        }
        const startIndex = anchorIndex < clickIndex ? anchorIndex : clickIndex;
        const endIndex = anchorIndex < clickIndex ? clickIndex : anchorIndex;
        const nextSelectedBuildVariants = Array.from(
          new Set([
            ...variantNames.slice(startIndex, endIndex + 1),
            ...selectedBuildVariants,
          ]),
        );
        setSelectedBuildVariants(nextSelectedBuildVariants);
      } else {
        setSelectedBuildVariants([variantName]);
      }
    };
  return (
    <DisableWrapper data-cy="build-variant-select-wrapper" disabled={disabled}>
      <UserSelectWrapper isHotKeyPressed={state.numButtonsPressed !== 0}>
        <BuildVariantCard
          onClick={getClickVariantHandler}
          menuItems={variants}
          title="Select Build Variants and Tasks"
          selectedMenuItems={selectedBuildVariants}
          data-cy="build-variant-list-item"
        />
        {aliases?.length > 0 && (
          <BuildVariantCard
            onClick={getClickVariantHandler}
            menuItems={aliases}
            title="Select Downstream Tasks"
            selectedMenuItems={selectedBuildVariants}
            data-cy="trigger-alias-list-item"
          />
        )}
      </UserSelectWrapper>
    </DisableWrapper>
  );
};

const hotKeys = new Set(["Meta", "Shift", "Control"]);

interface UserSelectWrapperProps {
  isHotKeyPressed: boolean;
}

const UserSelectWrapper = styled.span<UserSelectWrapperProps>`
  ${(props: UserSelectWrapperProps): string =>
    props.isHotKeyPressed && "user-select: none;"}
`;

const DisableWrapper = styled.div`
  ${(props: { disabled: boolean }) => props.disabled && inactiveElementStyle}
`;
