import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { Tooltip } from "antd";
import { set } from "date-fns";
import DatePicker from "components/DatePicker";
import { InputLabel } from "components/styles";
import TimePicker from "components/TimePicker";
import { size } from "constants/tokens";
import { useDisableSpawnExpirationCheckbox, useSpruceConfig } from "hooks";
import { MyHost, MyVolume } from "types/spawn";
import { SectionContainer, SectionLabel } from "./Layout";

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
        <FlexColumnContainer>
          <InputLabel htmlFor="hostDetailsDatePicker">Date</InputLabel>
          <DatePicker
            id="hostDetailsDatePicker"
            data-cy="date-picker"
            onChange={updateDate}
            disabled={noExpiration}
            disabledDate={disabledDate}
            value={expiration}
            allowClear={false}
          />
        </FlexColumnContainer>
        <PaddedBody>&amp;</PaddedBody>
        <FlexColumnContainer>
          <InputLabel htmlFor="hostDetailsTimePicker">Time</InputLabel>
          <TimePicker
            data-cy="time-picker"
            onChange={updateTime}
            disabled={noExpiration}
            disabledDate={disabledDate}
            value={expiration}
            allowClear={false}
          />
        </FlexColumnContainer>
        <PaddedBody> or </PaddedBody>
        <FlexColumnContainer>
          <Tooltip
            title={
              disableExpirationCheckbox
                ? `You have reached the max number of unexpirable ${
                    isVolume
                      ? `volumes (${unexpirableVolumesPerUser})`
                      : `hosts (${unexpirableHostsPerUser})`
                  }. Toggle an existing ${
                    isVolume ? "volume" : "host"
                  } to expirable to enable this checkbox.`
                : undefined
            }
          >
            <span>
              <PaddedCheckbox
                data-cy="neverExpireCheckbox"
                disabled={disableExpirationCheckbox}
                label="Never"
                checked={noExpiration}
                onChange={(e) =>
                  onChange({ noExpiration: e.target.checked, expiration })
                }
              />
            </span>
          </Tooltip>
        </FlexColumnContainer>
      </FormContainer>
    </SectionContainer>
  );
};

const FlexColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const PaddedBody = styled.span`
  padding: 0 ${size.s};
  margin-top: ${size.m};
`;

// @ts-ignore
const PaddedCheckbox = styled(Checkbox)`
  margin-top: ${size.m};
` as typeof Checkbox;
