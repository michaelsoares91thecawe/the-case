
const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const password = await hash('password123', 10);

    const users = [
        { email: 'michael@andmore.lu', name: 'Michael', role: 'ADMIN' },
        { email: 'michael.soares91@icloud.com', name: 'Michael Soares', role: 'USER' }
    ];

    for (const u of users) {
        const exists = await prisma.user.findUnique({ where: { email: u.email } });
        if (!exists) {
            await prisma.user.create({
                data: {
                    email: u.email,
                    name: u.name,
                    password: password,
                    role: u.role,
                    status: 'APPROVED'
                }
            });
            console.log(`Created user: ${u.email}`);
        } else {
            console.log(`User already exists: ${u.email}`);
        }
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
