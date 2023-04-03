import { InlineKeyCode } from "@leafygreen-ui/typography";
import { StoryObj } from "@storybook/react";
import Cookies from "js-cookie";
import { SEEN_KONAMI_CODE } from "constants/cookies";
import WithToastContext from "test_utils/toast-decorator";
import KonamiModal from "./KonamiModal";

export default {
  component: KonamiModal,
  parameters: {
    storyshots: {
      disable: true,
    },
  },
  decorators: [(Story: () => JSX.Element) => WithToastContext(Story)],
};

export const Default: StoryObj<typeof KonamiModal> = {
  render: () => {
    Cookies.remove(SEEN_KONAMI_CODE);
    const keys = ["↑", "↑", "↓", "↓", "←", "→", "←", "→", "b", "a"];

    return (
      <>
        <KonamiModal />
        {keys.map((key) => (
          <>
            <InlineKeyCode key={key}>{key.toUpperCase()}</InlineKeyCode>{" "}
          </>
        ))}
      </>
    );
  },
};
