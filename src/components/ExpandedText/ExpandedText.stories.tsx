import { CustomStoryObj, CustomMeta } from "test_utils/types";
import ExpandedText from ".";

export default {
  component: ExpandedText,
} satisfies CustomMeta<typeof ExpandedText>;

export const Default: CustomStoryObj<typeof ExpandedText> = {
  render: () => <ExpandedText message="Here is some hidden text" />,
};
