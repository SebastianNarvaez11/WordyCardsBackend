import {ZodType, z} from 'zod';

import {ILoginFormFields} from '../interfaces';

export const LoginValidationSchema: ZodType<ILoginFormFields> = z.object({
  email: z
    .string()
    .email({message: 'El correo electrónico no es válido'})
    .min(6, {message: 'El correo electrónico es muy corto'})
    .max(100, {message: 'El correo electrónico es muy largo'}),
  password: z
    .string()
    .min(6, {message: 'La contraseña es muy corta'})
    .max(30, {message: 'La contraseña es muy larga'}),
});
