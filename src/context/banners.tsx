import React, { useState, useContext } from "react";
import { BannerTypeKeys } from "types/banner";
import { v4 as uuid } from "uuid";

export interface BannerObj {
  id: string;
  type: BannerTypeKeys;
  message: string;
}
type AddBanner = (message: string) => void;
interface DispatchBanner {
  error: AddBanner;
  success: AddBanner;
  warning: AddBanner;
  info: AddBanner;
  remove: (bannerId: string) => void;
  clearAll: () => void;
}

const BannerDispatchContext = React.createContext<DispatchBanner | null>(null);
const BannerStateContext = React.createContext<BannerObj[] | null>(null);

export const BannerContextProvider: React.FC = ({ children }) => {
  const [banners, setBanners] = useState<BannerObj[]>([]);

  const addBanner = (type: BannerTypeKeys, message: string) => {
    const newBanner: BannerObj = { id: uuid(), type, message };
    setBanners([...banners, newBanner]);
  };
  const removeBanner = (bannerId: string) => {
    const nextBanners = banners.filter(({ id }) => bannerId !== id);
    setBanners(nextBanners);
  };
  const clearAllBanners = () => setBanners([]);
  const dispatchBanner: DispatchBanner = {
    error: (message: string) => addBanner("error", message),
    success: (message: string) => addBanner("success", message),
    warning: (message: string) => addBanner("warning", message),
    info: (message: string) => addBanner("info", message),
    remove: removeBanner,
    clearAll: clearAllBanners,
  };

  return (
    <BannerDispatchContext.Provider value={dispatchBanner}>
      <BannerStateContext.Provider value={banners}>
        {children}
      </BannerStateContext.Provider>
    </BannerDispatchContext.Provider>
  );
};

export const useBannerDispatchContext = () => {
  const context = useContext(BannerDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useBannerDispatchContext must be used within a BannerContextProvider"
    );
  }
  return context;
};
export const useBannerStateContext = () => {
  const context = useContext(BannerStateContext);
  if (context === undefined) {
    throw new Error(
      "useBannerStateContext must be used within a BannerContextProvider"
    );
  }
  return context;
};
