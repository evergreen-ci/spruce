import { useState } from "react";
import Banner from "@leafygreen-ui/banner";
import { DisplayModal } from "components/DisplayModal";
import Icon from "components/Icon";
import {
  BannerContainer,
  TitleWrapper,
  OrderedList,
  ListItem,
  ModalTrigger,
} from "../styles";

interface WarningBannerProps {
  warnings: string[];
}

const WarningBanner: React.VFC<WarningBannerProps> = ({ warnings }) => {
  const [showWarningModal, setShowWarningModal] = useState(false);

  const warningTitle =
    warnings.length === 1
      ? "1 warning in configuration file"
      : `${warnings.length} warnings in configuration file`;

  return (
    <BannerContainer data-cy="configuration-warnings-banner">
      <Banner variant="warning">
        <b>{warningTitle}</b>
        <br />
        <span>
          See all warnings{" "}
          <ModalTrigger
            data-cy="configuration-warnings-modal-trigger"
            onClick={() => setShowWarningModal(true)}
          >
            here
          </ModalTrigger>
        </span>
      </Banner>
      <DisplayModal
        data-cy="configuration-warnings-modal"
        open={showWarningModal}
        setOpen={setShowWarningModal}
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
  );
};

export default WarningBanner;
