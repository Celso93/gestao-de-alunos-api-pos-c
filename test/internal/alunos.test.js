import app from '../../src/app.js';
import { expect } from 'chai';
import { comTokenDoAdmin } from '../helpers/auth.js';
import { createStudent } from '../helpers/alunos.js';
import { alunosFixture } from '../fixtures/alunos.js';


describe('Alunos', () => {

  let authorization;

  beforeEach(async () => {
    authorization = await comTokenDoAdmin(app);
  });

  it('should sign up a new student', async () => {
    const aluno = alunosFixture.aleatorio();
    const alunoResponse = await createStudent(aluno, authorization, app);

    expect(alunoResponse.status).to.equal(201);
    expect(alunoResponse.body).to.have.property('nome', aluno.nome);
    expect(alunoResponse.body).to.have.property('role', 'aluno');
  })

  it('should return 409 for duplicate student', async () => {
    const aluno = alunosFixture.alunoFixo
    const alunoResponse = await createStudent(aluno, authorization, app);

    expect(alunoResponse.status).to.equal(409);
    expect(alunoResponse.body).to.have.property('error', 'Já existe um aluno cadastrado com essa matrícula ou e-mail.');
  })
});
