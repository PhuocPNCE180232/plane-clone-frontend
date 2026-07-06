import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Tên project là bắt buộc").max(255),
  identifier: z.string().min(1, "Identifier là bắt buộc").max(10)
    .regex(/^[A-Z0-9]+$/, "Identifier chỉ chứa chữ in hoa và số"),
  description: z.string().optional(),
  network: z.enum(["Public", "Private"]),
});
export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = createProjectSchema.partial();
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

// State Schema
export const createStateSchema = z.object({
  name: z.string().min(1, "Tên trạng thái là bắt buộc"),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Mã màu không hợp lệ"),
  group: z.enum(["Backlog", "Unstarted", "Started", "Completed", "Canceled"]),
});
export type CreateStateInput = z.infer<typeof createStateSchema>;

// Label Schema
export const createLabelSchema = z.object({
  name: z.string().min(1, "Tên nhãn là bắt buộc"),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Mã màu không hợp lệ"),
});
export type CreateLabelInput = z.infer<typeof createLabelSchema>;
