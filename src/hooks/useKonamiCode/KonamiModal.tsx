import { useState } from "react";
import { css } from "@emotion/react";
import MarketingModal from "@leafygreen-ui/marketing-modal";
import { InlineKeyCode } from "@leafygreen-ui/typography";
import Cookies from "js-cookie";
import { zIndex } from "constants/tokens";
import useKonamiCode from ".";
import graphic from "./EvergreenKonami.png";

const KonamiModal = () => {
  const [open, setOpen] = useState(Cookies.get("konami") !== "true");
  useKonamiCode();
  const keys = ["↑", "↑", "↓", "↓", "←", "→", "←", "→", "b", "a"];
  return (
    <MarketingModal
      buttonText="Dismiss"
      closeIconColor="default"
      graphicStyle="center"
      open={open}
      size="default"
      title="New Evergreen Feature!"
      graphic={<img src={graphic} alt="Evergreen Konami Code" />}
      linkText=""
      onButtonClick={() => {
        setOpen(false);
        Cookies.set("konami", "true", { expires: 365 });
      }}
      css={css`
        z-index: ${zIndex.modal};
      `}
    >
      <div>Tired of looking at all of these failures? Try the Konami Code!</div>
      <div>
        {keys.map((key) => (
          <>
            <InlineKeyCode key={key}>{key.toUpperCase()}</InlineKeyCode>{" "}
          </>
        ))}
      </div>
    </MarketingModal>
  );
};

export default KonamiModal;
