import { z } from "zod";

export const workspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
  slug: z.string().min(1, "Workspace URL is required").regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  companySize: z.string().min(1, "Company size is required"),
});

export type WorkspaceInput = z.infer<typeof workspaceSchema>;

export const inviteMembersSchema = z.object({
  emails: z.array(z.object({
    email: z.string().email("Invalid email").or(z.literal(""))
  }))
});

export type InviteMembersInput = z.infer<typeof inviteMembersSchema>;

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  identifier: z.string().min(1, "Identifier is required").max(5, "Max 5 characters for identifier"),
});

export type ProjectInput = z.infer<typeof projectSchema>;
