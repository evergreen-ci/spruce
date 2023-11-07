import styled from "@emotion/styled";
import TextInput from "components/TextInputWithValidation";
import { useUpsertQueryParams } from "hooks";
import { TestStatus } from "types/history";
import { validators } from "utils";

const { validateRegexp } = validators;

interface HistoryTableTestSearchProps {
  onSubmit?: () => void;
}

export const HistoryTableTestSearch: React.FC<HistoryTableTestSearchProps> = ({
  onSubmit = () => {},
}) => {
  const handleSubmit = useUpsertQueryParams();

  const handleOnSubmit = (input: string) => {
    onSubmit();
    handleSubmit({ category: TestStatus.Failed, value: input });
  };

  return (
    <ContentWrapper>
      <TextInput
        type="search"
        label="Filter by Failed Tests"
        aria-label="history-table-test-search-input"
        placeholder="Search test name regex"
        validatorErrorMessage="Invalid regular expression"
        onSubmit={handleOnSubmit}
        validator={validateRegexp}
        clearOnSubmit
      />
    </ContentWrapper>
  );
};

const ContentWrapper = styled.div`
  width: 40%;
  min-width: 200px; //temporary
  margin-right: 30px;
  position: relative;
`;
