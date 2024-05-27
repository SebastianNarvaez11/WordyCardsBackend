import { ZodType, z } from "zod";

import { IRegisterFormFields } from "../interfaces";

export const RegisterValidationSchema: ZodType<IRegisterFormFields> = z
  .object({
    name: z
      .string()
      .min(2, { message: "El nombre es muy corto" })
      .max(20, { message: "El nombre es muy largo" }),
    email: z
      .string()
      .email({ message: "El correo electrónico no es válido" })
      .min(6, { message: "El correo electrónico es muy corto" })
      .max(100, { message: "El correo electrónico es muy largo" }),
    password: z
      .string()
      .min(6, { message: "La contraseña es muy corta" })
      .max(30, { message: "La contraseña es muy larga" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });
