import bcrypt from "bcrypt";

const password = process.argv[2];

if (!password) {
  console.error("Usage: npx ts-node src/scripts/seed-admin.ts <password>");
  process.exit(1);
}

async function main() {
  const hash = await bcrypt.hash(password, 12);
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
}

main();
