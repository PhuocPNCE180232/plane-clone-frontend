import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Tên workspace là bắt buộc").max(255),
  slug: z.string().min(1, "Slug là bắt buộc").max(255)
    .regex(/^[a-z0-9-]+$/, "Slug chỉ chứa chữ thường, số và dấu gạch ngang"),
  logo: z.string().optional(),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;

export const updateWorkspaceSchema = createWorkspaceSchema.partial();
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
