import React from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Disclaimer } from "@leafygreen-ui/typography";
import { Pagination as AntPagination } from "antd";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";

interface Props {
  value: number;
  totalResults?: number;
  numPages?: number;
  onChange?: (i: number) => void;
  pageSize?: number;
  "data-cy"?: string;
  useLeafygreen?: boolean;
}

export const Pagination: React.VFC<Props> = ({
  value,
  totalResults,
  numPages,
  onChange,
  pageSize,
  "data-cy": dataCy,
  useLeafygreen = false,
}) => {
  const updateQueryParams = useUpdateURLQueryParams();
  const handleChange =
    onChange || ((p) => updateQueryParams({ page: `${p - 1}` }));

  const handlePrevClick = () => {
    updateQueryParams({ page: `${value - 1}` });
  };
  const handleNextClick = () => {
    updateQueryParams({ page: `${value + 1}` });
  };

  return useLeafygreen ? (
    <Container>
      <StyledButton
        disabled={value === 0}
        size="small"
        data-cy="prev-page-button"
        /* @ts-expect-error */
        onClick={handlePrevClick}
        leftGlyph={<Icon glyph="ChevronLeft" size="small" />}
      />
      <PageLabel>
        <Disclaimer>
          {value + 1} / {numPages}
        </Disclaimer>
      </PageLabel>
      <StyledButton
        disabled={value === numPages - 1}
        data-cy="next-page-button"
        size="small"
        /* @ts-expect-error */
        onClick={handleNextClick}
        leftGlyph={<Icon glyph="ChevronRight" size="small" />}
      />
    </Container>
  ) : (
    <AntPagination
      data-cy={dataCy}
      simple
      pageSize={pageSize}
      current={value + 1}
      total={totalResults}
      onChange={handleChange}
    />
  );
};

// @ts-expect-error
const StyledButton = styled(Button)`
  margin-right: ${size.xxs};
  margin-left: ${size.xxs};
`;

const PageLabel = styled.div`
  width: 48px;
  text-align: center;
`;

const Container = styled.div`
  align-self: flex-end;
  align-items: center;
  display: flex;
  flex-shrink: 0;
`;
