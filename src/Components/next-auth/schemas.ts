import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(4, { message: "Too tiny password" });
export const formLoginSchema = z.object({
  email: z.string().email({ message: "Enter correct email" }),
  password: z
    .string()
    .min(4, { message: "Password have to include at least 4 symbols" }),
});
export const registerFormSchema = formLoginSchema
  .merge(
    z.object({
      fullname: z.string().min(4, { message: "Enter Firstname & LastName" }),
      confirmPassword: passwordSchema,
    })
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords are not the same",
    path: ["confirmPassword"],
  });

export const EditProfile = z.object({
  fullname: z.string().min(2, { message: "Enter your name" }),
  email: z.string().email({ message: "Enter correct email" }),
  bio: z.string().optional(),
  username: z.string().optional(),
});

export type TformEditValues = z.infer<typeof EditProfile>;
export type TformLoginValues = z.infer<typeof formLoginSchema>;
export type TformRegisterValues = z.infer<typeof registerFormSchema>;
