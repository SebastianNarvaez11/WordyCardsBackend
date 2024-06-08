import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UpdateGroupValidationSchema } from "@/validations";
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

    const { id: groupId } = params;
    const body = await request.json();

    const { data, success, error } =
      UpdateGroupValidationSchema.safeParse(body);

    if (!success) {
      throw new Error(
        error.message || "Ocurrió un error al validar los campos"
      );
    }

    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new Error("No se encontró el grupo");
    }

    const updatedGroup = await prisma.group.update({
      where: { id: groupId },
      data: {
        name: data.name || group.name,
        iconName: data.iconName || group.iconName,
        maxNumberOfExercisesPerRound:
          Number(data.maxNumberOfExercisesPerRound) ??
          group.maxNumberOfExercisesPerRound,
        exercises: {
          createMany: {
            data:
              data.exercises
                ?.filter((item) => !item.id)
                .map((item) => ({ ...item, userId: userId })) || [],
          },
        },
      },
    });

    return NextResponse.json(
      {
        group: updatedGroup,
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
