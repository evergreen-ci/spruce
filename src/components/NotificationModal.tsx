import React, { useState, useEffect } from "react";
import { Modal, Select, InputNumber, Input } from "antd";
import { uiColors } from "@leafygreen-ui/palette";
import { useMutation } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import { Button } from "components/Button";
import { H2, Body } from "@leafygreen-ui/typography";
import { SAVE_SUBSCRIPTION } from "gql/mutations/save-subscription";
import get from "lodash/get";
import {
  SaveSubscriptionMutation,
  SaveSubscriptionMutationVariables,
} from "gql/generated/types";
import { useBannerDispatchContext } from "context/banners";
import set from "lodash/set";
import { SubscriptionMethod } from "types/subscription";

const { Option } = Select;

interface ModalProps {
  visible: boolean;
  onCancel: () => void;
  subscriptionMethods: SubscriptionMethod[];
  subscriptionMethodControls: SubscriptionMethods;
  triggers: Trigger[];
  resourceType: ResourceType;
  resourceId: string;
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
  const [selectedSubscriptionMethod, setSelectedSubscriptionMethod] = useState(
    ""
  );
  const [target, setTarget] = useState<Target>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [extraFieldErrorMessages, setExtraFieldErrorMessages] = useState<
    string[]
  >([]);
  const [
    isVisibleExtraFieldErrorMessages,
    setIsVisibleExtraFieldErrorMessages,
  ] = useState(false);
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
  const [selectedTriggerId, setSelectedTriggerId] = useState<string>("");
  const [extraFieldInputVals, setExtraFieldInputVals] = useState<
    ExtraFieldInputVals
  >({});

  const { extraFields } =
    triggers.find(({ trigger }) => trigger === selectedTriggerId) ?? {};

  useEffect(() => {
    setExtraFieldInputVals(
      (extraFields ?? []).reduce(clearExtraFieldsInputCb, {})
    );
    setIsVisibleExtraFieldErrorMessages(false);
  }, [extraFields]);

  useEffect(() => {
    setTarget({});
  }, [selectedSubscriptionMethod]);

  useEffect(() => {
    setIsVisibleExtraFieldErrorMessages(false);
    if (!extraFields) {
      setExtraFieldErrorMessages([]);
    } else {
      const extraFieldInputValEntries = Object.entries(extraFieldInputVals);
      setExtraFieldErrorMessages(
        extraFieldInputValEntries
          .map(([fieldName, fieldVal]) => {
            const validator = get(
              extraFields.find(({ key }) => key === fieldName),
              "validator",
              () => ""
            );
            return validator(fieldVal);
          })
          .filter((v) => v)
      );
    }
  }, [extraFieldInputVals, extraFields, setExtraFieldErrorMessages]);

  useEffect(() => {
    const targetEntries = Object.entries(target);
    if (
      !targetEntries.length ||
      !selectedTriggerId ||
      !selectedSubscriptionMethod
    ) {
      setIsFormValid(false);
      return;
    }
    const isTargetValid = targetEntries.reduce(
      (accum, [tName, tVal]) =>
        accum && subscriptionMethodControls[tName].validator(tVal),
      true
    );
    setIsFormValid(isTargetValid);
  }, [
    subscriptionMethodControls,
    target,
    extraFieldInputVals,
    selectedTriggerId,
    selectedSubscriptionMethod,
  ]);

  const getRequestPayload = () => {
    const targetEntry = Object.entries(target)[0];
    return {
      trigger: selectedTriggerId,
      resource_type: resourceType,
      selectors: [
        { type: "object", data: resourceType.toLowerCase() },
        { type: "id", data: resourceId },
      ],
      subscriber: {
        type: targetEntry[0],
        target: targetEntry[1],
      },
      trigger_data: Object.entries(extraFieldInputVals).reduce(
        (accum, [key, val]) => ({ ...accum, [key]: `${val}` }),
        {}
      ),
      owner_type: "person",
      regex_selectors: [],
    };
  };

  const onClickSave = () =>
    saveSubscription({
      variables: { subscription: getRequestPayload() },
    });

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
          onClick={() => {
            if (extraFieldErrorMessages.length) {
              setIsVisibleExtraFieldErrorMessages(true);
            } else {
              onClickSave();
              onCancel();
            }
          }}
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
      {(extraFields ?? []).map(({ text, key }) => (
        <ExtraFieldContainer key={key}>
          <span>{text}</span>
          <StyledInputNumber
            data-test-id={`${key}-input-number`}
            type="number"
            value={extraFieldInputVals[key]}
            onChange={(n) => {
              setExtraFieldInputVals({
                ...extraFieldInputVals,
                [key]: n,
              });
            }}
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
        {isVisibleExtraFieldErrorMessages &&
          extraFieldErrorMessages.map((text) => (
            <span data-cy="error-message">
              <ErrorMessage>{text}</ErrorMessage>
            </span>
          ))}
      </div>
    </Modal>
  );
};

type ResourceType = "TASK" | "VERSION";
interface ExtraField {
  text: string;
  key: string;
  validator: (v: any) => string;
}

interface ExtraFieldInputVals {
  [index: string]: number;
}

export interface Trigger {
  trigger: string;
  label: string;
  extraFields?: ExtraField[];
}

interface Target {
  "jira-comment"?: string;
  email?: string;
  slack?: string;
}

export interface SubscriptionMethodControl {
  label: string;
  placeholder: string;
  targetPath: string;
  validator: (v: string) => boolean;
}

export interface SubscriptionMethods {
  "jira-comment": SubscriptionMethodControl;
  email: SubscriptionMethodControl;
  slack: SubscriptionMethodControl;
}

const clearExtraFieldsInputCb = (
  accum: ExtraFieldInputVals,
  eF: ExtraField
) => ({
  ...accum,
  [eF.key]: 10,
});

const StyledSelect = styled(Select)`
  width: 80%;
  margin-left: 8px;
  margin-bottom: 8px;
`;

const StyledInput = styled(Input)`
  margin-left: 8px;
  width: 50%;
`;

const StyledInputNumber = styled(InputNumber)`
  margin-left: 8px;
`;
const ExtraFieldContainer = styled.div`
  margin-bottom: 8px;
`;
const ErrorMessage = styled(Body)`
  color: ${uiColors.red.base};
`;
