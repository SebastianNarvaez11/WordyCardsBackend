import { LoginValidationSchema } from "@/validations";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "@/utils/jwt";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    const { data, success, error } = LoginValidationSchema.safeParse(body);

    if (!success) {
      throw new Error(
        error.message || "Ocurrió un error al validar los campos"
      );
    }

    //1. Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLocaleLowerCase() },
    });

    if (!user) throw new Error("Credenciales incorrectas");

    // 2. Comparar contraseñas
    if (!bcryptjs.compareSync(data.password, user.password))
      throw new Error("Credenciales incorrectas");

    //3. Validar el estado del usuario
    if (user.deleted || !user.isActive) throw new Error("Usuario inactivo");

    const accessToken = await generateAccessToken(user.id);
    const refreshToken = await generateRefreshToken(user.id);

    const { password, createdAt, updateAt, ...rest } = user;

    return NextResponse.json(
      { user: rest, accessToken, refreshToken },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      {
        message: error.message ? error.message : "500 | Ocurrió un error",
        error,
      },
      { status: 400 }
    );
  }
};
