import React from "react";
import { Banner } from "components/Banner";

export default {
  title: "Banner",
  component: Banner,
};

export const Success = () => {
  return (
    <Banner type="success">I am a banner and I have something to say!</Banner>
  );
};
export const Error = () => {
  return (
    <Banner type="error">I am a banner and I have something to say!</Banner>
  );
};
export const Warning = () => {
  return (
    <Banner type="warning">I am a banner and I have something to say!</Banner>
  );
};
export const Info = () => {
  return (
    <Banner type="info">I am a banner and I have something to say!</Banner>
  );
};
export const MultipleLinesOfText = () => {
  return (
    <Banner type="success">
      Now this is a story all about how my life got flipped-turned upside down
      and I'd like to take a minute just sit right there I'll tell you how I
      became the prince of a town called Bel-Air. In west philadelphia born and
      raised on the playground was where I spent most of my days. Chillin' out
      maxin' relaxin' all cool and all shooting some b-ball outside of the
      school when a couple of guys who were up to no good started making trouble
      in my neighborhood. I got in one little fight and my mom got scared she
      said, "You're moving with your auntie and uncle in Bel-Air"
    </Banner>
  );
};
