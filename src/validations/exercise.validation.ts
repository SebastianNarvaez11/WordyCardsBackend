import { ZodType, z } from "zod";

import { ICreateExerciseFormFields, IUpdateExerciseFormFields } from "../interfaces";

export const ExerciseUpdateValidationSchema: ZodType<IUpdateExerciseFormFields> =
  z.object({
    englishWord: z
      .string()
      .min(1, { message: "Este campo es requerido" })
      .max(32, { message: "El máximo de caracteres es de 32" })
      .optional(),

    spanishTranslation: z
      .string()
      .min(1, { message: "Este campo es requerido" })
      .max(32, { message: "El máximo de caracteres es de 32" })
      .optional(),
    rating: z
      .number()
      .min(0, { message: "La calificación minima es 0" })
      .max(2, { message: "La calificación maxima es 2" })
      .optional(),
    groupId: z.string().optional(),
  });


  export const ExerciseCreateValidationSchema: ZodType<ICreateExerciseFormFields> =
  z.object({
    id: z.string().optional(),

    englishWord: z
      .string()
      .min(1, {message: 'Este campo es requerido'})
      .max(32, {message: 'El máximo de caracteres es de 32'}),

    spanishTranslation: z
      .string()
      .min(1, {message: 'Este campo es requerido'})
      .max(32, {message: 'El máximo de caracteres es de 32'}),

    image: z.string().optional().nullable(),
  });
