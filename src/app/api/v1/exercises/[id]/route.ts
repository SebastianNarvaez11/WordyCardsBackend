import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ExerciseUpdateValidationSchema } from "@/validations";
import { validateToken } from "@/helpers";
interface Segments {
  params: {
    id: string;
  };
}
export const PUT = async (request: Request, { params }: Segments) => {
  try {
    const userId = await validateToken(request);
    if (!userId) return NextResponse.json({}, { status: 401 });

    const { id: exerciseId } = params;

    const body = await request.json();

    const { data, success, error } =
      ExerciseUpdateValidationSchema.safeParse(body);

    if (!success) {
      throw new Error(
        error.message || "Ocurrió un error al validar los campos"
      );
    }

    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) {
      throw new Error("No se encontró el ejercicio");
    }

    const updatedExercise = await prisma.exercise.update({
      where: { id: exerciseId, userId: userId, deleted: false },
      data: {
        rating: data.rating ?? exercise.rating,
        englishWord: data.englishWord || exercise.englishWord,
        spanishTranslation:
          data.spanishTranslation || exercise.spanishTranslation,
      },
    });

    return NextResponse.json({ exercise: updatedExercise }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      {
        message: error.message ? error.message : "404 | Ocurrió un error",
        error,
      },
      { status: 404 }
    );
  }
};
