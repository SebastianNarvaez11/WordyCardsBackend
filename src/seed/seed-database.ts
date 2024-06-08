import { groups } from "./data";
import prisma from "../lib/prisma";
import bcryptjs from "bcryptjs";

const main = async () => {
  await prisma.exercise.deleteMany();
  await prisma.group.deleteMany();
  await prisma.user.deleteMany();

  // en producción no se pueden ejecutar la transacciones de prims por alguna razón

  try {
    // await prisma.$transaction(async (tx) => {
    const user = await prisma.user.create({
      data: {
        email: "sebas@gmail.com",
        name: "Sebastian",
        password: bcryptjs.hashSync("tatannvrz"),
      },
    });

    await Promise.all(
      groups.map(async (group) => {
        await prisma.group.create({
          data: {
            name: group.name,
            iconName: group.iconName,
            userId: user.id,
            exercises: {
              createMany: {
                data: group.exercises.map((word) => ({
                  ...word,
                  userId: user.id,
                })),
              },
            },
          },
        });
      })
    );
    // });
  } catch (error) {
    console.log(error);
  }
};

(() => {
  main();
})();
