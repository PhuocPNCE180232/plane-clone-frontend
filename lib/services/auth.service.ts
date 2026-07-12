/**
 * lib/services/auth.service.ts
 *
 * Auth API service functions.
 */

import { get, post } from "@/lib/api/request";
import type { User } from "@/types";

export type LoginDto = {
  email: string;
  password?: string;
};

export type SignupDto = {
  email: string;
  name?: string;
  password?: string;
};

export const login = (data: LoginDto): Promise<{ user: User, token: string }> => {
  return post<{ user: User, token: string }, LoginDto>("/auth/login", data);
};

export const signup = (data: SignupDto): Promise<{ user: User, token: string }> => {
  return post<{ user: User, token: string }, SignupDto>("/auth/signup", data);
};

export const getMe = (): Promise<{ user: User }> => {
  return get<{ user: User }>("/users/me");
};

export const logout = (): Promise<{ success: boolean }> => {
  return post<{ success: boolean }>("/auth/logout");
};
