import React from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Icon from "@leafygreen-ui/icon";
import { H2 } from "@leafygreen-ui/typography";
import Badge from "components/Badge";

export const Container = styled.div`
  margin-left: 60px;
  width: 100%;
`;

export const Title = styled(H2)``;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const BadgeWrapper = styled.div`
  display: flex;
`;

export const StyledBadge = styled(Badge)`
  margin-right: 10px;
  margin-left: 10px;
`;

export const PlusButton = ({
  children,
  ...props
}: React.ComponentProps<typeof Button>) => (
  <Button {...{ ...props, glyph: <Icon glyph="Plus" /> }}>{children}</Button>
);
