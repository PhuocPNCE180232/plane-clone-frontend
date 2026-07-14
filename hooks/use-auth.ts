import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { login as loginService, signup as signupService, getMe, logout as logoutService, LoginDto, SignupDto } from "@/lib/services/auth.service";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginDto) => Promise<void>;
  signup: (data: SignupDto) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (data: LoginDto) => {
        set({ isLoading: true });
        try {
          const response = await loginService(data);
          // Set a plain cookie so middleware.ts can detect auth state
          document.cookie = `plane_session=${response.user.id}; path=/; max-age=${60 * 60 * 24 * 7}`;
          set({ user: response.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      signup: async (data: SignupDto) => {
        set({ isLoading: true });
        try {
          const response = await signupService(data);
          // Set a plain cookie so middleware.ts can detect auth state
          document.cookie = `plane_session=${response.user.id}; path=/; max-age=${60 * 60 * 24 * 7}`;
          set({ user: response.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await logoutService();
        } finally {
          // Clear the session cookie
          document.cookie = 'plane_session=; path=/; max-age=0';
          set({ user: null, isAuthenticated: false });
        }
      },

      fetchUser: async () => {
        set({ isLoading: true });
        try {
          const response = await getMe();
          set({ user: response.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      // persist user and isAuthenticated state to survive reloads if cookies are used
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
