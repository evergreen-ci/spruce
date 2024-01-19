import { useState } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import TextInput from "@leafygreen-ui/text-input";
import { size } from "constants/tokens";
import { CustomStoryObj, CustomMeta } from "test_utils/types";

import FilterBadges from ".";
import { FilterBadgeType } from "./FilterBadge";

export default {
  component: FilterBadges,
} satisfies CustomMeta<typeof FilterBadges>;

export const Default: CustomStoryObj<typeof FilterBadges> = {
  render: () => <BadgeContainer />,
};

const BadgeContainer = () => {
  const [badges, setBadges] = useState<FilterBadgeType[]>([
    { key: "test", value: "test" },
  ]);

  const addBadge = (key: string, value: string) => {
    setBadges([...badges, { key, value }]);
  };
  const removeBadge = (badge: FilterBadgeType) => {
    setBadges(
      badges.filter(
        (b) => (b.key !== badge.key && b.value !== badge.value) || false,
      ),
    );
  };
  const onClearAll = () => {
    setBadges([]);
  };

  return (
    <div>
      <FilterBadges
        badges={badges}
        onRemove={removeBadge}
        onClearAll={onClearAll}
      />
      <BadgeInput onAdd={addBadge} />
    </div>
  );
};

// Must use a separate input component to dynamically add badges
// Since leafygreen knobs rerender the component on every change
const BadgeInput = ({
  onAdd,
}: {
  onAdd: (key: string, value: string) => void;
}) => {
  const [badgeKey, setBadgeKey] = useState("");
  const [badgeValue, setBadgeValue] = useState("");

  const handleAdd = () => {
    onAdd(badgeKey, badgeValue);
    setBadgeKey("");
    setBadgeValue("");
  };
  return (
    <div>
      <TextInput
        placeholder="key"
        label="key"
        value={badgeKey}
        onChange={(e) => setBadgeKey(e.target.value)}
      />
      <TextInput
        placeholder="value"
        label="value"
        value={badgeValue}
        onChange={(e) => setBadgeValue(e.target.value)}
      />
      <StyledButton onClick={handleAdd}>Add</StyledButton>
    </div>
  );
};

const StyledButton = styled(Button)`
  margin-top: ${size.s};
`;
