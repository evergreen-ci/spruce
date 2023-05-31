import Banner from "@leafygreen-ui/banner";
import Button from "@leafygreen-ui/button";
import Card from "@leafygreen-ui/card";
import { Tabs } from "@leafygreen-ui/tabs";

export type BannerType = React.ComponentType<
  Omit<React.ComponentProps<typeof Banner>, "as">
>;

export type ButtonType = React.ComponentType<
  Omit<React.ComponentProps<typeof Button>, "as">
>;

export type CardType = React.ComponentType<
  Omit<React.ComponentProps<typeof Card>, "as">
>;

export type TabsType = React.ComponentType<
  Omit<React.ComponentProps<typeof Tabs>, "as">
>;
