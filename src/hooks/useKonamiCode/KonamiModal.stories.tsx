import { StoryObj } from "@storybook/react";
import Cookies from "js-cookie";
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
    Cookies.remove("konami");

    return (
      <>
        <KonamiModal />
        <p>up, up, down, down, left, right, left, right, B, A</p>
      </>
    );
  },
};
