import { seedDatabase } from "../src/lib/db/seed";

seedDatabase()
  .then(() => {
    console.log("Base de datos preparada.");
  })
  .catch((error: unknown) => {
    console.error("No se pudo preparar la base de datos.", error);
    process.exitCode = 1;
  });
