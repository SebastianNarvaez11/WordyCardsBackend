import { groups } from "./data";
import prisma from "../lib/prisma";
import bcryptjs from "bcryptjs";

const main = async () => {
  await prisma.exercise.deleteMany();
  await prisma.group.deleteMany();
  await prisma.user.deleteMany();

  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: "sebas@gmail.com",
          name: "Sebastian",
          password: bcryptjs.hashSync("tatannvrz"),
        },
      });

      await Promise.all(
        groups.map(async (group) => {
          await tx.group.create({
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
    });
  } catch (error) {
    console.log(error);
  }
};

(() => {
  main();
})();
