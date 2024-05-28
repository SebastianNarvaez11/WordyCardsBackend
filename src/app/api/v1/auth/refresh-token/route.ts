import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "@/utils/jwt";
import prisma from "@/lib/prisma";

interface IPayload {
  id: string;
  iat: number;
  exp: number;
}

export const GET = async (request: Request) => {
  try {
    const refreshToken = request.headers.get("authorization");

    if (!refreshToken) throw new Error("No hay refresh token");

    const { id } = jwt.verify(
      refreshToken.split(" ")[1],
      process.env.JWT_REFRESH_TOKEN_MOVIL || ""
    ) as IPayload;

    const user = await prisma.user.findUnique({ where: { id: id } });

    if (!user) throw new Error("Usuario no existe");

    const newAccessToken = await generateAccessToken(user.id);

    return NextResponse.json({ newAccessToken }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      {
        message: error.message ? error.message : "401| Ocurrió un error",
        error,
      },
      { status: 401 }
    );
  }
};
