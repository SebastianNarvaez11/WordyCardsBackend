import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateToken } from "@/helpers";

export const GET = async (request: Request) => {
  try {
    const userId = await validateToken(request);
    if (!userId) return NextResponse.json({}, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("Usuario no existe");

    const { password, createdAt, updateAt, ...rest } = user;

    return NextResponse.json({ user: rest }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      {
        message: error.message ? error.message : "401 | Ocurrió un error",
        error,
      },
      { status: 401 }
    );
  }
};
