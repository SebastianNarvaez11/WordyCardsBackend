import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { sleep } from "@/utils";
import { selectIdealExercises } from "@/helpers";

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
export const GET = async (request: Request, { params }: Segments) => {
  try {
    const accessToken = request.headers.get("authorization");

    if (!accessToken) throw new Error("No hay token");

    const { id } = jwt.verify(
      accessToken.split(" ")[1],
      process.env.JWT_ACCESS_TOKEN_MOVIL || ""
    ) as IPayload;

    const user = await prisma.user.findUnique({ where: { id: id } });
    if (!user) throw new Error("Usuario no existe");

    const { id: groupId } = params;

    const group = await prisma.group.findUnique({
      where: { id: groupId, userId: user.id, deleted: false },
      select: {
        id: true,
        name: true,
        iconName: true,
        maxNumberOfExercisesPerRound: true,
        exercises: {
          orderBy: { englishWord: "asc" }, //todo quitar
          select: {
            id: true,
            englishWord: true,
            spanishTranslation: true,
            image: true,
            rating: true,
            updateAt: true,
          },
        },
      },
    });

    if (!group) throw new Error("No se encontró el grupo con ese id");
    //   await sleep(1);

    const countEasy = await prisma.exercise.count({
      where: { groupId: group.id, rating: 2 },
    });

    const countMedium = await prisma.exercise.count({
      where: { groupId: group.id, rating: 1 },
    });

    const countHard = await prisma.exercise.count({
      where: { groupId: group.id, rating: 0 },
    });

    return NextResponse.json(
      {
        group: {
          ...group,
          exercises: selectIdealExercises(
            group.exercises,
            group.maxNumberOfExercisesPerRound
          ),
        },
        countEasy,
        countMedium,
        countHard,
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
