import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { validateToken } from "@/helpers";

interface Segments {
  params: {
    id: string;
  };
}

export const DELETE = async (request: Request, { params }: Segments) => {
  try {
    const userId = await validateToken(request);
    if (!userId) return NextResponse.json({}, { status: 401 });

    const { id: groupId } = params;

    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new Error("No se encontró el grupo");
    }

    await prisma.group.delete({ where: { id: group.id } });

    return NextResponse.json({ ok: true }, { status: 200 });
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
