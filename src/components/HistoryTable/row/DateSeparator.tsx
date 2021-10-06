import { CSSProperties } from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { format, utcToZonedTime } from "date-fns-tz";
import { useUserTimeZone } from "hooks/useUserTimeZone";

const { gray } = uiColors;
interface DateSeparatorProps {
  style: CSSProperties;
  date: Date;
}

export const DateSeparator: React.FC<DateSeparatorProps> = ({
  style,
  date,
}) => {
  const tz = useUserTimeZone();
  return (
    <Container style={style}>
      <DateWrapper>
        {format(utcToZonedTime(new Date(date), tz), "MMM d")}
      </DateWrapper>
      <StyledHr />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding-right: 40px;
  display: flex;
  align-items: center;
`;

const StyledHr = styled.hr`
  width: 100%;
  border-top: 1px dashed ${gray.light1};
  border-color: ${gray.light1};
  border-style: dashed;
  border-width: 1 0 0 0;
`;

const DateWrapper = styled(Body)`
  white-space: nowrap;
  padding-right: 28px;
  text-transform: uppercase;
  color: ${gray.dark2};
`;
