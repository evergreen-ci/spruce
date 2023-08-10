import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";
import { useDateFormat } from "hooks";
import { DashedLine } from "../styles";

const { gray } = palette;
interface DateSeparatorProps {
  date: Date;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
  const getDateCopy = useDateFormat();
  return (
    <Container>
      <DateWrapper>{getDateCopy(date, { dateOnly: true })}</DateWrapper>
      <DashedLine />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding-right: ${size.l};
  display: flex;
  align-items: center;
`;

const DateWrapper = styled(Body)<BodyProps>`
  white-space: nowrap;
  padding-right: ${size.m};
  text-transform: uppercase;
  color: ${gray.dark2};
`;

export default DateSeparator;
