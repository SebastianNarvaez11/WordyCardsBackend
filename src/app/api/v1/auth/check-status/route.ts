import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

interface IPayload {
  id: string;
  iat: number;
  exp: number;
}

export const GET = async (request: Request) => {
  try {
    const accessToken = request.headers.get("authorization");

    if (!accessToken) throw new Error("No hay token ");

    const { id } = jwt.verify(
      accessToken.split(" ")[1],
      process.env.JWT_ACCESS_TOKEN_MOVIL || ""
    ) as IPayload;

    const user = await prisma.user.findUnique({ where: { id: id } });

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
