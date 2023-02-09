import { useRef, useEffect } from "react";
import Button from "@leafygreen-ui/button";
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
      <FirstTimeGuideCue
        numberOfSteps={1}
        currentStep={1}
        refEl={ref}
        cookieName="test"
        {...args}
      />
      <Button ref={ref}>Click me</Button>
    </div>
  );
};

Default.args = {
  title: "First Time Guide Cue",
  description: "This is a description",
  buttonText: "Close",
  numberOfSteps: 1,
  currentStep: 1,
};
