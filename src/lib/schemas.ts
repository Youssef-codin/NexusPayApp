import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    full_name: z.string().min(1, "Full name is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export type RegisterInput = z.infer<typeof registerSchema>

export const sendMoneySchema = z.object({
  to_wallet_id: z.string().min(1, "Recipient wallet ID is required"),
  amount_in_piastres: z.number().min(1000, "Amount must be at least 1000 piastres (10 EGP)"),
  note: z.string().optional(),
  scheduled_at: z.string().optional(),
})

export type SendMoneyInput = z.infer<typeof sendMoneySchema>

export const scheduledTransferSchema = z.object({
  to_wallet_id: z.string().min(1, "Recipient wallet ID is required"),
  amount_in_piastres: z.number().min(1000, "Amount must be at least 1000 piastres (10 EGP)"),
  note: z.string().optional(),
  scheduled_at: z.string().min(1, "Schedule date is required"),
})

export type ScheduledTransferInput = z.infer<typeof scheduledTransferSchema>