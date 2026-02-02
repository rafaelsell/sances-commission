import { type Session, type User as BaseUser } from "better-auth/client";
import { create } from "zustand";
import { authClient } from "@/lib/auth-client";

interface User extends BaseUser {
  managerFixedCommission?: number | null;
  managerPercentCommission?: number | null;
}

interface AuthStore {
  session: Session | null;
  user: User | null;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  user: null,
  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),
  refreshUser: async () => {
    const { data } = await authClient.getSession();
    if (data) {
      set({ session: data.session, user: data.user as User });
    }
  },
}));
