import { ButtonDropdown } from "components/ButtonDropdown";
import { AddNotification } from "./AddNotification";

export const WaterfallMenu: React.VFC = () => {
  const dropdownItems = [<AddNotification key="add-notification" />];

  return (
    <ButtonDropdown
      data-cy="waterfall-menu"
      dropdownItems={dropdownItems}
      size="default"
    />
  );
};
