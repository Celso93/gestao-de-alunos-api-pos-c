export const alunosFixture = {
  aleatorio: () => ({
    nome: `Ana Souza${Date.now()}${Math.floor(Math.random() * 100)}`,
    email: `ana.souza${Date.now()}${Math.floor(Math.random() * 100)}@example.com`,
    matricula: `${Date.now()}${Math.floor(Math.random() * 100)}`,
    senha: '123456',
  }),
  alunoFixo: {
    nome: 'Ana Souza',
    email: 'ana.souza@example.com',
    matricula: '2024001',
    senha: '123456',
  },
};
