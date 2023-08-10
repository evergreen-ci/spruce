import { useState } from "react";
import Callout from "@leafygreen-ui/callout";
import { DisplayModal } from "components/DisplayModal";
import Icon from "components/Icon";
import {
  BannerContainer,
  TitleWrapper,
  OrderedList,
  ListItem,
  ModalTriggerText,
} from "../styles";

interface ErrorBannerProps {
  errors: string[];
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ errors }) => {
  const [showModal, setShowModal] = useState(false);

  const errorTitle =
    errors.length === 1
      ? "1 error in configuration file"
      : `${errors.length} errors in configuration file`;

  return (
    <BannerContainer data-cy="configuration-errors-banner">
      <Callout title={errorTitle} variant="warning">
        {errors[0]}
        {errors.length > 1 && (
          <>
            <br />
            <ModalTriggerText
              data-cy="configuration-errors-modal-trigger"
              onClick={() => setShowModal(true)}
            >
              See all errors
            </ModalTriggerText>
          </>
        )}
      </Callout>
      <DisplayModal
        data-cy="configuration-errors-modal"
        open={showModal}
        setOpen={setShowModal}
        title={
          <TitleWrapper>
            <Icon glyph="Warning" size="xlarge" />
            <span>{errorTitle}</span>
          </TitleWrapper>
        }
      >
        <OrderedList>
          {errors.map((e) => (
            <ListItem key={e}>{e}</ListItem>
          ))}
        </OrderedList>
      </DisplayModal>
    </BannerContainer>
  );
};

export default ErrorBanner;
