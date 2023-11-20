import { useState } from "react";
import { ButtonDropdown } from "components/ButtonDropdown";
import { AddNotification } from "./AddNotification";
import { GitCommitSearch } from "./GitCommitSearch";

export const WaterfallMenu: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const dropdownItems = [
    <AddNotification key="add-notification" setMenuOpen={setMenuOpen} />,
    <GitCommitSearch key="git-commit-search" setMenuOpen={setMenuOpen} />,
  ];

  return (
    <ButtonDropdown
      data-cy="waterfall-menu"
      dropdownItems={dropdownItems}
      size="default"
      open={menuOpen}
      setOpen={setMenuOpen}
    />
  );
};
