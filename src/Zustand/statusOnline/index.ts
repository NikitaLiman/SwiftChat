import { boolean } from "zod";
import { create } from "zustand";

interface statusProps {
  useStatus: { [userId: number]: boolean };
  setUseStatus: (userId: number, isOnline: boolean) => void;
}

export const useUserStatus = create<statusProps>((set) => ({
  useStatus: {},
  setUseStatus: (userId, isOnline) => {
    set((state) => ({
      useStatus: {
        ...state.useStatus,
        [userId]: isOnline,
      },
    }));
  },
}));
