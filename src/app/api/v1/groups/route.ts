import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { sleep } from "@/utils";

interface IPayload {
  id: string;
  iat: number;
  exp: number;
}

export const GET = async (request: Request) => {
  try {
    const accessToken = request.headers.get("authorization");

    if (!accessToken) throw new Error("No hay token");

    const { id } = jwt.verify(
      accessToken.split(" ")[1],
      process.env.JWT_ACCESS_TOKEN_MOVIL || ""
    ) as IPayload;

    const user = await prisma.user.findUnique({ where: { id: id } });
    if (!user) throw new Error("Usuario no existe");

    const { searchParams } = new URL(request.url);
    const take = searchParams.get("take");
    const page = searchParams.get("page") ?? 1;

    const groups = await prisma.group.findMany({
      take: Number(take) || undefined,
      skip: (Number(page) - 1) * Number(take),
      orderBy: { name: "asc" },
      where: { userId: id, deleted: false },
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
        userId: id,
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
