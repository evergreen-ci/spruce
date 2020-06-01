import React from "react";
import { Modal, Select, Input } from "antd";
import { uiColors } from "@leafygreen-ui/palette";
import styled from "@emotion/styled";
import { Button } from "components/Button";
import { H2, Body } from "@leafygreen-ui/typography";
import get from "lodash/get";
import set from "lodash/set";
import TextInput from "@leafygreen-ui/text-input";
import { SubscriptionMethod } from "types/subscription";
import { v4 as uuid } from "uuid";
import { useBannerDispatchContext } from "context/banners";
import {
  useNotificationModal,
  UseNotificationModalProps,
} from "hooks/useNotificationModal";
import { useMutation } from "@apollo/react-hooks";
import {
  SaveSubscriptionMutation,
  SaveSubscriptionMutationVariables,
} from "gql/generated/types";
import { SAVE_SUBSCRIPTION } from "gql/mutations/save-subscription";

const { Option } = Select;

interface ModalProps extends UseNotificationModalProps {
  visible: boolean;
  subscriptionMethods: SubscriptionMethod[];
  onCancel: () => void;
}

export const NotificationModal: React.FC<ModalProps> = ({
  visible,
  onCancel,
  subscriptionMethods,
  subscriptionMethodControls,
  triggers,
  resourceId,
  resourceType,
}) => {
  const dispatchBanner = useBannerDispatchContext();
  const [saveSubscription, { loading: mutationLoading }] = useMutation<
    SaveSubscriptionMutation,
    SaveSubscriptionMutationVariables
  >(SAVE_SUBSCRIPTION, {
    onCompleted: () => {
      dispatchBanner.successBanner("Your subscription has been added");
    },
    onError: (err) => {
      dispatchBanner.errorBanner(
        `Error adding your subscription: '${err.message}'`
      );
      // TODO: save error
    },
  });
  const {
    selectedSubscriptionMethod,
    isFormValid,
    selectedTriggerId,
    setSelectedTriggerId,
    extraFields,
    extraFieldInputVals,
    setExtraFieldInputVals,
    setSelectedSubscriptionMethod,
    target,
    setTarget,
    extraFieldErrorMessages,
    getRequestPayload,
  } = useNotificationModal({
    subscriptionMethodControls,
    triggers,
    resourceType,
    resourceId,
  });

  const onClickSave = () => {
    saveSubscription({
      variables: { subscription: getRequestPayload() },
    });
    onCancel();
  };

  const currentMethodControl = subscriptionMethodControls[
    selectedSubscriptionMethod
  ] as SubscriptionMethodControl;
  const label = get(currentMethodControl, "label");
  const placeholder = get(currentMethodControl, "placeholder");
  const targetPath = get(currentMethodControl, "targetPath");

  return (
    <Modal
      data-test-id="subscription-modal"
      title={<H2>Add Subscription</H2>}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button
          key="cancel"
          onClick={onCancel}
          dataCy="cancel-subscription-button"
        >
          Cancel
        </Button>,
        <Button
          key="save"
          dataCy="save-subscription-button"
          loading={mutationLoading}
          disabled={!isFormValid}
          onClick={onClickSave}
          variant="danger"
        >
          Save
        </Button>,
      ]}
      width="50%"
      wrapProps={{
        "data-cy": "task-notification-modal",
      }}
    >
      <>
        when
        <StyledSelect
          value={selectedTriggerId}
          onChange={(v: string) => {
            setSelectedTriggerId(v);
          }}
          data-test-id="when-select"
        >
          {triggers.map((t) => (
            <Option
              key={t.trigger}
              value={t.trigger}
              data-test-id={`${t.trigger}-option`}
            >
              {t.label}
            </Option>
          ))}
        </StyledSelect>
      </>
      {extraFields &&
        extraFields.map(({ text, key }) => (
          <ExtraFieldContainer key={key}>
            <TextInput
              label=" "
              data-cy={`${key}-input`}
              description={text}
              onChange={(event) => {
                setExtraFieldInputVals({
                  ...extraFieldInputVals,
                  [key]: event.target.value,
                });
              }}
              value={extraFieldInputVals[key]}
            />
          </ExtraFieldContainer>
        ))}
      <div>
        then notify by:
        <StyledSelect
          data-test-id="notify-by-select"
          value={selectedSubscriptionMethod}
          onChange={(v: string) => {
            setSelectedSubscriptionMethod(v);
          }}
        >
          {subscriptionMethods.map((s) => (
            <Option
              key={s.value}
              value={s.value}
              data-test-id={`${s.value}-option`}
            >
              {s.label}
            </Option>
          ))}
        </StyledSelect>
      </div>
      <div>
        {currentMethodControl && (
          <>
            {label}
            <StyledInput
              placeholder={placeholder}
              data-test-id={`${targetPath}-input`}
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
          <span key={uuid()} data-cy="error-message">
            <ErrorMessage>{text}</ErrorMessage>
          </span>
        ))}
      </div>
    </Modal>
  );
};
export interface SubscriptionMethodControl {
  label: string;
  placeholder: string;
  targetPath: string;
  validator: (v: string) => boolean;
}

const StyledSelect = styled(Select)`
  width: 80%;
  margin-left: 8px;
  margin-bottom: 8px;
`;

const StyledInput = styled(Input)`
  margin-left: 8px;
  width: 50%;
`;

const ExtraFieldContainer = styled.div`
  margin-bottom: 8px;
`;
const ErrorMessage = styled(Body)`
  color: ${uiColors.red.base};
`;
