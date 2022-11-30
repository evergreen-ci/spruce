import Banner from "@leafygreen-ui/banner";
import { useNetworkStatus } from "hooks";

export const ConnectivityBanner = () => {
  const isOnline = useNetworkStatus();
  return !isOnline ? <Banner variant="warning">You are offline.</Banner> : null;
};
