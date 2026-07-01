import 'dotenv/config';
import { prisma } from "../src/lib/prisma";

async function main() {
    await prisma.user.update({
        where: { email: "raffa96dias@gmail.com" },
        data: { role: "admin" },
    });

    console.log("Admin criado!");
}

main()
.catch(console.error)
.finally(() => prisma.$disconnect());