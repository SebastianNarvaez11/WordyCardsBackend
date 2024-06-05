import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { ExerciseUpdateValidationSchema } from "@/validations";

interface IPayload {
  id: string;
  iat: number;
  exp: number;
}

interface Segments {
  params: {
    id: string;
  };
}
export const PUT = async (request: Request, { params }: Segments) => {
  try {
    const accessToken = request.headers.get("authorization");

    if (!accessToken) throw new Error("No hay token");

    const { id } = jwt.verify(
      accessToken.split(" ")[1],
      process.env.JWT_ACCESS_TOKEN_MOVIL || ""
    ) as IPayload;

    const user = await prisma.user.findUnique({ where: { id: id } });
    if (!user) throw new Error("Usuario no existe");

    const { id: exerciseId } = params;

    const body = await request.json();

    console.log(body);

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
      where: { id: exerciseId, userId: user.id, deleted: false },
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
