import React from "react";
import { Route, useParams, Redirect } from "react-router-dom";
import { routes, SpawnTab } from "constants/routes";
import { SpawnHost } from "pages/spawn/SpawnHost";
import { SpawnVolume } from "pages/spawn/SpawnVolume";

export const Spawn = () => {
  const { tab } = useParams<{ tab: string }>();
  if (!tabRouteValues.includes(tab as SpawnTab)) {
    return <Redirect to={routes.spawnHost} />;
  }
  return (
    <>
      <div>side wall</div>
      <Route path={routes.spawnHost} component={SpawnHost} />
      <Route path={routes.spawnVolume} component={SpawnVolume} />
    </>
  );
};

const tabRouteValues = Object.values(SpawnTab);
