import app from '../../src/app.js';
import { expect } from 'chai';

import { loginUser } from '../helpers/auth.js';
import { loginCenarios } from '../fixtures/loginCenarios.js';

describe('Login - DDT (cenários via fixture)', () => {
  loginCenarios.forEach((cenario) => {
    it(`deve tratar credenciais inválidas: ${cenario.titulo}`, async () => {
      const response = await loginUser(cenario.email, cenario.senha, app);

      expect(response.status).to.equal(cenario.statusEsperado);
      expect(response.body).to.have.property('error', cenario.erroEsperado);
    });
  });
});
