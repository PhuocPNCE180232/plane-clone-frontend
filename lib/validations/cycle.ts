import { z } from "zod";

export const createCycleSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(255),
    description: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.startDate && val.endDate) {
      const s = new Date(val.startDate);
      const e = new Date(val.endDate);
      if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid date" });
        return;
      }
      if (e < s) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "End date must be the same or after start date" });
      }
    }
  });

export type CreateCycleInput = z.infer<typeof createCycleSchema>;
