import React from "react";
import { MemoryRouter as Router } from "react-router-dom";
import { SpawnHostCard } from "pages/spawn/spawnHost/SpawnHostCard";

const host = {
  expiration: "2020-08-21T18:00:07Z",
  distro: {
    isVirtualWorkStation: true,
    id: "ubuntu1804-workstation",
    user: "ubuntu",
    workDir: "/home/ubuntu",
  },
  hostUrl: "ec2-54-242-162-135.compute-1.amazonaws.com",
  homeVolumeID: "vol-0ea662ac92f611ed4",
  id: "i-04ade558e1e26b0ad",
  instanceType: "m5.xlarge",
  instanceTags: [
    {
      key: "name",
      value: "i-04ade558e1e26b0ad",
      canBeModified: false,
    },
    {
      key: "distro",
      value: "ubuntu1804-workstation",
      canBeModified: false,
    },
    {
      key: "owner",
      value: "mohamed.khelif",
      canBeModified: false,
    },
    {
      key: "mode",
      value: "production",
      canBeModified: false,
    },
    {
      key: "start-time",
      value: "20200615111044",
      canBeModified: false,
    },
  ],
  volumes: [],
  noExpiration: true,
  provider: "ec2-ondemand",
  status: "running",
  startedBy: "mohamed.khelif",
  tag: "evg-ubuntu1804-workstation-20200615111044-7227428564029203",
  user: "ubuntu",
  uptime: "2020-06-15T11:10:44Z",
};

export const SpawnHostCardStory = () => (
  <Router>
    <SpawnHostCard host={host} />
  </Router>
);

export default {
  title: "Spawn Host Card",
  component: SpawnHostCardStory,
};
