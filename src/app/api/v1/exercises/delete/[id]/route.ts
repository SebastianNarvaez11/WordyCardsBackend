import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateToken } from "@/helpers";

interface Segments {
  params: {
    id: string;
  };
}

export const DELETE = async (request: Request, { params }: Segments) => {
  try {
    const userId = await validateToken(request);
    if (!userId) return NextResponse.json({}, { status: 401 });

    const { id: exerciseId } = params;

    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) {
      throw new Error("No se encontró la palabra");
    }

    await prisma.exercise.delete({ where: { id: exercise.id } });

    return NextResponse.json({ ok: true }, { status: 200 });
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
