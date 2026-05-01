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
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export type RegisterInput = z.infer<typeof registerSchema>

export const sendMoneySchema = z.object({
  recipientId: z.string().min(1, "Recipient is required"),
  recipientName: z.string().min(1, "Recipient name is required"),
  amount: z.number().min(1, "Amount must be at least 1"),
  note: z.string().optional(),
})

export type SendMoneyInput = z.infer<typeof sendMoneySchema>

export const createScheduledSchema = z.object({
  recipientId: z.string().min(1, "Recipient is required"),
  recipientName: z.string().min(1, "Recipient name is required"),
  amount: z.number().min(1, "Amount must be at least 1"),
  note: z.string().optional(),
  scheduledAt: z.string().min(1, "Schedule date is required"),
})

export type CreateScheduledInput = z.infer<typeof createScheduledSchema>