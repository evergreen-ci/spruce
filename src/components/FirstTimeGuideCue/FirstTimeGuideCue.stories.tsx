import { useRef, useEffect } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import Cookies from "js-cookie";
import FirstTimeGuideCue from ".";

export default {
  title: "Components/FirstTimeGuideCue",
  component: FirstTimeGuideCue,
} as ComponentMeta<typeof FirstTimeGuideCue>;

export const Default: ComponentStory<typeof FirstTimeGuideCue> = (args) => {
  const ref = useRef(null);
  useEffect(() => {
    Cookies.set("test", "");
  }, []);
  return (
    <div>
      <FirstTimeGuideCue refEl={ref} {...args} />
      <span ref={ref}>I&apos;m an element</span>
    </div>
  );
};

Default.args = {
  title: "First Time Guide Cue",
  description: "I will not show up again if you click the close button.",
  buttonText: "Close",
  numberOfSteps: 1,
  currentStep: 1,
  cookieName: "test",
};

Default.parameters = {
  storyshots: { disable: true },
};
