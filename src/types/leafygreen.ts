import Banner from "@leafygreen-ui/banner";
import Button from "@leafygreen-ui/button";
import Card from "@leafygreen-ui/card";
import { Tabs } from "@leafygreen-ui/tabs";
import { H1, H2, H3, Overline, Subtitle } from "@leafygreen-ui/typography";

export type BannerType = React.ComponentType<
  Omit<React.ComponentProps<typeof Banner>, "as">
>;

export type ButtonType = React.ComponentType<
  Omit<React.ComponentProps<typeof Button>, "as">
>;

export type CardType = React.ComponentType<
  Omit<React.ComponentProps<typeof Card>, "as">
>;

export type SubtitleType = React.ComponentType<
  Omit<React.ComponentProps<typeof Subtitle>, "as">
>;

export type OverlineType = React.ComponentType<
  Omit<React.ComponentProps<typeof Overline>, "as">
>;

export type H1Type = React.ComponentType<
  Omit<React.ComponentProps<typeof H1>, "as">
>;

export type H2Type = React.ComponentType<
  Omit<React.ComponentProps<typeof H2>, "as">
>;

export type H3Type = React.ComponentType<
  Omit<React.ComponentProps<typeof H3>, "as">
>;

export type TabsType = React.ComponentType<
  Omit<React.ComponentProps<typeof Tabs>, "as">
>;
