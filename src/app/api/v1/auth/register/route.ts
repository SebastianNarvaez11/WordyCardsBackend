import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "@/utils";
import { RegisterValidationSchema } from "@/validations";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    const { data, success, error } = RegisterValidationSchema.safeParse(body);

    if (!success) {
      throw new Error(
        error.message || "Ocurrió un error al validar los campos"
      );
    }

    //1. Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: data?.email },
    });

    if (user) throw new Error("Ese correo ya esta en uso, intenta con otro");

    const newUser = await prisma.user.create({
      data: {
        email: data.email.toLocaleLowerCase(),
        name: data.name.toLocaleUpperCase(),
        password: bcryptjs.hashSync(data.password),
      },
    });

    // const accessToken = await generateAccessToken(newUser.id);
    // const refreshToken = await generateRefreshToken(newUser.id);

    return NextResponse.json({ user: newUser }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      {
        message: error.message
          ? error.message
          : "500 | Ocurrió un error al crear el usuario",
        error,
      },
      { status: 500 }
    );
  }
};
