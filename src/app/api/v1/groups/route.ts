import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { sleep } from "@/utils";
import { validateToken } from "@/helpers";

interface IPayload {
  id: string;
  iat: number;
  exp: number;
}

export const GET = async (request: Request) => {
  try {
    const userId = await validateToken(request);
    if (!userId) return NextResponse.json({}, {status:401})

    const { searchParams } = new URL(request.url);
    const take = searchParams.get("take");
    const page = searchParams.get("page") ?? 1;

    const groups = await prisma.group.findMany({
      take: Number(take) || undefined,
      skip: (Number(page) - 1) * Number(take),
      orderBy: { name: "asc" },
      where: { userId: userId, deleted: false },
      select: {
        id: true,
        iconName: true,
        name: true,
        _count: { select: { exercises: true } },
      },
    });

    const customGroups = await Promise.all(
      groups.map(async (item) => ({
        ...item,
        _countEasy: await prisma.exercise.count({
          where: { groupId: item.id, rating: 2 },
        }),
      }))
    );

    const totalCount = await prisma.group.count({
      where: {
        deleted: false,
        userId: userId,
      },
    });

    // calculamos el total de paginas para hacer la pagination
    const totalPage = Math.ceil(totalCount / (Number(take) || 1));

    //  await sleep(1);

    return NextResponse.json(
      {
        groups: customGroups,
        totalGroups: totalCount,
        currentPage: Number(page),
        totalPages: totalPage,
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
