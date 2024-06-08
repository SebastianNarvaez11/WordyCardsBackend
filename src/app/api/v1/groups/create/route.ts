import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CreateGroupValidationSchema } from "@/validations";
import { validateToken } from "@/helpers";

export const POST = async (request: Request) => {
  try {
    const userId = await validateToken(request);
    if (!userId) return NextResponse.json({}, { status: 401 });

    const body = await request.json();

    const { data, success, error } =
      CreateGroupValidationSchema.safeParse(body);

    if (!success) {
      throw new Error(
        error.message || "Ocurrió un error al validar los campos"
      );
    }

    const newGroup = await prisma.group.create({
      data: {
        name: data.name,
        iconName: data.iconName,
        userId: userId,
        maxNumberOfExercisesPerRound:
          Number(data.maxNumberOfExercisesPerRound) ?? 20,
        exercises: {
          createMany: {
            data: data.exercises.map((item) => ({ ...item, userId: userId })),
          },
        },
      },
    });

    return NextResponse.json(
      {
        group: newGroup,
      },
      { status: 200 }
    );
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
