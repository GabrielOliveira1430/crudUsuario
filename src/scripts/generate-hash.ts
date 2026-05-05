import bcrypt from "bcrypt";

async function run() {
  const hash = await bcrypt.hash("Senh@123", 10);
  console.log("HASH GERADO:", hash);
}

run();