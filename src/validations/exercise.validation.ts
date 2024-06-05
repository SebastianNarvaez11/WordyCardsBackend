import { ZodType, z } from "zod";

import { IUpdateExerciseFormFields } from "../interfaces";

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
