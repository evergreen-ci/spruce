import { CharKey } from "constants/keys";
import useKeyboardShortcut from "hooks/useKeyboardShortcut";

interface Props {
  setSelectedTab: (n: number) => void;
  currentTab: number;
  numTabs: number;
}

export const useTabShortcut = ({
  currentTab,
  numTabs,
  setSelectedTab,
}: Props) => {
  useKeyboardShortcut({ charKey: CharKey.J }, () => {
    const nextTab = currentTab + 1 < numTabs ? currentTab + 1 : 0;
    setSelectedTab(nextTab);
  });

  useKeyboardShortcut({ charKey: CharKey.K }, () => {
    const previousTab = currentTab - 1 >= 0 ? currentTab - 1 : numTabs - 1;
    setSelectedTab(previousTab);
  });
};
