import Styled from "@emotion/styled";
import { size } from "constants/tokens";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import { TestStatus } from "types/test";
import TestStatusBadge from ".";

export default {
  component: TestStatusBadge,
} satisfies CustomMeta<typeof TestStatusBadge>;

export const Default: CustomStoryObj<typeof TestStatusBadge> = {
  render: (args) => (
    <Container>
      {Object.values(TestStatus).map((status) => (
        <TestStatusBadge {...args} status={status} key={status} />
      ))}
    </Container>
  ),
  argTypes: {},
  args: {},
};

const Container = Styled.div`
    display: flex;
    gap: ${size.s};
`;
