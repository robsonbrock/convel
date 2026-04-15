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

  // 5 usuários operadores
  const usuarios = [
    { fullName: "Carlos Mendes", email: "carlos@convel.org", password: "senha123" },
    { fullName: "Fernanda Lima", email: "fernanda@convel.org", password: "senha123" },
    { fullName: "Ricardo Alves", email: "ricardo@convel.org", password: "senha123" },
    { fullName: "Patrícia Souza", email: "patricia@convel.org", password: "senha123" },
    { fullName: "Eduardo Costa", email: "eduardo@convel.org", password: "senha123" },
  ];

  for (const u of usuarios) {
    await prisma.adminUser.upsert({
      where: { email: u.email },
      update: {},
      create: {
        fullName: u.fullName,
        email: u.email,
        passwordHash: await bcrypt.hash(u.password, 10),
        isSuperAdmin: false,
        mustChangePass: false,
      },
    });
  }

  // 15 livros
  const books = [
    { title: "O Evangelho Segundo o Espiritismo", author: "Allan Kardec", publisher: "FEB", year: 1864, quantityEmprestimo: 3, quantityVenda: 5, priceVenda: 35.90 },
    { title: "O Livro dos Espíritos", author: "Allan Kardec", publisher: "FEB", year: 1857, quantityEmprestimo: 4, quantityVenda: 3, priceVenda: 42.00 },
    { title: "A Gênese", author: "Allan Kardec", publisher: "FEB", year: 1868, quantityEmprestimo: 2, quantityVenda: 4, priceVenda: 38.50 },
    { title: "O Céu e o Inferno", author: "Allan Kardec", publisher: "FEB", year: 1865, quantityEmprestimo: 2, quantityVenda: 2, priceVenda: 30.00 },
    { title: "O Livro dos Médiuns", author: "Allan Kardec", publisher: "FEB", year: 1861, quantityEmprestimo: 3, quantityVenda: 2, priceVenda: 39.90 },
    { title: "Nosso Lar", author: "André Luiz / Francisco C. Xavier", publisher: "FEB", year: 1944, quantityEmprestimo: 5, quantityVenda: 0, priceVenda: null },
    { title: "Os Mensageiros", author: "André Luiz / Francisco C. Xavier", publisher: "FEB", year: 1944, quantityEmprestimo: 3, quantityVenda: 1, priceVenda: 28.00 },
    { title: "Missionários da Luz", author: "André Luiz / Francisco C. Xavier", publisher: "FEB", year: 1945, quantityEmprestimo: 2, quantityVenda: 2, priceVenda: 32.00 },
    { title: "Paulo e Estêvão", author: "Emmanuel / Francisco C. Xavier", publisher: "FEB", year: 1945, quantityEmprestimo: 4, quantityVenda: 3, priceVenda: 27.50 },
    { title: "Renascer", author: "Joanna de Ângelis / Divaldo Franco", publisher: "LEAL", year: 1990, quantityEmprestimo: 3, quantityVenda: 1, priceVenda: 25.00 },
    { title: "Caminhando com Jesus", author: "Joanna de Ângelis / Divaldo Franco", publisher: "LEAL", year: 1996, quantityEmprestimo: 2, quantityVenda: 3, priceVenda: 29.90 },
    { title: "No Limiar do Eterno", author: "Humberto de Campos / Francisco C. Xavier", publisher: "FEB", year: 1938, quantityEmprestimo: 1, quantityVenda: 0, priceVenda: null },
    { title: "A Vida no Além", author: "Léon Denis", publisher: "FEB", year: 1924, quantityEmprestimo: 2, quantityVenda: 2, priceVenda: 22.00 },
    { title: "Memórias de um Suicida", author: "Yvonne A. Pereira", publisher: "FEB", year: 1955, quantityEmprestimo: 4, quantityVenda: 2, priceVenda: 34.00 },
    { title: "Chico Xavier — Além da Vida", author: "Celso Bogo", publisher: "Luz no Lar", year: 2002, quantityEmprestimo: 1, quantityVenda: 3, priceVenda: 38.00 },
  ];

  for (const book of books) {
    await prisma.book.create({ data: book }).catch(() => {});
  }

  // 10 leitores
  const borrowers = [
    { name: "Maria das Graças Silva", cpf: "12345678901", address: "Rua das Flores, 123, São Paulo, SP", phone: "(11) 99999-1111", email: "maria@email.com" },
    { name: "João Carlos Oliveira", cpf: "98765432100", address: "Av. Paulista, 456, São Paulo, SP", phone: "(11) 99999-2222", email: "joao@email.com" },
    { name: "Ana Paula Santos", cpf: "11122233344", address: "Rua Augusta, 789, São Paulo, SP", phone: "(11) 99999-3333" },
    { name: "Roberto Ferreira Lima", cpf: "22233344455", address: "Rua Vergueiro, 321, São Paulo, SP", phone: "(11) 97777-4444", email: "roberto@email.com" },
    { name: "Luciana Almeida Costa", cpf: "33344455566", address: "Av. Brasil, 100, Campinas, SP", phone: "(19) 98888-5555" },
    { name: "Marcos Vinicius Pereira", cpf: "44455566677", address: "Rua das Acácias, 50, Guarulhos, SP", phone: "(11) 96666-6666", email: "marcos@email.com" },
    { name: "Sônia Regina Teixeira", cpf: "55566677788", address: "Rua Ipiranga, 200, São Paulo, SP", phone: "(11) 95555-7777" },
    { name: "Cláudio Henrique Gomes", cpf: "66677788899", address: "Av. Santo André, 77, Santo André, SP", phone: "(11) 94444-8888" },
    { name: "Beatriz Nascimento Rocha", cpf: "77788899900", address: "Rua Liberdade, 88, São Paulo, SP", phone: "(11) 93333-9999", email: "beatriz@email.com" },
    { name: "Fernando Augusto Melo", cpf: "88899900011", address: "Rua Consolação, 999, São Paulo, SP", phone: "(11) 92222-0000" },
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
