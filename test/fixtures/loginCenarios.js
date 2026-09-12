// Fixture de cenários para DDT (Data Driven Testing) do login.
// Cada objeto do array é um cenário: entrada + resultado esperado.
export const loginCenarios = [
  {
    titulo: 'senha errada retorna 401',
    email: 'admin@escola.com',
    senha: 'senhaErrada',
    statusEsperado: 401,
    erroEsperado: 'E-mail ou senha inválidos.',
  },
  {
    titulo: 'campos vazios retorna 400',
    email: 'admin@escola.com',
    senha: null,
    statusEsperado: 400,
    erroEsperado: 'Os campos "email" e "senha" são obrigatórios.',
  },
];
