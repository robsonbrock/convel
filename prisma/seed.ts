/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const bcrypt = require("bcryptjs");

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Super-admin seed
  await prisma.adminUser.upsert({
    where: { email: "robsonbrock@gmail.com" },
    update: {},
    create: {
      fullName: "Robson Brock",
      email: "robsonbrock@gmail.com",
      passwordHash: await bcrypt.hash("changeme123", 10),
      isSuperAdmin: true,
      mustChangePass: false,
    },
  });

  // Sample books — cada um pode ter exemplares para empréstimo, venda ou ambos
  const books = [
    { title: "O Evangelho Segundo o Espiritismo", author: "Allan Kardec", publisher: "FEB", year: 1864, quantityEmprestimo: 2, quantityVenda: 5 },
    { title: "O Livro dos Espíritos", author: "Allan Kardec", publisher: "FEB", year: 1857, quantityEmprestimo: 3, quantityVenda: 0 },
    { title: "A Gênese", author: "Allan Kardec", publisher: "FEB", year: 1868, quantityEmprestimo: 0, quantityVenda: 4 },
    { title: "O Céu e o Inferno", author: "Allan Kardec", publisher: "FEB", year: 1865, quantityEmprestimo: 2, quantityVenda: 0 },
    { title: "Nosso Lar", author: "André Luiz / Francisco C. Xavier", publisher: "FEB", year: 1944, quantityEmprestimo: 6, quantityVenda: 0 },
    { title: "Chico Xavier", author: "Marcel Souto Maior", publisher: "Planeta", year: 2003, quantityEmprestimo: 0, quantityVenda: 2 },
  ];

  for (const book of books) {
    await prisma.book.create({ data: book }).catch(() => {});
  }

  // Sample borrowers
  const borrowers = [
    { name: "Maria das Graças Silva", cpf: "12345678901", address: "Rua das Flores, 123, São Paulo, SP", phone: "(11) 99999-1111", email: "maria@email.com" },
    { name: "João Carlos Oliveira", cpf: "98765432100", address: "Av. Paulista, 456, São Paulo, SP", phone: "(11) 99999-2222", email: "joao@email.com" },
    { name: "Ana Paula Santos", cpf: "11122233344", address: "Rua Augusta, 789, São Paulo, SP", phone: "(11) 99999-3333" },
  ];

  for (const borrower of borrowers) {
    await prisma.borrower.upsert({
      where: { cpf: borrower.cpf },
      update: {},
      create: borrower,
    });
  }

  console.log("✅ Seed concluído!");
  console.log("   Super-admin: robsonbrock@gmail.com / changeme123");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
