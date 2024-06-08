import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface IPayload {
  id: string;
  iat: number;
  exp: number;
}

export const validateToken = async (request: Request) => {
  try {
    const accessToken = request.headers.get("authorization");

    if (!accessToken) throw new Error("No hay token");

    const { id } = jwt.verify(
      accessToken.split(" ")[1],
      process.env.JWT_ACCESS_TOKEN_MOVIL || ""
    ) as IPayload;

    const user = await prisma.user.findUnique({ where: { id: id } });
    if (!user) throw new Error("TokenExpiredError");

    return id;
  } catch (error: any) {
    return null;
  }
};
