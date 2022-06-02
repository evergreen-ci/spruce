import { Body } from "@leafygreen-ui/typography";
import { Select } from "antd";
import get from "lodash/get";
import set from "lodash/set";
import { ErrorMessage, InputLabel } from "components/styles";
import {
  SubscriptionMethodControl,
  SubscriptionMethods,
  Target,
} from "hooks/useNotificationModal";
import { SubscriptionMethodDropdownOption } from "types/subscription";
import { SectionLabelContainer, StyledInput, StyledSelect } from "./styles";

const { Option } = Select;

interface NotificationMethodProps {
  selectedSubscriptionMethod: string;
  setSelectedSubscriptionMethod: (v: string) => void;
  subscriptionMethodDropdownOptions: SubscriptionMethodDropdownOption[];
  subscriptionMethodControls: SubscriptionMethods;
  target: Target;
  setTarget: (value: React.SetStateAction<Target>) => void;
  extraFieldErrorMessages: string[];
}

export const NotificationMethod: React.VFC<NotificationMethodProps> = ({
  selectedSubscriptionMethod,
  setSelectedSubscriptionMethod,
  subscriptionMethodDropdownOptions,
  subscriptionMethodControls,
  target,
  setTarget,
  extraFieldErrorMessages,
}) => {
  const currentMethodControl = subscriptionMethodControls[
    selectedSubscriptionMethod
  ] as SubscriptionMethodControl;
  const label = get(currentMethodControl, "label");
  const placeholder = get(currentMethodControl, "placeholder");
  const targetPath = get(currentMethodControl, "targetPath");

  return (
    <>
      <div>
        <Body weight="medium">Choose how to be notified</Body>
        <SectionLabelContainer>
          <InputLabel htmlFor="notify-by-select">
            Notification method
          </InputLabel>
        </SectionLabelContainer>
        <StyledSelect
          id="notify-by-select"
          data-cy="notify-by-select"
          value={selectedSubscriptionMethod}
          onChange={(v: string) => {
            setSelectedSubscriptionMethod(v);
          }}
        >
          {subscriptionMethodDropdownOptions.map((s) => (
            <Option key={s.value} value={s.value} data-cy={`${s.value}-option`}>
              {s.label}
            </Option>
          ))}
        </StyledSelect>
      </div>
      <div>
        {currentMethodControl && (
          <>
            <SectionLabelContainer>
              <InputLabel htmlFor="target">{label}</InputLabel>
            </SectionLabelContainer>
            <StyledInput
              id="target"
              placeholder={placeholder}
              data-cy={`${targetPath}-input`}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const targetCopy = { ...target };
                set(targetCopy, targetPath, event.target.value);
                setTarget(targetCopy);
              }}
              value={get(target, targetPath, "")}
            />
          </>
        )}
      </div>
      <div>
        {extraFieldErrorMessages.map((text) => (
          <span key={`field_error_${text}`} data-cy="error-message">
            <ErrorMessage>{text}</ErrorMessage>
          </span>
        ))}
      </div>
    </>
  );
};
