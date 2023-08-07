import { useState } from "react";
import Banner from "@leafygreen-ui/banner";
import { DisplayModal } from "components/DisplayModal";
import Icon from "components/Icon";
import {
  BannerContainer,
  TitleWrapper,
  OrderedList,
  ListItem,
  ModalTriggerText,
} from "../styles";

interface WarningBannerProps {
  warnings: string[];
}

const WarningBanner: React.FC<WarningBannerProps> = ({ warnings }) => {
  const [showModal, setShowModal] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const warningTitle =
    warnings.length === 1
      ? "1 warning in configuration file"
      : `${warnings.length} warnings in configuration file`;

  return showBanner ? (
    <BannerContainer data-cy="configuration-warnings-banner">
      <Banner
        dismissible
        onClose={() => setShowBanner(false)}
        variant="warning"
      >
        <b>{warningTitle}</b>
        <br />
        <span>
          See all warnings{" "}
          <ModalTriggerText
            data-cy="configuration-warnings-modal-trigger"
            onClick={() => setShowModal(true)}
          >
            here
          </ModalTriggerText>
        </span>
      </Banner>
      <DisplayModal
        data-cy="configuration-warnings-modal"
        open={showModal}
        setOpen={setShowModal}
        title={
          <TitleWrapper>
            <Icon glyph="ImportantWithCircle" size="xlarge" />
            <span>{warningTitle}</span>
          </TitleWrapper>
        }
      >
        <OrderedList>
          {warnings.map((w) => (
            <ListItem key={w}>{w}</ListItem>
          ))}
        </OrderedList>
      </DisplayModal>
    </BannerContainer>
  ) : null;
};

export default WarningBanner;
