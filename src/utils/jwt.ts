import jwt from "jsonwebtoken";

export const generateAccessToken = async (userId: string) => {
  try {
    const payload = { id: userId };

    if (!process.env.JWT_ACCESS_TOKEN_MOVIL) {
      throw new Error("No hay clave para firmar los token en la variables");
    }

    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_MOVIL, {
      expiresIn: "5h",
    });

    return accessToken;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

export const generateRefreshToken = async (userId: string) => {
  try {
    const payload = { id: userId };

    if (!process.env.JWT_REFRESH_TOKEN_MOVIL) {
      throw new Error("No hay clave para firmar los token en la variables");
    }

    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_TOKEN_MOVIL,
      { expiresIn: "15d" }
    );

    return refreshToken;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};
