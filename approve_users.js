
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.user.updateMany({
        where: { status: 'PENDING' },
        data: { status: 'APPROVED' }
    });
    console.log("All users approved.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
