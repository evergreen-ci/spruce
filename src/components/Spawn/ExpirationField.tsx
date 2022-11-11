import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import Tooltip from "@leafygreen-ui/tooltip";
import { Body } from "@leafygreen-ui/typography";
import { set } from "date-fns";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import DatePicker from "components/DatePicker";
import TimePicker from "components/TimePicker";
import { size, zIndex } from "constants/tokens";
import { useDisableSpawnExpirationCheckbox, useSpruceConfig } from "hooks";
import { MyHost, MyVolume } from "types/spawn";
import { SectionContainer, SectionLabel } from "./Layout";
import { getNoExpirationCheckboxTooltipCopy } from "./utils";

export interface ExpirationDateType {
  expiration?: Date;
  noExpiration?: boolean;
}

interface ExpirationFieldProps {
  data: ExpirationDateType;
  onChange: (data: ExpirationDateType) => void;
  isVolume: boolean;
  targetItem?: MyHost | MyVolume;
}

export const ExpirationField: React.VFC<ExpirationFieldProps> = ({
  onChange,
  data,
  isVolume,
  targetItem,
}) => {
  const spruceConfig = useSpruceConfig();
  const disableExpirationCheckbox = useDisableSpawnExpirationCheckbox(
    isVolume,
    targetItem
  );
  const { expiration: expirationString, noExpiration } = data;
  const expiration = expirationString ? new Date(expirationString) : new Date();
  const updateDate = (d: Date) => {
    const year = d.getFullYear();
    const month = d.getMonth();
    const date = d.getDate();
    const updatedTime = set(expiration || new Date(), { year, month, date });
    onChange({ noExpiration, expiration: updatedTime });
  };

  const updateTime = (d: Date) => {
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const seconds = d.getSeconds();
    const updatedTime = set(expiration || new Date(), {
      hours,
      minutes,
      seconds,
    });
    onChange({ noExpiration, expiration: updatedTime });
  };

  const disabledDate = (current) => current < Date.now();
  const { unexpirableHostsPerUser, unexpirableVolumesPerUser } =
    spruceConfig?.spawnHost ?? {};
  return (
    <SectionContainer>
      <SectionLabel weight="medium">Expiration</SectionLabel>
      <FormContainer>
        <DatePicker
          label="Date"
          data-cy="date-picker"
          onChange={updateDate}
          disabled={noExpiration}
          disabledDate={disabledDate}
          value={expiration}
          allowClear={false}
        />
        <TimePicker
          data-cy="time-picker"
          label="Time"
          onChange={updateTime}
          disabled={noExpiration}
          disabledDate={disabledDate}
          value={expiration}
          allowClear={false}
        />
        <RowWrapper>
          <Body>or</Body>
        </RowWrapper>
        <RowWrapper>
          <ConditionalWrapper
            condition={disableExpirationCheckbox}
            wrapper={(children) => (
              <Tooltip
                justify="middle"
                popoverZIndex={zIndex.tooltip}
                triggerEvent="hover"
                trigger={children}
              >
                {getNoExpirationCheckboxTooltipCopy({
                  disableExpirationCheckbox,
                  isVolume,
                  limit: isVolume
                    ? unexpirableVolumesPerUser
                    : unexpirableHostsPerUser,
                })}
              </Tooltip>
            )}
          >
            <span>
              <Checkbox
                data-cy="never-expire-checkbox"
                disabled={disableExpirationCheckbox}
                label="Never"
                checked={noExpiration}
                onChange={(e) =>
                  onChange({ noExpiration: e.target.checked, expiration })
                }
              />
            </span>
          </ConditionalWrapper>
        </RowWrapper>
      </FormContainer>
    </SectionContainer>
  );
};

const FormContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${size.xs};
`;

const RowWrapper = styled.div`
  margin-top: ${size.m};
`;
