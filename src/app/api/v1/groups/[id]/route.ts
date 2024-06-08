import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sleep } from "@/utils";
import { selectIdealExercises, validateToken } from "@/helpers";

interface Segments {
  params: {
    id: string;
  };
}
export const GET = async (request: Request, { params }: Segments) => {
  try {
    const userId = await validateToken(request);
    if (!userId) return NextResponse.json({}, { status: 401 });

    const { id: groupId } = params;

    const group = await prisma.group.findUnique({
      where: { id: groupId, userId: userId, deleted: false },
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

    const { searchParams } = new URL(request.url);
    const areAll = searchParams.get("all-exercises");

    return NextResponse.json(
      {
        group: {
          ...group,
          exercises: areAll
            ? group.exercises
            : selectIdealExercises(
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
