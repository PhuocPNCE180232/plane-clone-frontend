/**
 * lib/services/member.service.ts
 *
 * Plain async functions for the Member domain.
 * All HTTP access goes through lib/api/request.ts only.
 *
 * Endpoint assumptions (flat REST, no nested paths):
 *   GET    /members          → Member[]
 *   POST   /members          → Member
 *   DELETE /members/:id      → void
 */

import { get, post, del } from "@/lib/api/request";
import type { Member } from "@/types";

// ─── DTO types ─────────────────────────────────────────────────────────────

/** Fields required when inviting a new member. */
export type InviteMemberDto = {
  email: string;
  role: string;
  workspace_id: string;
};

// ─── Service functions ─────────────────────────────────────────────────────

/** Returns all members accessible to the current session. */
export const getMembers = (): Promise<Member[]> =>
  get<Member[]>("/members");

/** Invites a new member and returns the created resource. */
export const inviteMember = (data: InviteMemberDto): Promise<Member> =>
  post<Member, InviteMemberDto>("/members", data);

/** Removes a member by ID. Returns void (204 No Content). */
export const removeMember = (id: string): Promise<void> =>
  del<void>(`/members/${id}`);
