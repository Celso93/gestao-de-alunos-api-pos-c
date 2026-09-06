import app from '../../src/app.js';
import { expect } from 'chai';
import request from 'supertest';

import { loginUser } from '../helpers/auth.js';
import { createStudent } from '../helpers/alunos.js';
import { alunosFixture } from '../fixtures/alunos.js';


describe('Disciplinas', () => {

    let loginResponse, alunoResponse, aluno;

    beforeEach(async () => {
        loginResponse = await loginUser(app, 'admin@escola.com', 'admin123');
        const token = loginResponse.body.token;

        aluno = alunosFixture.aleatorio();

        // gestão de dados (pré-condição): se o aluno já existe, apaga antes de recriar
        const listaResponse = await request(app)
            .get('/api/admin/alunos')
            .set('Authorization', `Bearer ${token}`);

        const alunoExistente = listaResponse.body.find((a) => a.email === aluno.email);

        if (alunoExistente) {
            await request(app)
                .delete(`/api/admin/alunos/${alunoExistente.id}`)
                .set('Authorization', `Bearer ${token}`);
        }

        alunoResponse = await createStudent(app, aluno, loginResponse);
    });

    afterEach(async () => {
        // gestão de dados (limpeza): garante que o aluno criado no teste seja apagado
        if (alunoResponse?.body?.id) {
            await request(app)
                .delete(`/api/admin/alunos/${alunoResponse.body.id}`)
                .set('Authorization', `Bearer ${loginResponse.body.token}`);
        }
    });

    it('devo conseguir matricular um aluno novo a uma disciplina nova', async () => {
        const disciplinaResponse = await request(app)
            .post('/api/admin/disciplinas')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${loginResponse.body.token}`)
            .expect(201)
            .send({
                nome: `Matemática${Date.now()}`,
                codigo: `MAT${Date.now()}`,
                cargaHoraria: 80
            })

        const matriculaResponse = await request(app)
            .post(`/api/admin/disciplinas/${disciplinaResponse.body.id}/matriculas`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${loginResponse.body.token}`)
            .send({
                alunoId: alunoResponse.body.id,
            })

        expect(matriculaResponse.status).to.equal(201);
        expect(matriculaResponse.body).to.have.property('alunoId', alunoResponse.body.id);
        expect(matriculaResponse.body).to.have.property('disciplinaId', disciplinaResponse.body.id);
        expect(matriculaResponse.body).to.have.property('dataMatricula').not.null;
    })
});
